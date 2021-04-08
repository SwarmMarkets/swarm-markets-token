//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "../SmtVesting.sol";

contract SmtVestingWithSetters is SmtVesting {

  function claim(
    uint256 blockNumber
  ) external onlyOwner {
      uint256 amount = claimableAmount(firstYCBClaimed, blockNumber, lastClaimedBlock);
      lastClaimedBlock = blockNumber;
      firstYCBClaimed = true;
      emit Claim(owner(), amount);
      token.transfer(_msgSender(), amount);
  }

  function claimableAmount(
    bool isFirstYCBClaimed,
    uint256 blockNumber,
    uint256 lCdBlock
  ) public view returns (uint256) {
      return
          _claimableAmount(
              isFirstYCBClaimed,
              blockNumber,
              lCdBlock
          );
  }
}
