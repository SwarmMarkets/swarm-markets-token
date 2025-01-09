// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

import { SafeTransferLib } from "solady/src/utils/SafeTransferLib.sol";

import { SmtVestingV3 } from "./vSMT3.sol";

contract vSMTProxy {
    address private constant SMT = 0xB17548c7B510427baAc4e267BEa62e800b247173;

    function withdrawSMT(address account, address vSMT) external {
        SmtVestingV3(vSMT).claimMaximumTokensPerMonth();

        SafeTransferLib.safeTransfer(SMT, account, SafeTransferLib.balanceOf(SMT, address(this)));

        SafeTransferLib.safeTransfer(vSMT, account, SafeTransferLib.balanceOf(vSMT, address(this)));
    }
}
