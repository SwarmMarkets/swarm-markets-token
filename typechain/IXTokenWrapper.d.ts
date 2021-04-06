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

interface IXTokenWrapperInterface extends ethers.utils.Interface {
  functions: {
    "tokenToXToken(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "tokenToXToken",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "tokenToXToken",
    data: BytesLike
  ): Result;

  events: {};
}

export class IXTokenWrapper extends Contract {
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

  interface: IXTokenWrapperInterface;

  functions: {
    tokenToXToken(_token: string, overrides?: CallOverrides): Promise<[string]>;

    "tokenToXToken(address)"(
      _token: string,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  tokenToXToken(_token: string, overrides?: CallOverrides): Promise<string>;

  "tokenToXToken(address)"(
    _token: string,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    tokenToXToken(_token: string, overrides?: CallOverrides): Promise<string>;

    "tokenToXToken(address)"(
      _token: string,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    tokenToXToken(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "tokenToXToken(address)"(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    tokenToXToken(
      _token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "tokenToXToken(address)"(
      _token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
