//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Detailed is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _setupDecimals(decimals_);
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burnFrom(address account, uint256 amount) public {
        _burn(account, amount);
    }
}
