//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/presets/ERC20PresetFixedSupply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SwarmMarketsToken is ERC20PresetFixedSupply, Ownable {
    string public KYA;

    /**
     * See {ERC20PresetFixedSupply-constructor}.
     */
    // solhint-disable-next-line no-empty-blocks
    constructor(
        address _owner
    ) ERC20PresetFixedSupply("Swarm Markets", "SMT", 250000000 * 10 ** 18, _owner) Ownable() {}

    function setKYA(string calldata _knowYourAsset) external onlyOwner {
        KYA = _knowYourAsset;
    }
}
