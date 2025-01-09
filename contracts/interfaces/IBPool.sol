//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

/**
 * @title IBPool
 * @author Swarm
 * @dev Balancer BPool contract interface.
 *
 */
interface IBPool {
    function getDenormalizedWeight(address token) external view returns (uint256);

    function getBalance(address token) external view returns (uint256);

    function calcOutGivenIn(
        uint256 tokenBalanceIn,
        uint256 tokenWeightIn,
        uint256 tokenBalanceOut,
        uint256 tokenWeightOut,
        uint256 tokenAmountIn,
        uint256 swapFee
    ) external pure returns (uint256 tokenAmountOut);
}
