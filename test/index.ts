import { ethers, upgrades } from "hardhat";
import { Signer } from "ethers";
import { assert } from "chai";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, providers } from "ethers";

import {
  DogCoin,
  DogCoin__factory,
  DogCoinV2,
  DogCoinV2__factory,
} from "../typechain";

describe("DogCoin", function () {
  let accounts: Signer[];
  let contractAddress: string;
  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("#1 Should Deploy Proxy Upgradable Contracts", async function () {
    const DogCoin = await ethers.getContractFactory("DogCoin");

    let dogCoin_V1 = await upgrades.deployProxy(DogCoin, { kind: "uups" });
    contractAddress = dogCoin_V1.address;
    console.log("Contract Address :  ", contractAddress);
    assert.equal(await dogCoin_V1.name(), "DogCoin");

    const DogCoin_V2 = await ethers.getContractFactory("DogCoinV2");
    const dogCoin_V2 = await upgrades.upgradeProxy(dogCoin_V1, DogCoin_V2);
    console.log("Contract V2 Address :  ", dogCoin_V2.address);
    console.log("Version after upgrade : ", await dogCoin_V2.version());
  });

  it("#2 Sould test smartcontract storage varriables after V2 upgrade ", async function () {
    let dogCoinContract = DogCoinV2__factory.connect(
      contractAddress,
      accounts[0]
    );

    assert.isTrue(
      (await dogCoinContract.test1()).eq(1),
      "WRONG TEST1 STORAGE VARIABLE"
    );
    assert.isTrue(
      (await dogCoinContract.test2()).eq(2),
      "WRONG TEST2 STORAGE VARIABLE IS"
    );

    await dogCoinContract.updateTest3(3);

    assert.isTrue(
      (await dogCoinContract.test3()).eq(3),
      "WRONG TEST3 STORAGE VARIABLE"
    );
  });

  it("#3 Mint & Transfer Tokens", async function () {
    /**
     * Scenarios :
     * 1. Get 3 Accounts Account1, Account3 from signers
     * 2. Mint 100 Tokens for Account1
     * 3. Mint 150 Tokens For Account2
     * 4. Transfer All tokens from Account2 to Account3
     * 5. Mint 200 Tokens For Account1
     */

    let [admin, account1, account2, account3] = accounts;
    const contract = DogCoinV2__factory.connect(contractAddress, admin);

    const account1Addr = await account1.getAddress();
    const account2Addr = await account2.getAddress();
    const account3Addr = await account3.getAddress();

    const { mint, balanceOf } = contract;
    await mint(account1Addr, parseUnits("100", 18));
    assert.equal(
      (await contract.getAccountList()).length,
      1,
      "WRONG ACCOUNTS LIST"
    );
    await mint(account2Addr, parseUnits("150", 18));

    assert.equal(
      (await contract.getAccountList()).length,
      2,
      "WRONG ACCOUNTS LIST"
    );

    assert.isTrue((await balanceOf(account1Addr)).eq(parseUnits("100", 18)));
    assert.isTrue((await balanceOf(account2Addr)).eq(parseUnits("150", 18)));

    await contract
      .connect(account2)
      .transfer(account3Addr, parseUnits("150", 18));

    assert.isTrue((await balanceOf(account2Addr)).eq(0));
    assert.isTrue((await balanceOf(account3Addr)).eq(parseUnits("150", 18)));

    assert.equal(
      (await contract.getAccountList()).length,
      2,
      "WRONG ACCOUNTS LIST"
    );

    await mint(await account1.getAddress(), parseUnits("200", 18));

    assert.equal(
      (await contract.getAccountList()).length,
      2,
      "WRONG ACCOUNTS LIST"
    );

    assert.equal(
      (await contract.getAccountList()).indexOf(account2Addr),
      -1,
      "ACCOUNTS LIST"
    );
  });
});
