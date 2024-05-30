// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error ZeroAddressError();
error StartTimeError();
error StartTimeSetError();
error StartTimeNotSetError();
error OnlyWhitelistedTransfersError();
error AmountToClaimTooBigError(uint256 amountToClaim);
error NothingToClaimError();
error AccounMustBePAUSER(address _account);

/**
 * @title SmtVesting
 * @dev Contract module used to lock SMT during Vesting period.
 * @author Swarm
 */
contract SmtVesting is ERC20Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev ERC20 basic token contract being held
    IERC20 public acceptedToken;

    /// @dev Distribution start timestamp
    uint256 public vestingStartTime;

    /// @dev Know Your Asset
    string public KYA;

    /// @dev Transferable addresses whitelist
    mapping(address => bool) public whitelisted;

    /// @dev Claimed amount of tokens by address
    mapping(address => uint256) public claimedAmount;

    /**
     * @dev Emitted when `owner` claims.
     * @param owner The address of the owner claiming tokens.
     * @param amount The amount of tokens claimed.
     */
    event Claim(address indexed owner, uint256 amount);

    /**
     * @dev Emitted when `acceptedToken` is set.
     * @param _acceptedToken The address of the accepted token.
     */
    event AcceptedTokenSet(IERC20 _acceptedToken);

    /**
     * @dev Emitted when `vestingStartTime` is set.
     * @param vestingStartTime The start time of the vesting period.
     */
    event StartTimeSet(uint256 vestingStartTime);

    /**
     * @dev Emitted when one address is included in the transferable whitelist.
     * @param whitelisted The address added to the whitelist.
     */
    event WhitelistedAddress(address whitelisted);

    /**
     * @dev Ensures the address is not zero address.
     * @param _address The address to be checked.
     */
    modifier zeroAddressCheck(address _address) {
        if (_address == address(0)) revert ZeroAddressError();
        _;
    }

    /**
     * @dev Ensures the distribution time is set.
     */
    modifier isDistributionTimeSet() {
        if (vestingStartTime == 0) revert StartTimeNotSetError();
        _;
    }

    /**
     * @dev Constructor for initializing the contract.
     */
    constructor(
        address _admin,
        IERC20 _SMT
    ) ERC20("Swarm Markets Vesting Token v3", "vSMT3") zeroAddressCheck(_admin) zeroAddressCheck(address(_SMT)) {
        acceptedToken = _SMT;
        emit AcceptedTokenSet(_SMT);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
    }

    /**
     * @dev Sets the Know Your Asset (KYA) string.
     * @param _KYA The KYA string to be set.
     */
    function setKYA(string calldata _KYA) external onlyRole(DEFAULT_ADMIN_ROLE) {
        KYA = _KYA;
    }

    /**
     * @dev Sets the vesting start time.
     * @param _startTime The start time to be set.
     */
    function setStartTime(uint256 _startTime) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (vestingStartTime > 0) revert StartTimeSetError();
        if (_startTime < block.timestamp) revert StartTimeError();

        vestingStartTime = _startTime;
        emit StartTimeSet(_startTime);
    }

    /**
     * @dev Adds an address to the whitelist.
     * @param _address The address to be added to the whitelist.
     */
    function addWhitelistedAddress(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) zeroAddressCheck(_address) {
        whitelisted[_address] = true;
        emit WhitelistedAddress(_address);
    }

    /**
     * @dev Deposits tokens to the contract.
     * @param _amount The amount of tokens to be deposited.
     */
    function deposit(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        acceptedToken.transferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
    }

    /**
     * @dev Claims the specified amount of tokens.
     * @param amount The amount of tokens to claim.
     */
    function claim(uint256 amount) public isDistributionTimeSet {
        uint256 claimableAmount = amountToClaim(msg.sender);
        if (amount == 0) revert NothingToClaimError();
        if (claimableAmount < amount) revert AmountToClaimTooBigError(amount);

        claimedAmount[msg.sender] += amount;
        _burn(msg.sender, amount);

        acceptedToken.transfer(msg.sender, amount);

        emit Claim(msg.sender, amount);
    }

    /**
     * @dev Claims the maximum tokens available for the current month.
     */
    function claimMaximumTokensPerMonth() external {
        claim(amountToClaim(msg.sender));
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
     * @dev Calculates the amount of tokens that can be claimed by the account.
     * @param account The address of the account.
     * @return amount The amount of tokens that can be claimed.
     */
    function amountToClaim(address account) public view returns (uint256 amount) {
        if (vestingStartTime == 0) revert StartTimeNotSetError();

        uint256 initialBalance = balanceOf(account) + claimedAmount[account];

        if (block.timestamp >= vestingStartTime + 30 days) {
            return (initialBalance * 1) / 6 - claimedAmount[account];
        } else if (block.timestamp >= vestingStartTime + (2 * 30 days)) {
            return (initialBalance * 2) / 6 - claimedAmount[account];
        } else if (block.timestamp >= vestingStartTime + (3 * 30 days)) {
            return (initialBalance * 3) / 6 - claimedAmount[account];
        } else if (block.timestamp >= vestingStartTime + (4 * 30 days)) {
            return (initialBalance * 4) / 6 - claimedAmount[account];
        } else if (block.timestamp >= vestingStartTime + (5 * 30 days)) {
            return (initialBalance * 5) / 6 - claimedAmount[account];
        } else if (block.timestamp >= vestingStartTime + (6 * 30 days)) {
            return (initialBalance * 6) / 6 - claimedAmount[account];
        }
    }

    /**
     * @dev Returns the current locked amount of accepted tokens in the contract.
     * @return balanceOfAcceptedToken The balance of accepted tokens.
     */
    function getCurrentLockedAmount() external view returns (uint256 balanceOfAcceptedToken) {
        balanceOfAcceptedToken = acceptedToken.balanceOf(address(this));
    }

    /**
     * @dev Internal function to update transfer details.
     * @param from The address transferring tokens.
     * @param to The address receiving tokens.
     * @param value The amount of tokens being transferred.
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        bool checkTransfer = whitelisted[from] || from == address(0) || to == address(0);
        if (!checkTransfer) revert OnlyWhitelistedTransfersError();
        super._update(from, to, value);
    }
}
