//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.7/interfaces/AggregatorV2V3Interface.sol";
import "./interfaces/IBPool.sol";
import "./interfaces/IBRegistry.sol";
import "./interfaces/IEurPriceFeed.sol";
import "./interfaces/IXTokenWrapper.sol";

interface IDecimals {
    function decimals() external view returns (uint8);
}

/**
 * @title SmtPriceFeed
 * @author Protofire
 * @dev
 */
contract SmtPriceFeed is Ownable {
    using SafeMath for uint256;

    address public constant ETH_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    address public constant ONE = 10**18;

    /// @dev Address of BRegistry
    IBRegistry public registry;
    /// @dev Address of EurPriceFeed module
    IEurPriceFeed public eurPriceFeed;
    /// @dev Address of XTokenWrapper module
    IXTokenWrapper public xTokenWrapper;
    /// @dev Address smt
    address public smt;

    /**
     * @dev Emitted when `registry` address is set.
     */
    event RegistrySet(address registry);

    /**
     * @dev Emitted when `eurPriceFeed` address is set.
     */
    event EurPriceFeedSet(address eurPriceFeed);

    /**
     * @dev Emitted when `smt` address is set.
     */
    event SmtSet(address smt);

    /**
     * @dev Emitted when `xTokenWrapper` address is set.
     */
    event XTokenWrapperSet(address xTokenWrapper);

    /**
     * @dev Sets the values for {registry}, {eurPriceFeed} {smt} and {xTokenWrapper}.
     *
     * Sets ownership to the account that deploys the contract.
     *
     */
    constructor(
        address _registry,
        address _eurPriceFeed,
        address _smt,
        address _xTokenWrapper
    ) {
        _setRegistry(_registry);
        _setEurPriceFeed(_eurPriceFeed);
        _setSmt(_smt);
        _setXTokenWrapper(_xTokenWrapper);
    }

    /**
     * @dev Sets `_registry` as the new registry.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - `_registry` should not be the zero address.
     *
     * @param _registry The address of the registry.
     */
    function setRegistry(address _registry) external onlyOwner {
        _setRegistry(_registry);
    }

    /**
     * @dev Sets `_eurPriceFeed` as the new EurPriceFeed.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - `_eurPriceFeed` should not be the zero address.
     *
     * @param _eurPriceFeed The address of the EurPriceFeed.
     */
    function setEurPriceFeed(address _eurPriceFeed) external onlyOwner {
        _setEurPriceFeed(_eurPriceFeed);
    }

    /**
     * @dev Sets `_smt` as the new Smt.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - `_smt` should not be the zero address.
     *
     * @param _smt The address of the Smt.
     */
    function setSmt(address _smt) external onlyOwner {
        _setSmt(_smt);
    }

    /**
     * @dev Sets `_xTokenWrapper` as the new xTokenWrapper.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     * - `_xTokenWrapper` should not be the zero address.
     *
     * @param _xTokenWrapper The address of the xTokenWrapper.
     */
    function setXTokenWrapper(address _xTokenWrapper) external onlyOwner {
        _setXTokenWrapper(_xTokenWrapper);
    }

    /**
     * @dev Sets `_registry` as the new registry.
     *
     * Requirements:
     *
     * - `_registry` should not be the zero address.
     *
     * @param _registry The address of the registry.
     */
    function _setRegistry(address _registry) internal {
        require(_registry != address(0), "registry is the zero address");
        emit RegistrySet(_registry);
        registry = IBRegistry(_registry);
    }

    /**
     * @dev Sets `_eurPriceFeed` as the new EurPriceFeed.
     *
     * Requirements:
     *
     * - `_eurPriceFeed` should not be the zero address.
     *
     * @param _eurPriceFeed The address of the EurPriceFeed.
     */
    function _setEurPriceFeed(address _eurPriceFeed) internal {
        require(_eurPriceFeed != address(0), "eurPriceFeed is the zero address");
        emit EurPriceFeedSet(_eurPriceFeed);
        eurPriceFeed = IEurPriceFeed(_eurPriceFeed);
    }

    /**
     * @dev Sets `_smt` as the new Smt.
     *
     * Requirements:
     *
     * - `_smt` should not be the zero address.
     *
     * @param _smt The address of the Smt.
     */
    function _setSmt(address _smt) internal {
        require(_smt != address(0), "smt is the zero address");
        emit SmtSet(_smt);
        smt = _smt;
    }

    /**
     * @dev Sets `_xTokenWrapper` as the new xTokenWrapper.
     *
     * Requirements:
     *
     * - `_xTokenWrapper` should not be the zero address.
     *
     * @param _xTokenWrapper The address of the xTokenWrapper.
     */
    function _setXTokenWrapper(address _xTokenWrapper) internal {
        require(_xTokenWrapper != address(0), "xTokenWrapper is the zero address");
        emit FeeReceiverSet(_xTokenWrapper);
        xTokenWrapper = IXTokenWrapper(_xTokenWrapper);
    }

    /**
     * @dev Gets how many SMT represents the `_amount` of `_asset`.
     *
     * @param _asset address of asset to get the amount.
     * @param _tokenAmountIn amount of `_asset`.
     */
    function calculateAmount(address _asset, uint256 _tokenAmountIn) external view returns (uint256) {
        // get amount from some of the pools
        uint256 amount = getLowerAmountFromPools(_asset, _tokenAmountIn);

        // not pool with SMT/asset pair -> calculate base on SMT/ETH pool and Asset/ETH external price feed
        if (amount = 0) {
            uint256 ethSmtAmount = getLowerAmountFromPools(IXTokenWrapper.tokenToXToken(ETH_TOKEN_ADDRESS), ONE);
            address assetEthFeed = IEurPriceFeed.assetEthFeed(_asset);

            if (assetEthFeed != address(0)) {
                // always 18 decimals
                int256 assetEthPrice = AggregatorV2V3Interface(assetEthFeed).latestAnswer();
                if (assetEthPrice > 0) {
                    uint8 assetDecimals = IDecimals(_asset).decimals();
                    uint256 assetToEthAmount = _tokenAmountIn.mul(uint256(assetEthPrice)).div(10**assetDecimals);
                    amount = assetToEthAmount.mul(ethSmtAmount).div(ONE);
                }
            }
        }

        return amount;
    }

    function getLowerAmountFromPools(address _asset, uint256 _tokenAmountIn) internal returns (uint256) {
        address[] memory poolAddresses = registry.getBestPoolsWithLimit(_asset, smt, 10);

        uint256 bestAmount;
        for (uint256 i = 0; i < poolAddresses.length; i++) {
            IBPool pool = IBPool(poolAddress);
            uint256 tokenBalanceIn = pool.getBalance(tokenIn);
            uint256 tokenBalanceOut = pool.getBalance(tokenOut);
            uint256 tokenWeightIn = pool.getDenormalizedWeight(tokenIn);
            uint256 tokenWeightOut = pool.getDenormalizedWeight(tokenOut);

            uint256 amount =
                pool.calcOutGivenIn(tokenBalanceIn, tokenWeightIn, tokenBalanceOut, tokenWeightOut, _tokenAmountIn, 0);

            if (amount > 0 && amount < bestAmount) {
                bestAmount = amount;
            }
        }

        return amount;
    }
}
