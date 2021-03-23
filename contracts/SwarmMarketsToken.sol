//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/presets/ERC20PresetFixedSupply.sol";

import "hardhat/console.sol";

contract SwarmMarketsToken is ERC20PresetFixedSupply {
    /**
     * See {ERC20PresetFixedSupply-constructor}.
     */
    constructor(uint256 initialSupply, address owner)
        ERC20PresetFixedSupply("Swarm Markets Token", "SMT", initialSupply, owner)
    {} // solhint-disable-line no-empty-blocks
}
