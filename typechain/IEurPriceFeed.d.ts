/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IEurPriceFeedInterface extends ethers.utils.Interface {
  functions: {
    "calculateAmount(address,uint256)": FunctionFragment;
    "getPrice(address)": FunctionFragment;
    "setAssetFeed(address,address)": FunctionFragment;
    "setAssetsFeeds(address[],address[])": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculateAmount",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getPrice", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setAssetFeed",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setAssetsFeeds",
    values: [string[], string[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAssetFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAssetsFeeds",
    data: BytesLike
  ): Result;

  events: {};
}

export class IEurPriceFeed extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IEurPriceFeedInterface;

  functions: {
    calculateAmount(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "calculateAmount(address,uint256)"(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPrice(
      _asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "getPrice(address)"(
      _asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAssetFeed(
      _asset: string,
      _feed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setAssetFeed(address,address)"(
      _asset: string,
      _feed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAssetsFeeds(
      _assets: string[],
      _feeds: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setAssetsFeeds(address[],address[])"(
      _assets: string[],
      _feeds: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  calculateAmount(
    _asset: string,
    _amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "calculateAmount(address,uint256)"(
    _asset: string,
    _amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPrice(
    _asset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "getPrice(address)"(
    _asset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAssetFeed(
    _asset: string,
    _feed: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setAssetFeed(address,address)"(
    _asset: string,
    _feed: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAssetsFeeds(
    _assets: string[],
    _feeds: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setAssetsFeeds(address[],address[])"(
    _assets: string[],
    _feeds: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    calculateAmount(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calculateAmount(address,uint256)"(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrice(_asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getPrice(address)"(
      _asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAssetFeed(
      _asset: string,
      _feed: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setAssetFeed(address,address)"(
      _asset: string,
      _feed: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setAssetsFeeds(
      _assets: string[],
      _feeds: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    "setAssetsFeeds(address[],address[])"(
      _assets: string[],
      _feeds: string[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    calculateAmount(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calculateAmount(address,uint256)"(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrice(
      _asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "getPrice(address)"(
      _asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAssetFeed(
      _asset: string,
      _feed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setAssetFeed(address,address)"(
      _asset: string,
      _feed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAssetsFeeds(
      _assets: string[],
      _feeds: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setAssetsFeeds(address[],address[])"(
      _assets: string[],
      _feeds: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calculateAmount(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "calculateAmount(address,uint256)"(
      _asset: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrice(
      _asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "getPrice(address)"(
      _asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAssetFeed(
      _asset: string,
      _feed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setAssetFeed(address,address)"(
      _asset: string,
      _feed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAssetsFeeds(
      _assets: string[],
      _feeds: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setAssetsFeeds(address[],address[])"(
      _assets: string[],
      _feeds: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
