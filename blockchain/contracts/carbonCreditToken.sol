
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonCreditToken is ERC20 {
    address public owner;
    uint256 public constant INITIAL_ALLOCATION = 100 * 10 ** 18; 

    constructor() ERC20("Carbon Credit", "CCT") {
        owner = msg.sender;
        _mint(owner, 1000000 * 10 ** decimals()); 
    }

    function allocateTokens(address _newUser) external {
        require(balanceOf(owner) >= INITIAL_ALLOCATION, "Not enough tokens in reserve");
        _transfer(owner, _newUser, INITIAL_ALLOCATION);
    }
}
