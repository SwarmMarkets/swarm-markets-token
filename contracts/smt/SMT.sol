//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract SwarmMarketsToken is ERC20, Ownable {
    string public KYA;

    /**
     * See {ERC20PresetFixedSupply-constructor}.
     */
    // solhint-disable-next-line no-empty-blocks
    constructor(address _owner) ERC20("Swarm Markets", "SMT") {
        _mint(_owner, 250000000 * 10 ** decimals());
    }

    function setKYA(string calldata _knowYourAsset) external onlyOwner {
        KYA = _knowYourAsset;
    }
}
