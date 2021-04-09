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

const dappContractAddress = "0xa10aF0Fa421A06c9F6Ae0BD3D0A709ec11b2Bf48";
const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress); // CHANGE ABI NAME?

const tokenAddress = "0x5503575A694bDA443DdD11C9e11eAb894568AEEf";
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenAddress); // CHANGE ABI NAME?

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: "Connecting wallet...",
      tokenBalance: 0,
      costs: {
        // walk: 1000,
        // jump: 1000,
        // spin: 1000,
        // wave: 1000,
        // speak: 1000,
        // topHat: 1000,
        // monacle: 1000,
        // lollipop: 1000
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
            <Purchasable label="Walk" purchasableName="walk" cost={this.state.costs.walk}/>
            <Purchasable label="Jump" purchasableName="jump" cost={this.state.costs.jump}/>
            <Purchasable label="Spin" purchasableName="spin" cost={this.state.costs.spin}/>
            <Purchasable label="Wave" purchasableName="wave" cost={this.state.costs.wave}/>
            <Purchasable label="Speak" purchasableName="speak" cost={this.state.costs.speak}/>
            <Purchasable label="Top Hat" purchasableName="topHat" cost={this.state.costs.topHat}/>
            <Purchasable label="Monacle" purchasableName="monacle" cost={this.state.costs.monacle}/>
            <Purchasable label="Lollipop" purchasableName="lollipop" cost={this.state.costs.lollipop}/>
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
