import hre, { ethers, network } from 'hardhat';
import { ContractFactory } from 'ethers';
import { IERC20Metadata, SmtVestingV3, VSMTHandler } from '../typechain';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { AccountTypes, getNetworkConfig } from '../utils/get-network-account';

const FIRST_ACC_ADDRESS = '0xe3685931a92749b32426cD34560e01C809ECe9fF';
const SECOND_ACC_ADDRESS = '0xd7Cb5426688699E60A90FBcca88EC76e5e926693';
const VSMT_ADMIN_ADDRESS = '0x5c573e7eE69926B79Be8283E4c421Ccca288bC06';

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const SMT_ADDRESS = '0xB17548c7B510427baAc4e267BEa62e800b247173';
const VSMT3_ADDRESS = '0xdcF74abeDE98E79b8299e3A9B13C214A75694274';

const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

describe('vSMT3Fix', () => {
  const addressZero = ethers.constants.AddressZero;

  before(async function () {
    await network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: getNetworkConfig('mainnet', AccountTypes.SwarmMnemonic).url!,
            blockNumber: 21321469,
            enable: true,
          },
        },
      ],
    });
  });

  after(async function () {
    await network.provider.request({
      method: 'hardhat_reset',
      params: [],
    });
  });

  async function fixture() {
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [FIRST_ACC_ADDRESS],
    });
    const first_acc = await ethers.getSigner(FIRST_ACC_ADDRESS);

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [SECOND_ACC_ADDRESS],
    });
    const second_acc = await ethers.getSigner(SECOND_ACC_ADDRESS);
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [VSMT_ADMIN_ADDRESS],
    });
    const vsmt_admin = await ethers.getSigner(VSMT_ADMIN_ADDRESS);
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [WETH_ADDRESS],
    });
    const weth = await ethers.getSigner(WETH_ADDRESS);
    await weth.sendTransaction({
      to: VSMT_ADMIN_ADDRESS,
      value: ethers.utils.parseEther('1'),
    });
    await weth.sendTransaction({
      to: FIRST_ACC_ADDRESS,
      value: ethers.utils.parseEther('1'),
    });
    await weth.sendTransaction({
      to: SECOND_ACC_ADDRESS,
      value: ethers.utils.parseEther('1'),
    });

    const SMT: IERC20Metadata = (await ethers.getContractAt(
      '@openzeppelin/contracts-v5/token/ERC20/extensions/IERC20Metadata.sol:IERC20Metadata',
      SMT_ADDRESS,
    )) as IERC20Metadata;
    const vSMT3: SmtVestingV3 = await ethers.getContractAt('SmtVestingV3', VSMT3_ADDRESS);

    const vSMTHandler: ContractFactory = await ethers.getContractFactory('vSMTHandler');
    const handler: VSMTHandler = (await vSMTHandler.deploy()) as VSMTHandler;
    await handler.deployed();

    await vSMT3.connect(vsmt_admin).grantRole(DEFAULT_ADMIN_ROLE, handler.address);
    await vSMT3.connect(vsmt_admin).addWhitelistedAddress(first_acc.address);
    await vSMT3.connect(vsmt_admin).addWhitelistedAddress(second_acc.address);
    await vSMT3.connect(vsmt_admin).addWhitelistedAddress(handler.address);

    return {
      first_acc,
      second_acc,
      vsmt_admin,
      SMT,
      vSMT3,
      handler,
    };
  }

  describe('Works', () => {
    it('createProxyClaimSMT', async () => {
      const { handler, first_acc, SMT, vSMT3 } = await loadFixture(fixture);

      await vSMT3.connect(first_acc).approve(handler.address, ethers.constants.MaxUint256);

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));

      await handler.connect(first_acc).createProxyClaimSMT();

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));

      await handler.connect(first_acc).createProxyClaimSMT();

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));

      await handler.connect(first_acc).createProxyClaimSMT();

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));

      await handler.connect(first_acc).createProxyClaimSMT();

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));
    });

    it('createProxyClaimSMTTimes', async () => {
      const { handler, first_acc, SMT, vSMT3 } = await loadFixture(fixture);

      await vSMT3.connect(first_acc).approve(handler.address, ethers.constants.MaxUint256);

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));

      await handler.connect(first_acc).createProxyClaimSMTTimes(20);

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(first_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(first_acc.address));
    });

    it('createProxyClaimSMTTimes', async () => {
      const { handler, second_acc, SMT, vSMT3 } = await loadFixture(fixture);

      await vSMT3.connect(second_acc).approve(handler.address, ethers.constants.MaxUint256);

      console.log('await vSMT3.balanceOf(second_acc.address)', await vSMT3.balanceOf(second_acc.address));
      console.log('await SMT.balanceOf(second_acc.address)', await SMT.balanceOf(second_acc.address));

      await handler.connect(second_acc).createProxyClaimSMTTimes(30);

      console.log('await vSMT3.balanceOf(first_acc.address)', await vSMT3.balanceOf(second_acc.address));
      console.log('await SMT.balanceOf(first_acc.address)', await SMT.balanceOf(second_acc.address));
    });
  });
});
