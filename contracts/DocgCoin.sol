// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DogCoin is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    uint public test1;
    uint public test2;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC20_init("DogCoin", "DGC");
        __Ownable_init();
        __UUPSUpgradeable_init();

        test1 = 1;
        test2 = 2;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}

contract DogCoinV2 is DogCoin {
    uint public test3;

    function version() public pure returns (string memory) {
        return "V2";
    }

    function updateTest3(uint _value) public {
        test3 = _value;
    }
}

// TODO: DogCoinV3 implement 
