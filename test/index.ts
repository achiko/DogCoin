import { ethers, upgrades } from "hardhat";
import { Signer } from "ethers";
import { assert } from "chai";

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
    console.log("Contract Address :  ", dogCoin_V1.address);
    contractAddress = dogCoin_V1.address;
    assert.equal(await dogCoin_V1.name(), "DogCoin");

    const DogCoin_V2 = await ethers.getContractFactory("DogCoinV2");
    const dogCoin_V2 = await upgrades.upgradeProxy(dogCoin_V1, DogCoin_V2);
    console.log("Contract V2 Address :  ", dogCoin_V2.address);
    console.log("Version after upgrade : ", await dogCoin_V2.version());
  });

  it("#2 Sould test smartcontract storage varriables ", async function () {
    let dogeCoinContract = DogCoinV2__factory.connect(
      contractAddress,
      accounts[0]
    );

    assert.isOk(
      (await dogeCoinContract.test1()).eq(1),
      "TEST1 STORAGE VARIABLE IS WRONG"
    );
    assert.isOk(
      (await dogeCoinContract.test2()).eq(2),
      "TEST2 STORAGE VARIABLE IS WRONG"
    );

    await dogeCoinContract.updateTest3(3);

    assert.isOk(
      (await dogeCoinContract.test3()).eq(3),
      "TEST3 STORAGE VARIABLE IS WRONG"
    );
  });
});
