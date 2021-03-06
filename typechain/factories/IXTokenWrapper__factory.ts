/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IXTokenWrapper } from "../IXTokenWrapper";

export class IXTokenWrapper__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IXTokenWrapper {
    return new Contract(address, _abi, signerOrProvider) as IXTokenWrapper;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "tokenToXToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
