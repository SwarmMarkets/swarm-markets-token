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

    uint256 public totalClaimed;

    uint256 public lastYCBClaimed;
    uint256 public lastClaimedBlock;



    /**
     * @dev Sets the value for {initialBloc}.
     *
     * Sets ownership to the account that deploys the contract.
     *
     */
    constructor() {
        initialBlock = block.number;
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


    // current year (zero based) = (current block - block 1) / block per year
    function currentYear() public view returns (uint256) {
        return blockYear(block.number);
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
        return yearWeekFirstBlock(year, week + 1).sub(1);
    }

    // current week (zero based) = (current block - year N first-block) / block per week
    function currentYearWeek() public view returns (uint256) {
        return (block.number.sub(yearFirstBlock(currentYear()))).div(WEEK);
    }

    function blockYear(uint256 blockNumber) public view returns (uint256) {
      return (blockNumber.sub(initialBlock)).div(YEAR);
    }

    function blockWeek(uint256 blockNumber) public view returns (uint256) {
      return (blockNumber.sub(yearFirstBlock(blockYear(blockNumber)))).div(WEEK);
    }
}
