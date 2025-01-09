// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

import { SafeTransferLib } from "solady/src/utils/SafeTransferLib.sol";

import { SmtVestingV3 } from "./vSMT3.sol";
import { vSMTProxy } from "./vSMTProxy.sol";

contract vSMTHandler {
    address private constant vSMT = 0xdcF74abeDE98E79b8299e3A9B13C214A75694274;

    function createProxyClaimSMT() external {
        _createProxyClaimSMT();
    }

    function createProxyClaimSMTTimes(uint256 times) external {
        for (uint256 i = 0; i < times; ++i) {
            _createProxyClaimSMT();
        }
    }

    function _createProxyClaimSMT() private {
        vSMTProxy proxy = new vSMTProxy();

        SmtVestingV3(vSMT).addWhitelistedAddress(address(proxy));

        SafeTransferLib.safeTransferFrom(vSMT, msg.sender, address(proxy), SafeTransferLib.balanceOf(vSMT, msg.sender));

        proxy.withdrawSMT(msg.sender, vSMT);
    }
}
