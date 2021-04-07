//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;

contract XTokenWrapperMock {
    mapping(address => address) public tokenToXToken;

    function setTokenToXToken(address token, address xToken) external {
      tokenToXToken[token] = xToken;
    }

}
