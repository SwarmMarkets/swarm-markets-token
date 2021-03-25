//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract SmtDistributor is Ownable {
    using SafeMath for uint256;

    struct Share {
        address beneficiary;
        uint256 amount;
    }

    /// @dev Emitted when `beneficiary` claims its `share`.
    event Claim(address indexed beneficiary, uint256 share);

    /// @dev ERC20 basic token contract being held
    IERC20 public token;

    /// @dev Beneficiaries of tokens which can claim
    mapping(address => uint256) public beneficiaries;

    /**
     * @dev Sets the value for {token}.
     *
     * Sets ownership to the account that deploys the contract.
     *
     */
    constructor(address _token) {
        require(_token != address(0), "token is the zero address");
        token = IERC20(_token);
    }

    /**
     * @dev Deposits a new `totalAmount` to be claimed by beneficiaries distrubuted in `shares`.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - `shares` the accumulated shares' amount should be equal to `totalAmount`.
     *
     * @param shares Array indicating each benaficiary share from the total to be deposited.
     * @param totalAmount Total amount to be deposited.
     */
    function depositShares(Share[] memory shares, uint256 totalAmount) public onlyOwner returns (bool) {
        require(totalAmount > 0, "totalAmount is zero");
        require(shares.length > 0, "shares can not be empty");
        require(token.transferFrom(_msgSender(), address(this), totalAmount), "Transfer failed");

        uint256 accByShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            Share memory currentShare = shares[i];
            accByShares += currentShare.amount;
            beneficiaries[currentShare.beneficiary] += currentShare.amount;
        }

        require(accByShares == totalAmount, "total amount mismatch");

        return true;
    }

    function claim() public returns (bool) {
        uint256 amount = beneficiaries[_msgSender()];
        beneficiaries[_msgSender()] = 0;

        emit Claim(_msgSender(), amount);

        require(token.transfer(_msgSender(), amount), "Transfer failed");
        return true;
    }
}
