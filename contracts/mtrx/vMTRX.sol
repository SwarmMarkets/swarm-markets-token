//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import { ERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MTRX vesting
 * @author Swarm
 * @dev Contract module used to lock SMT during Vesting period.
 */
contract MTRXvesting is AccessControl, ERC20Pausable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev ERC20 basic token contract being held
    IERC20 public acceptedToken;

    /// @dev distribution start timestamp
    uint256 public distributionStartTime;
    /// @dev Know Your Asset
    string public KYA;
    /// @dev time constants (number of seconds in one quarter)
    uint256 private constant SECONDS_IN_QUARTER = 7889238; // 60*60*24×30,436875*3 = 7889238

    /// @dev trasnferable addresses whitelist
    mapping(address => bool) public whitelist;
    /// @dev trasnferable addresses whitelist
    mapping(address => uint256) public claimings;

    /// @dev Emitted when `owner` claims.
    event Claim(address indexed owner, uint256 amount);
    /// @dev Emitted when `owner` claims.
    event AcceptedTokenSet(address _acceptedToken);
    /// @dev Emitted when `owner` claims.
    event StartTimeSet(uint256 startTime);
    /// @dev Emitted when one address is included in trasnferable whitelist.
    event WhitelistedAddress(address whitelisted);

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
     * account that deploys the contract.
     * Sets the value for {distributionStartTime}, signaling that distribution yet needs to be determined by admin
     *
     * Sets ownership to the given `_owner`.
     * See {ERC20-constructor}.
     */
    constructor(address admin) ERC20("Vesting MTRX Token", "MTRX") {
        distributionStartTime = 0;

        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);
    }

    /**
     * @dev Sets the value for `acceptedToken`.
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     * - `_token` can't be zero address
     * - `acceptedToken` should not be already set
     *
     */
    function setAcceptedToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_token != address(0), "token is the zero address");
        require(address(acceptedToken) == address(0), "token is already set");
        acceptedToken = IERC20(_token);
        emit AcceptedTokenSet(_token);
    }

    /**
     * @dev Locks certain  _amount of `acceptedToken`.
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     * - `acceptedToken` need tbe approved first by caller on `acceptedToken` contract
     */
    function deposit(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        acceptedToken.transferFrom(_msgSender(), address(this), _amount);
        _mint(_msgSender(), _amount);
    }

    /**
     * @dev check funds locked by this contract in terms of acceptedToken's balance
     * should be alkways equal to totalSupply, usefull as a doublecheck control
     */
    function getCurrentLockedAmount() external view returns (uint256 balanceOfAcceptedToken) {
        return acceptedToken.balanceOf(address(this));
    }

    /**
     * @dev sets KYA
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     *
     */
    function setKYA(string calldata _knowYourAsset) external onlyRole(DEFAULT_ADMIN_ROLE) {
        KYA = _knowYourAsset;
    }

    /**
     * @dev add _address to the whitlist, signaling that it can make transfers of this token
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     * - `_address` can not be zero address
     */
    function addWhitelistedAddress(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_address != address(0), "_address is the zero address");
        whitelist[_address] = true;
        emit WhitelistedAddress(_address);
    }

    /**
     * @dev burns certain `amount` of vSMT token and release quivalent balance of acceptedToken
     *
     * Requirements:
     *
     * - amount must be lower or equal than ClaimableAmount
     * - distributionStartTime must be different than 0
     * - `_address` can not be zero address
     */
    function claim(uint256 amount) public {
        require(distributionStartTime != 0, "distributionStartTime not set");
        uint256 claimableAmount = getClaimableAmount(_msgSender());
        require(claimableAmount >= amount, "amount too big");

        claimings[_msgSender()] = claimings[_msgSender()] + (amount);

        acceptedToken.transfer(_msgSender(), amount);
        _burn(_msgSender(), amount);

        emit Claim(_msgSender(), amount);
    }

    /**
     * @dev claims maximun available amount from caller's holdings
     *
     */
    function claimMaximunAmount() external {
        uint256 amount = getClaimableAmount(_msgSender());
        require(amount != 0, "nothing to claim");
        claim(amount);
    }

    /**
     * @dev calculates how much is currently available to be claimed by caller
     * on Q1 20%, on Q2 40%, on Q3 60%, on Q4 80%, 100% after Q4
     *
     * Requirements:
     *
     * - distributionStartTime must be different from 0
     * - if distributionStartTime os differenct in grater than current timestamp, this function reverts
     */
    function getClaimableAmount(address awarded) public view returns (uint256 amount) {
        require(distributionStartTime != 0, "distributionSartTime not set");
        uint256 currentQuarter = currentQuarterSinceStartTime();
        uint256 balanceOnAuction = balanceOf(awarded) + (claimings[awarded]);
        if (currentQuarter == 0) {
            return ((balanceOnAuction * (2)) / (10)) - (claimings[awarded]);
        }
        if (currentQuarter == 1) {
            return ((balanceOnAuction * (4)) / (10)) - (claimings[awarded]);
        }
        if (currentQuarter == 2) {
            return ((balanceOnAuction * (6)) / (10)) - (claimings[awarded]);
        }
        if (currentQuarter == 3) {
            return ((balanceOnAuction * (8)) / (10)) - (claimings[awarded]);
        }
        if (currentQuarter >= 4) {
            return balanceOf(awarded);
        }
    }

    /**
     * @dev returns number of quarters passed from distributionStartTime
     */
    function currentQuarterSinceStartTime() public view returns (uint256 currentQuarter) {
        require(distributionStartTime != 0, "distributionStartTime not set");
        require(distributionStartTime < block.timestamp, "Vesting did not start yet");
        return (block.timestamp - (distributionStartTime)) / (SECONDS_IN_QUARTER);
    }

    /**
     * @dev sets distributionStartTime as the timestamp on which funds starts a progresive release
     *
     * Requirements:
     *
     * - distributionStartTime must be equal to 0
     * - distributionStartTime must be a unix timestamp format, grater than current timestamp
     */
    function setStartTime(uint256 startTime) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (distributionStartTime == 0) {
            require(startTime > block.timestamp, "Start time must be a future timestamp");
        } else {
            require(startTime < distributionStartTime, "startTime can only be moved backward after it has been set");
        }

        distributionStartTime = startTime;

        emit StartTimeSet(startTime);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev only whitelisted address are allowed to transfer this token's ownership
     * - address 0x0 are allowed by default cause we need to burn and mint tokens
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "ERC20Pausable: token transfer while paused");
        bool allowed = whitelist[from] || from == address(0) || to == address(0);
        require(allowed, "trasnfer is just allowed for whitelisted addresses");
    }
}
