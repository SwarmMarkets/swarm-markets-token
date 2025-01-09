//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.27;

import { ERC20Burnable, ERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract MTRX is ERC20Burnable, Ownable {
    /**
     * KnowYourAsset
     */
    string public KYA;

    /**
     * See {ERC20Burnable-constructor}.
     */
    constructor(address _owner) ERC20("MTRX", "MTRX") {
        _mint(_owner, 250000000 * 10 ** 18);
        _transferOwnership(_owner);
    }

    /**
     * Sets KYA.
     */
    function setKYA(string calldata _knowYourAsset) external onlyOwner {
        KYA = _knowYourAsset;
    }
}
