// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IUniswapV2Router {
    function swapExactETHForTokens(
        uint amountOutMin, 
        address[] calldata path, 
        address to, 
        uint deadline
    ) external payable returns (uint[] memory amounts);   
}

contract SniperBot {
    address public owner;
    IUniswapV2Router public uniswapRouter;

    constructor(address _uniswapRouter) {
        owner = msg.sender;
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function snipeToken(
        uint amountOutMin,
        address[] calldata path,
        uint deadline
    ) external payable onlyOwner {
        require(path.length >= 2, "Invalid path");

        uniswapRouter.swapExactETHForTokens{value: msg.value}(
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }

    function withdrawTokens(address tokenAddress, uint amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner, amount);
    }

    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable{}

}

interface IERC20 {

    function transfer(address recipient, uint256 amount) external returns (bool);
}