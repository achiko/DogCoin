import { ethers, upgrades } from "hardhat";
import { Signer } from "ethers";
import { assert } from "chai";

import {
  DogCoin,
  DogCoin__factory,
  DogCoinV2,
  DogCoinV2__factory,
} from "../typechain";
import { contains } from "underscore";

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

  it("#2 Sould test smartcontract storage varriables ", async function () {
    let dogCoinContract = DogCoinV2__factory.connect(
      contractAddress,
      accounts[0]
    );

    assert.isOk(
      (await dogCoinContract.test1()).eq(1),
      "WRONG TEST1 STORAGE VARIABLE"
    );
    assert.isOk(
      (await dogCoinContract.test2()).eq(2),
      "WRONG TEST2 STORAGE VARIABLE IS"
    );

    await dogCoinContract.updateTest3(3);

    assert.isOk(
      (await dogCoinContract.test3()).eq(3),
      "WRONG TEST3 STORAGE VARIABLE"
    );
  });

  it("#3 Airdrop Tokens for accounts  ", async function () {
    let [admin, accountA, accountB, accountC] = accounts;
    const contract = DogCoinV2__factory.connect(contractAddress, admin);
  });
});
