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

const dappContractAddress = "0x23B33F04C16807dE8F01C1F11284035DB819490f";
const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress); // CHANGE ABI NAME?

const tokenAddress = "0x67cB97D83f8b1B6fEFc3181E9Ff9f03Dd5461589";
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenAddress); // CHANGE ABI NAME?

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: "Connecting wallet...",
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
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>PenguinCoin Balance: {this.state.tokenBalance}</p>
          {/* <p>ERC20/BEP20 Token & Dapp Demo</p> */}
          <p>{this.state.userAccount}</p>
        </header>
        <main>
          <Sidebar>
            <Purchasable label="Walk" id="walk" cost={this.state.costs.walk}/>
            <Purchasable label="Jump" id="jump" cost={this.state.costs.jump}/>
            <Purchasable label="Spin" id="spin" cost={this.state.costs.spin}/>
            <Purchasable label="Wave" id="wave" cost={this.state.costs.wave}/>
            <Purchasable label="Speak" id="speak" cost={this.state.costs.speak}/>
            <Purchasable label="Top Hat" id="topHat" cost={this.state.costs.topHat}/>
            <Purchasable label="Monacle" id="monacle" cost={this.state.costs.monacle}/>
            <Purchasable label="Lollipop" id="lollipop" cost={this.state.costs.lollipop}/>
          </Sidebar>
          <div className="App-playArea">
            <h1>Hi, I'm Steve!</h1>
            <h2>Spend your PenguinCoins to buy accessories and skills for me.</h2>
            <Penguin />
            <p>CSS penguin by FreeCodeCamp.com</p>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
