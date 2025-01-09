//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

/**
 * @title IBRegistry
 * @author Swarm
 * @dev Balancer BRegistry contract interface.
 *
 */

interface IBRegistry {
    function getBestPoolsWithLimit(
        address fromToken,
        address destToken,
        uint256 limit
    ) external view returns (address[] memory);
}
