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

const dappContractAddress = "0x651a65e854A83A41Cd6252e2d52FEf402149b01c";
const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress); // CHANGE ABI NAME?

const tokenContractAddress = "0x73F194a197727f9607c88Bd3fFFe42a4b740d176";
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress); // CHANGE ABI NAME?

const tokenApprovalAmount = 24000000;
const tokenApprovalThreshold = 1000;

// const keyBindings = {
//   walk: "Left-Right",
//   jump: "Up",
//   spin: "S",
//   wave: "W",
//   speak: "",
//   topHat: "T",
//   monocle: "M",
//   lollipop: "L"
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: "(connecting wallet...)",
      tokenBalance: 0,
      approved: false,
      costs: {
        walk: null,
        jump: null,
        spin: null,
        wave: null,
        speak: null,
        topHat: null,
        monocle: null,
        lollipop: null
      }
    };
    this.updateTokenBalance = this.updateTokenBalance.bind(this);
    this.updateCosts = this.updateCosts.bind(this);
    this.updateApproval = this.updateApproval.bind(this);
    // this.isApproved = this.isApproved.bind(this);
    this.approveToken = this.approveToken.bind(this);
    this.buyTokens = this.buyTokens.bind(this);
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
        this.updateApproval();
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
  
  async updateApproval() {
    try {
      const allowance = await tokenContract.methods.allowance(this.state.userAccount, dappContractAddress).call();
      const approved = parseInt(allowance) >= tokenApprovalThreshold;
      if (approved !== this.state.approved) {
        this.setState({approved});
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // async isApproved() {
  //   try {
  //     const allowance = await tokenContract.methods.allowance(this.state.userAccount, dappContractAddress).call();
  //     return parseInt(allowance) >= tokenApprovalThreshold;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  async approveToken() {
    try {
      await tokenContract.methods.approve(dappContractAddress, tokenApprovalAmount).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
  }
  
  async buyTokens() {
    try {
      await tokenContract.methods.buyTokens(10000).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
  }
  
  async purchase(itemName, cost) {
    try {
      // const approved = await this.isApproved();
      // if (!approved) {
      if (!this.state.approved) {
        alert("Please click the \"APPROVE\" button before purchasing!");
        return;
      }
      else if(this.state.tokenBalance < cost) {
        alert("You don't have enough PenguinCoins!");
        return;
      }
      const transaction = await dappContract.methods.purchase(itemName).send({from: this.state.userAccount});
      console.log(transaction);
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>PenguinCoin Balance: {this.state.tokenBalance}</p>
          <div id="buy" className="contractInteraction">
              <p>"Buy" 10,000 PenguinCoins</p>
              {/* <span class="fas fa-arrow-right"></span> */}
              <button onClick={this.buyTokens}>BUY</button>
          </div>
          <p>{`Account: ${this.state.userAccount}`}</p>
        </header>
        <main>
          <Sidebar>
            <Purchasable label="Walk" item="walk" cost={this.state.costs.walk} onClick={this.purchase}/>
            <Purchasable label="Jump" item="jump" cost={this.state.costs.jump} onClick={this.purchase}/>
            <Purchasable label="Spin" item="spin" cost={this.state.costs.spin} onClick={this.purchase}/>
            <Purchasable label="Wave" item="wave" cost={this.state.costs.wave} onClick={this.purchase}/>
            <Purchasable label="Speak" item="speak" cost={this.state.costs.speak} onClick={this.purchase}/>
            <Purchasable label="Top Hat" item="topHat" cost={this.state.costs.topHat} onClick={this.purchase}/>
            <Purchasable label="Monocle" item="monocle" cost={this.state.costs.monocle} onClick={this.purchase}/>
            <Purchasable label="Lollipop" item="lollipop" cost={this.state.costs.lollipop} onClick={this.purchase}/>
          </Sidebar>
          <div className="App-playArea">
            <h1>Hi, I'm Steve!</h1>
            <div id="approval" className={this.state.approved ? "hidden contractInteraction" : "contractInteraction"}>
              <h2>Approve PenguinCoin to get started</h2>
              {/* <span class="fas fa-arrow-right"></span> */}
              <button onClick={this.approveToken}>APPROVE</button>
            </div>
            <h2 id="spend" className={this.state.approved ? "" : "hidden"}>Spend your PenguinCoins to buy accessories and skills for me.</h2>
            <Penguin costs={this.state.costs}/>
            {/* <div id="buy" className="contractInteraction"> */}
              {/* <h2>"Buy" 10,000 PenguinCoins!</h2> */}
              {/* <button onClick={this.buyTokens}>BUY</button> */}
            {/* </div> */}
            <p>CSS penguin by FreeCodeCamp.com</p>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
