// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";


contract DogCoin is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
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

    function mint(address to, uint256 amount) public virtual onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}

contract DogCoinV2 is DogCoin {
    uint public test3;
    address[] public accounts;

    function version() public pure returns (string memory) {
        return "V2";
    }

    function mint(address to, uint256 amount) public override onlyOwner {
        _mint(to, amount);
        _addAcountTolist(to);
    }

    // Internal Function Add account into list 
    function _addAcountTolist(address _account) internal returns(bool) {
        for (uint i = 0; i < accounts.length; i++) {
            if(accounts[i] == _account) {
                return false;
            }
        }
        accounts.push(_account);
        return true;
    }

    // Remove address from list 
    function _removeAccountFromList(address _account) internal {
        uint index = 0;
        for (uint i = 0; i < accounts.length; i++) {
            if(accounts[i] == _account) {
                index = i;
            }
        }
        // move the last element into the place
        accounts[index] = accounts[accounts.length - 1];
        // delete
        accounts.pop();
    }


    // address to, uint256 amount
    function transfer(address to, uint256 amount) public override virtual returns (bool) {
        bool success = super.transfer(to, amount); 
        require(success, "ERR");   
        
        // Check balance of sender 
        uint256 senderBalance = balanceOf(msg.sender);
        if(senderBalance == 0) {
            _removeAccountFromList(msg.sender);
        }
        _addAcountTolist(to);
        return success;
    }

    function getAccountList() public view returns(address[] memory) {
        return accounts;
    }

    function updateTest3(uint _value) public {
        test3 = _value;
    }
}

// TODO: DogCoinV3 implement 
