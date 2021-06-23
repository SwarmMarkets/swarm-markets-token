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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IBPoolInterface extends ethers.utils.Interface {
  functions: {
    "calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)": FunctionFragment;
    "getBalance(address)": FunctionFragment;
    "getDenormalizedWeight(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calcOutGivenIn",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "getBalance", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getDenormalizedWeight",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "calcOutGivenIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDenormalizedWeight",
    data: BytesLike
  ): Result;

  events: {};
}

export class IBPool extends Contract {
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

  interface: IBPoolInterface;

  functions: {
    calcOutGivenIn(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { tokenAmountOut: BigNumber }>;

    "calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { tokenAmountOut: BigNumber }>;

    getBalance(token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "getBalance(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getDenormalizedWeight(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getDenormalizedWeight(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  calcOutGivenIn(
    tokenBalanceIn: BigNumberish,
    tokenWeightIn: BigNumberish,
    tokenBalanceOut: BigNumberish,
    tokenWeightOut: BigNumberish,
    tokenAmountIn: BigNumberish,
    swapFee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"(
    tokenBalanceIn: BigNumberish,
    tokenWeightIn: BigNumberish,
    tokenBalanceOut: BigNumberish,
    tokenWeightOut: BigNumberish,
    tokenAmountIn: BigNumberish,
    swapFee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBalance(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  "getBalance(address)"(
    token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDenormalizedWeight(
    token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getDenormalizedWeight(address)"(
    token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    calcOutGivenIn(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBalance(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getBalance(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDenormalizedWeight(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getDenormalizedWeight(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    calcOutGivenIn(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBalance(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getBalance(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDenormalizedWeight(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getDenormalizedWeight(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calcOutGivenIn(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"(
      tokenBalanceIn: BigNumberish,
      tokenWeightIn: BigNumberish,
      tokenBalanceOut: BigNumberish,
      tokenWeightOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBalance(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getBalance(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDenormalizedWeight(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getDenormalizedWeight(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}