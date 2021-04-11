import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import {checkForMetamask} from './Metamask.js';
import {dappContractABI} from './dappContract_abi.js'; // CHANGE ABI NAME?
import {tokenContractABI} from './tokenContract_abi.js'; // CHANGE ABI NAME?
// import * as ContractUtils from "./ContractUtils.js";
import Penguin from './Penguin.js';
import Sidebar from './Sidebar.js';
import Purchasable from './Purchasable.js';

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const dappContractAddress = "0x4F115fd4C6FD963CB250Fac162e5852e5530FD13";
const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress); // CHANGE ABI NAME?

const tokenContractAddress = "0x4BB3F47D96a4B7bcF5056cb16104005A481C0446";
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress); // CHANGE ABI NAME?

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: "(connecting wallet...)",
      tokenBalance: 0,
      costs: {
        walk: null,
        jump: null,
        spin: null,
        wave: null,
        speak: null,
        topHat: null,
        monacle: null,
        lollipop: null
      }
    };
    this.updateTokenBalance = this.updateTokenBalance.bind(this);
    this.updateCosts = this.updateCosts.bind(this);
    this.approveToken = this.approveToken.bind(this);
    this.purchase = this.purchase.bind(this);
  }

  componentDidMount() {
    setInterval(async () => {
      // Check if account has changed
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts[0] !== this.state.userAccount) {
          this.setState({userAccount: accounts[0]});
        }
        this.updateTokenBalance();
        this.updateCosts();
      } catch (error) {
        alert(error);
      }
    }, 1000);

    checkForMetamask();
  }

  async updateTokenBalance() {
    try {
      const tokenBalance = await tokenContract.methods.balanceOf(this.state.userAccount).call();
      if (tokenBalance !== this.state.tokenBalance) {
        this.setState({tokenBalance});
      }
    } catch (error) {
      alert(error);
    }
  }

  async updateCosts() {
    try {
      const ownedPurchasables = await dappContract.methods.getOwnedPurchasables(this.state.userAccount).call();
      const costs = {};
      
      for (const key in this.state.costs) {
        const isOwned = ownedPurchasables.includes(key);
        const purchasable = await dappContract.methods.purchasables(key).call();
        costs[key] = isOwned ? "OWNED" : purchasable.tokenCost;
      }
      
      this.setState({costs});
      
    } catch (error) {
      alert(error);
    }
  }
  
  async approveToken() {
    try {
      await tokenContract.methods.approve(dappContractAddress, 24000000).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
  }
  
  async purchase(itemName) {
    try {
      // const balanceOf = await tokenContract.methods.balanceOf(tokenContractAddress).call();
      // alert(balanceOf);
      const transaction = await dappContract.methods.purchase(itemName).send({from: this.state.userAccount});
      console.log(transaction);
      // alert(purchased ? `Successfully purchased ${itemName}!` : "Uh-oh! Purchase unsuccessful.");
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>PenguinCoin Balance: {this.state.tokenBalance}</p>
          {/* <p>ERC20/BEP20 Token & Dapp Demo</p> */}
          <p>{`Account: ${this.state.userAccount}`}</p>
        </header>
        <main>
          <Sidebar>
            <Purchasable label="Walk" id="walk" cost={this.state.costs.walk} onClick={() => this.purchase("walk")}/>
            <Purchasable label="Jump" id="jump" cost={this.state.costs.jump} onClick={() => this.purchase("jump")}/>
            <Purchasable label="Spin" id="spin" cost={this.state.costs.spin} onClick={() => this.purchase("spin")}/>
            <Purchasable label="Wave" id="wave" cost={this.state.costs.wave} onClick={() => this.purchase("wave")}/>
            <Purchasable label="Speak" id="speak" cost={this.state.costs.speak} onClick={() => this.purchase("speak")}/>
            <Purchasable label="Top Hat" id="topHat" cost={this.state.costs.topHat} onClick={() => this.purchase("topHat")}/>
            <Purchasable label="Monacle" id="monacle" cost={this.state.costs.monacle} onClick={() => this.purchase("monacle")}/>
            <Purchasable label="Lollipop" id="lollipop" cost={this.state.costs.lollipop} onClick={() => this.purchase("lollipop")}/>
          </Sidebar>
          <div className="App-playArea">
            <h1>Hi, I'm Steve!</h1>
            <h2>Spend your PenguinCoins to buy accessories and skills for me.</h2>
            <Penguin />
            <p>CSS penguin by FreeCodeCamp.com</p>
            <button onClick={this.approveToken}>Approve PenguinCoin</button>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
