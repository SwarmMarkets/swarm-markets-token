//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract SmtVesting is Ownable {
    using SafeMath for uint256;

    /// @dev ERC20 basic token contract being held
    IERC20 public token;

    /// @dev Block number where the contract is deployed
    uint256 public immutable initialBlock;

    uint256 private constant DAY = 5760; // 24*60*60/15
    uint256 private constant WEEK = 40320; // 7*24*60*60/15
    uint256 private constant YEAR = 2102400; // 365*24*60*60/15

    uint256 private constant INITAL_ANUAL_DIST = 62500000 * 10**18;
    uint256 private constant WEEK_BATCH_DIV = 45890222137623526749; //(0.995^0 + 0.995^1 ... + 0.995^51) = 45,894396603

    // YCB = year comunity batch
    bool public firstYCBClaimed;
    uint256 public lastClaimedBlock;

    /**
     * @dev Sets the value for {initialBloc}.
     *
     * Sets ownership to the account that deploys the contract.
     *
     */
    constructor() {
        initialBlock = block.number;
        lastClaimedBlock = block.number;
    }

    /**
     * @dev Sets the value for `token`.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - `_token` can't be zero address
     *
     */
    function setToken(address _token) external onlyOwner {
        require(_token != address(0), "token is the zero address");
        token = IERC20(_token);
    }

    function claim() external onlyOwner {
        uint256 amount = claimableAmount();
        lastClaimedBlock = block.number;
        firstYCBClaimed = true;
        token.transfer(_msgSender(), amount);
    }

    function claimableAmount() public view returns (uint256) {
        return
            _claimableAmount(
                firstYCBClaimed,
                block.number,
                blockYear(block.number),
                blockWeek(block.number),
                lastClaimedBlock
            );
    }

    function _claimableAmount(
        bool isFirstYCBClaimed,
        uint256 blockNumber,
        uint256 cYear,
        uint256 cWeek,
        uint256 lastClaimedBlock
    ) internal view returns (uint256) {
        uint256 total = 0;
        uint256 lastClaimedBlockYear = blockYear(lastClaimedBlock);

        total += accumulateAnualComBatch(isFirstYCBClaimed, lastClaimedBlock, cYear);

        if (lastClaimedBlockYear < cYear) {
            total += accumulateFromPastYears(blockNumber, cYear, cWeek, lastClaimedBlock);
        } else {
            total += accumulateCurrentYear(blockNumber, cYear, cWeek, lastClaimedBlock);
        }

        return total;
    }

    function accumulateAnualComBatch(
        bool isFirstYCBClaimed,
        uint256 lastClaimedBlock,
        uint256 cYear
    ) public view returns (uint256) {
        uint256 acc = 0;
        uint256 lastClaimedBlockYear = blockYear(lastClaimedBlock);
        if (!isFirstYCBClaimed || lastClaimedBlockYear < cYear) {
            uint256 from = isFirstYCBClaimed ? lastClaimedBlockYear + 1 : 0;
            for (uint256 y = from; y <= cYear; y++) {
                acc += yearAnualCommunityBatch(y);
            }
        }

        return acc;
    }

    function accumulateFromPastYears(
        uint256 blockNumber,
        uint256 cYear,
        uint256 cWeek,
        uint256 lastClaimedBlock
    ) public view returns (uint256) {
        uint256 acc = 0;
        uint256 lastClaimedBlockYear = blockYear(lastClaimedBlock);
        uint256 lastClaimedBlockWeek = blockWeek(lastClaimedBlock);

        {
            // add what remains to claim from the claimed week
            uint256 lastClaimedYW = yearWeekRelaseBatch(lastClaimedBlockYear, lastClaimedBlockWeek);
            uint256 lastWBlock = yearWeekLastBlock(lastClaimedBlockYear, lastClaimedBlockWeek);
            acc += lastClaimedYW.mul(lastWBlock.sub(lastClaimedBlockWeek)).div(WEEK);
        }

        {
            uint256 ww;
            uint256 yy;
            // add remaining weeks of last claimed year
            for (ww = lastClaimedBlockWeek + 1; ww < 52; ww++) {
                acc += yearWeekRelaseBatch(lastClaimedBlockYear, ww);
            }

            // add complete weeks years until current year
            for (yy = lastClaimedBlockYear + 1; yy < cYear; yy++) {
                for (ww = 0; ww < 52; ww++) {
                    acc += yearWeekRelaseBatch(yy, ww);
                }
            }

            // current year until current week
            for (ww = 0; ww < cWeek; ww++) {
                acc += yearWeekRelaseBatch(cYear, ww);
            }
        }

        {
            // portion of current week
            uint256 currentYW = yearWeekRelaseBatch(cYear, cWeek);
            uint256 firstCWBlock = yearWeekFirstBlock(cYear, cWeek);
            acc += currentYW.mul(blockNumber.sub(firstCWBlock)).div(WEEK);
        }

        return acc;
    }

    function accumulateCurrentYear(
        uint256 blockNumber,
        uint256 cYear,
        uint256 cWeek,
        uint256 lastClaimedBlock
    ) public view returns (uint256) {
        uint256 acc = 0;
        uint256 lastClaimedBlockWeek = blockWeek(lastClaimedBlock);

        if (lastClaimedBlockWeek < cWeek) {
            // add what remains to claim from the claimed week
            uint256 lastClaimedYW = yearWeekRelaseBatch(cYear, lastClaimedBlockWeek);
            uint256 lastWBlock = yearWeekLastBlock(cYear, lastClaimedBlockWeek);
            acc += lastClaimedYW.mul(lastWBlock.sub(lastClaimedBlock)).div(WEEK);

            {
                uint256 ww;
                // add remaining weeks until current
                for (ww = lastClaimedBlockWeek + 1; ww < cWeek; ww++) {
                    acc += yearWeekRelaseBatch(cYear, ww);
                }
            }
        }

        {
            // portion of current week
            uint256 currentYW = yearWeekRelaseBatch(cYear, cWeek);
            uint256 firstCWBlock = yearWeekFirstBlock(cYear, cWeek);
            acc += currentYW.mul(blockNumber.sub(firstCWBlock)).div(WEEK);
        }

        return acc;
    }

    // Utils

    // (62500000) * (1 - 0.25)^n
    function yearAnualDistribution(uint256 year) public view returns (uint256) {
        // 25% of year reduction => (1-0.25) = 0.75 = 3/4
        uint256 reductionN = 3**year;
        uint256 reductionD = 4**year;
        return INITAL_ANUAL_DIST.mul(reductionN).div(reductionD);
    }

    // 20% yearAnualDistribution
    function yearAnualCommunityBatch(uint256 year) public view returns (uint256) {
        uint256 totalAnnualDistribution = yearAnualDistribution(year);
        return totalAnnualDistribution.mul(200).div(1000);
    }

    // 80% yearAnualDistribution
    function yearAnualWeeklyBatch(uint256 year) public view returns (uint256) {
        uint256 yearAC = yearAnualCommunityBatch(year);
        // console.log("yearAC", yearAC);
        return yearAnualDistribution(year).sub(yearAC);
    }

    // 0 based
    function weeklyRedPerc(uint256 week) public view returns (uint256) {
        uint256 reductionPerc = 10**18;
        uint256 nineNineFive = 10**18 - 5000000000000000;
        for (uint256 i = 0; i < week; i++) {
            reductionPerc = nineNineFive.mul(reductionPerc).div(10**18);
        }

        return reductionPerc;
    }

    // W1 amount for year
    // totalWeeklyAnualBatch / (0.995^0 + 0.995^1 ... + 0.995^51)
    function yearFrontWeightedWRB(uint256 year) public view returns (uint256) {
        uint256 totalWeeklyAnualBatch = yearAnualWeeklyBatch(year);

        return totalWeeklyAnualBatch.mul(10**18).div(WEEK_BATCH_DIV);
    }

    function yearWeekRelaseBatch(uint256 year, uint256 week) public view returns (uint256) {
        uint256 yearW1 = yearFrontWeightedWRB(year);
        uint256 weeklyRedPercentage = weeklyRedPerc(week);

        return yearW1.mul(weeklyRedPercentage).div(10**18);
    }

    // year N first-block = block 1 + block per year * N
    function yearFirstBlock(uint256 year) public view returns (uint256) {
        return initialBlock.add(YEAR.mul(year));
    }

    function yearWeekFirstBlock(uint256 year, uint256 week) public view returns (uint256) {
        uint256 yFB = yearFirstBlock(year);
        return yFB.add(WEEK.mul(week));
    }

    function yearWeekLastBlock(uint256 year, uint256 week) public view returns (uint256) {
        return yearWeekFirstBlock(year, week + 1);
    }

    // year (zero based) = (block - block 1) / block per year
    function blockYear(uint256 blockNumber) public view returns (uint256) {
        return (blockNumber.sub(initialBlock)).div(YEAR);
    }

    // week (zero based) = (block - year N first-block) / block per week
    function blockWeek(uint256 blockNumber) public view returns (uint256) {
        return (blockNumber.sub(yearFirstBlock(blockYear(blockNumber)))).div(WEEK);
    }
}
