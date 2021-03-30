//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "../SmtVesting.sol";

contract SmtVestingWithSetters is SmtVesting {
  function setFirstYCBClaimed(bool _firstYCBClaimed) public {
    firstYCBClaimed = _firstYCBClaimed;
  }

  function setLastClaimedBlock(uint256 _lastClaimedBlock) public {
    lastClaimedBlock = _lastClaimedBlock;
  }
}
