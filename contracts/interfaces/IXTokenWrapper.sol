//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

/**
 * @title IXTokenWrapper
 * @author Swarm
 * @dev XTokenWrapper Interface.
 *
 */
interface IXTokenWrapper {
    /**
     * @dev Token to xToken registry.
     */
    function tokenToXToken(address _token) external view returns (address);
}
