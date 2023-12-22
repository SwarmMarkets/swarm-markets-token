//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

import { IERC20, ERC20, ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

interface IERC20Burnable is IERC20 {
    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) external;
}

/**
 * @title MATR vesting
 * @author Swarm
 * @dev Contract module used to lock SMT during Vesting period.
 */
contract vMATR is AccessControl, ERC20Pausable {
    error ZeroAddressPasted();
    error InvalidStartTime(uint256 currentStartTime);
    error StartTimeMustBeGreaterThanCurrent(uint256 givenStartTime);
    error DistributionStartTimeIsNotSet();
    error GivenAmountIsTooBig(uint256 rquiredAmount, uint256 givenAmount);
    error NoClaimableAmount();
    error VestingNotStarted();
    error OnlyWhitelistedTransfer();
    error InvalidAddressToRemove(address toRemove);

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    /// @dev multiplier constants
    uint256 private constant VESTING_TIME = 10 minutes;

    /// @dev ERC20 basic token contract being held
    IERC20Burnable public acceptedToken;

    /// @dev distribution start timestamp
    uint256 public distributionStartTime;
    /// @dev Know Your Asset
    string public kya;

    /// @dev trasnferable addresses whitelisted
    mapping(address => bool) public whitelisted;
    /// @dev trasnferable addresses whitelisted
    mapping(address => uint256) public claimings;

    mapping(uint256 => uint256) public multiplier;

    /// @dev Emitted when `owner` claims.
    event Claim(address indexed owner, uint256 amount);
    /// @dev Emitted when `owner` claims.
    event AcceptedTokenSet(address _acceptedToken);
    /// @dev Emitted when `owner` claims.
    event StartTimeSet(uint256 startTime);
    /// @dev Emitted when one address is included in trasnferable whitelisted.
    event WhitelistedAddressAdded(address whitelisted);
    /// @dev Emitted when one address is included in trasnferable whitelisted.
    event WhitelistedAddressRemoved(address removed);
    event KYAset(string kya);

    modifier zeroAddressCheck(address _address) {
        if (_address == address(0)) {
            revert ZeroAddressPasted();
        }
        _;
    }

    modifier isDistributionTimeSet() {
        if (distributionStartTime == 0) {
            revert DistributionStartTimeIsNotSet();
        }
        _;
    }

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
     * account that deploys the contract.
     * Sets the value for {distributionStartTime}, signaling that distribution yet needs to be determined by admin
     *
     * Sets ownership to the given `_owner`.
     * See {ERC20-constructor}.
     */
    constructor() ERC20("vMATR", "vMATR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        for (uint8 i = 0; i < 10; ) {
            multiplier[i] = i + 1;
            unchecked {
                ++i;
            }
        }
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
    function setAcceptedToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) zeroAddressCheck(_token) {
        acceptedToken = IERC20Burnable(_token);
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
        acceptedToken.transferFrom(msg.sender, address(this), _amount);

        _mint(msg.sender, _amount);
    }

    /**
     * @dev sets kya
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     *
     */
    function setKYA(string calldata _knowYourAsset) external onlyRole(DEFAULT_ADMIN_ROLE) {
        kya = _knowYourAsset;
        emit KYAset(_knowYourAsset);
    }

    /**
     * @dev add _address to the whitlist, signaling that it can make transfers of this token
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     * - `_address` can not be zero address
     */
    function addWhitelistedAddress(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) zeroAddressCheck(_address) {
        whitelisted[_address] = true;
        emit WhitelistedAddressAdded(_address);
    }

    /**
     * @dev add _address to the whitlist, signaling that it can make transfers of this token
     *
     * Requirements:
     *
     * - the caller must have DEFAULT_ADMIN_ROLE.
     * - `_address` can not be zero address
     */
    function removeWhitelistedAddress(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (whitelisted[_address] == false) {
            revert InvalidAddressToRemove(_address);
        }

        whitelisted[_address] = false;
        emit WhitelistedAddressRemoved(_address);
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
        if ((distributionStartTime != 0 && startTime > distributionStartTime) || startTime < block.timestamp) {
            revert InvalidStartTime(startTime);
        }

        if (distributionStartTime != startTime) {
            distributionStartTime = startTime;
            emit StartTimeSet(startTime);
        }
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
    function pause() external onlyRole(PAUSER_ROLE) {
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
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
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
    function claim(uint256 amount) external {
        uint requiredAmount = getClaimableAmount(msg.sender);
        if (requiredAmount < amount) {
            revert GivenAmountIsTooBig(requiredAmount, amount);
        }

        _claim(amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);

        acceptedToken.burn(amount);
    }

    function burnFrom(address tokensOwner, uint256 amount) external {
        _spendAllowance(tokensOwner, msg.sender, amount);
        _burn(tokensOwner, amount);

        acceptedToken.burn(amount);
    }

    /**
     * @dev claims maximun available amount from caller's holdings
     *
     */
    function claimMaximumAmount() external {
        uint256 requiredAmount = getClaimableAmount(msg.sender);
        if (requiredAmount == 0) {
            revert NoClaimableAmount();
        }

        _claim(requiredAmount);
    }

    /**
     * @dev calculates how much is currently available to be claimed by caller
     *
     * Requirements:
     *
     * - distributionStartTime must be different from 0
     * - if distributionStartTime os differenct in grater than current timestamp, this function reverts
     */
    function getClaimableAmount(address awarded) public view isDistributionTimeSet returns (uint256 amount) {
        uint256 current = currentVestingPeriodSinceStartTime();
        uint256 _claimings = claimings[awarded];
        uint256 balanceOnAuction = balanceOf(awarded) + _claimings;

        if (current < 10) {
            return ((balanceOnAuction * multiplier[current]) / 10) - _claimings;
        } else {
            return balanceOf(awarded);
        }
    }

    /**
     * @dev returns number of quarters passed from distributionStartTime
     */
    function currentVestingPeriodSinceStartTime() public view isDistributionTimeSet returns (uint256 currentQuarter) {
        uint256 startTime = distributionStartTime;

        if (startTime > block.timestamp) {
            revert VestingNotStarted();
        }

        return (block.timestamp - startTime) / VESTING_TIME;
    }

    /**
     * @dev check funds locked by this contract in terms of acceptedToken's balance
     * should be alkways equal to totalSupply, usefull as a doublecheck control
     */
    function getCurrentLockedAmount() external view returns (uint256 balanceOfAcceptedToken) {
        balanceOfAcceptedToken = acceptedToken.balanceOf(address(this));
    }

    /**
     * @dev only whitelisted address are allowed to transfer this token's ownership
     * - address 0x0 are allowed by default cause we need to burn and mint tokens
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);

        // Allow minting and burning
        if (from == address(0) || to == address(0)) {
            return;
        }

        if (!whitelisted[from]) {
            revert OnlyWhitelistedTransfer();
        }
    }

    function _claim(uint256 amount) internal {
        claimings[msg.sender] += amount;
        _burn(msg.sender, amount);

        acceptedToken.transfer(msg.sender, amount);

        emit Claim(msg.sender, amount);
    }
}
