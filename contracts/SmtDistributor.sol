//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

import { Ownable } from "solady/src/auth/Ownable.sol";
import { SafeTransferLib } from "solady/src/utils/SafeTransferLib.sol";

contract SmtDistributor is Ownable {
    using SafeTransferLib for address;

    error ZeroTokenAddress();
    error NoTotalAmountProvided();
    error NoRewardsProvided();
    error TotalAmountMismatch(uint256 accByRewards, uint256 totalAmount);
    error ZeroRewardsProvidedFor(address beneficiar);

    /// @dev Emitted when `beneficiary` claims its `reward`.
    event Claim(address indexed beneficiary, uint256 reward);

    struct Reward {
        address beneficiary;
        uint256 amount;
    }

    /// @dev ERC20 basic token contract being held
    address public token;

    /// @dev Beneficiaries of reward tokens
    mapping(address => uint256) public beneficiaries;

    /**
     * @dev Sets the value for {token}.
     *
     * Sets ownership to the account that deploys the contract.
     *
     */
    constructor(address _token, address _owner) {
        require(_token != address(0), ZeroTokenAddress());
        token = _token;

        _initializeOwner(_owner);
    }

    /**
     * @dev Deposits a new `totalAmount` to be claimed by beneficiaries distrubuted in `rewards`.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - the accumulated rewards' amount should be equal to `totalAmount`.
     *
     * @param rewards Array indicating each benaficiary reward from the total to be deposited.
     * @param totalAmount Total amount to be deposited.
     */
    function depositRewards(Reward[] memory rewards, uint256 totalAmount) external onlyOwner returns (bool) {
        require(totalAmount > 0, NoTotalAmountProvided());
        require(rewards.length > 0, NoRewardsProvided());

        uint256 accByRewards = 0;
        for (uint256 i = 0; i < rewards.length; i++) {
            Reward memory reward = rewards[i];
            accByRewards += reward.amount;
            beneficiaries[reward.beneficiary] += reward.amount;
        }

        require(accByRewards == totalAmount, TotalAmountMismatch(accByRewards, totalAmount));

        token.safeTransferFrom(msg.sender, address(this), totalAmount);

        return true;
    }

    /**
     * @dev Claims beneficiary reward.
     */
    function claim() external returns (bool) {
        uint256 amount = beneficiaries[msg.sender];
        require(amount > 0, ZeroRewardsProvidedFor(msg.sender));

        beneficiaries[msg.sender] = 0;

        token.safeTransfer(msg.sender, amount);

        emit Claim(msg.sender, amount);

        return true;
    }
}
