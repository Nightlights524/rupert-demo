// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract TokenInterface {
    function balanceOf(address account) virtual external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) virtual external returns (bool);
}

contract Rupert is Ownable {
    address public tokenContractAddress;

    TokenInterface tokenContract;

    event ItemPurchased(address buyer, string name);
    
    // struct Penguin {
    //     string name;
    //     string[] ownedPurchasables;
    //     // string[] skills;
    //     // string[] accessories;
    // }

    struct Purchasable {
        // string name;
        uint256 tokenCost;
        bool isActive;
        bool exists;
    }

    // Penguin[] public penguins;
    // mapping(uint => address) penguinToOwner;

    // Purchasable[] public purchasables;
    mapping(string => Purchasable) public purchasables;
    mapping(address => string[]) ownedPurchasables;

    constructor(address _address) {
        tokenContractAddress = _address;
        tokenContract = TokenInterface(_address);
        purchasables["walk"] = Purchasable(1000, true, true);
        purchasables["jump"] = Purchasable(1000, true, true);
        purchasables["spin"] = Purchasable(1000, true, true);
        purchasables["wave"] = Purchasable(1000, true, true);
        purchasables["speak"] = Purchasable(1000, true, true);
        purchasables["topHat"] = Purchasable(1000, true, true);
        purchasables["monocle"] = Purchasable(1000, true, true);
        purchasables["lollipop"] = Purchasable(1000, true, true);
    }

    receive() external payable {}

    function setTokenContractAddress(address _address) external onlyOwner {
        tokenContractAddress = _address;
        tokenContract = TokenInterface(_address);
    }

    function getOwnedPurchasables(address _address) external view returns (string[] memory) {
        return ownedPurchasables[_address];
    }

    function addPurchasable(string memory _name, uint _tokenCost) external onlyOwner {
        require(!purchasables[_name].exists);
        purchasables[_name] = Purchasable(_tokenCost, true, true);
    }

    function deactivatePurchasable(string memory _name) external onlyOwner {
        require(purchasables[_name].isActive);
        purchasables[_name].isActive = false;
    }

    function reactivatePurchasable(string memory _name) external onlyOwner {
        require(purchasables[_name].exists && !purchasables[_name].isActive);
        purchasables[_name].isActive = false;
    }

    function changePurchasableCost(string memory _name, uint _newCost) external onlyOwner {
        require(purchasables[_name].exists);
        purchasables[_name].tokenCost = _newCost;
    }

    function ownsPurchasable(string memory _name) public view returns (bool) {
        require(purchasables[_name].exists);
        string[] storage owned = ownedPurchasables[msg.sender];

        for(uint index = 0; index < owned.length; ++index) {
            if (keccak256(abi.encodePacked(owned[index])) == keccak256(abi.encodePacked(_name))) {
                return true;
            }
        }
        return false;
    }

    function purchase(string memory _name) external returns (bool) {
        require(purchasables[_name].isActive);
        string[] storage owned = ownedPurchasables[msg.sender];
        uint cost = purchasables[_name].tokenCost;
        require(!ownsPurchasable(_name), "Caller already owns this item!");

        tokenContract.transferFrom(msg.sender, tokenContractAddress, cost);
        owned.push(_name);
        emit ItemPurchased(msg.sender, _name);
        return true;
    }
}