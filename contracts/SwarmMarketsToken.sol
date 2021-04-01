//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/presets/ERC20PresetFixedSupply.sol";

import "hardhat/console.sol";

contract SwarmMarketsToken is ERC20PresetFixedSupply {
    /**
     * See {ERC20PresetFixedSupply-constructor}.
     */
    // solhint-disable-next-line no-empty-blocks
    constructor(address owner) ERC20PresetFixedSupply("Swarm Markets Token", "SMT", 250000000 * 10**18, owner) {}
}
