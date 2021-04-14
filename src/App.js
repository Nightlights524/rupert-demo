import React from 'react';
import './App.css';
import Web3 from 'web3';
import {checkForMetamask} from './Metamask.js';
import {dappContractABI} from './dappContract_abi.js'; // CHANGE ABI NAME?
import {tokenContractABI} from './tokenContract_abi.js'; // CHANGE ABI NAME?
import Penguin from './Penguin.js';
import Sidebar from './Sidebar.js';
import Purchasable from './Purchasable.js';

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const dappContractAddress = "0x467fbFc206697a5A2c4c81c4dAE6e13c26297ac1";
const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress); // CHANGE ABI NAME?

const tokenContractAddress = "0x745De1d08F137A4B3dfC60b7ac811ce2342b56CE";
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress); // CHANGE ABI NAME?

const tokenApprovalAmount = 24000000;
const tokenApprovalThreshold = 1000;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.penguin = React.createRef();
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

  updateTokenBalance = async () => {
    try {
      const tokenBalance = await tokenContract.methods.balanceOf(this.state.userAccount).call();
      if (tokenBalance !== this.state.tokenBalance) {
        this.setState({tokenBalance});
      }
    } catch (error) {
      alert(error);
    }
  }

  updateCosts = async () => {
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
  
  updateApproval = async () => {
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
  
  // isApproved = async () => {
  //   try {
  //     const allowance = await tokenContract.methods.allowance(this.state.userAccount, dappContractAddress).call();
  //     return parseInt(allowance) >= tokenApprovalThreshold;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  approveToken = async () => {
    try {
      await tokenContract.methods.approve(dappContractAddress, tokenApprovalAmount).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
  }
  
  buyTokens = async () => {
    try {
      await tokenContract.methods.buyTokens(10000).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
  }
  
  purchase = async (itemName, cost) => {
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
            <Purchasable
              label="Walk"
              item="walk" 
              cost={this.state.costs.walk}
              keyBinding="A (left) &amp; D (right)"
              onClickUnowned={this.purchase}
              onClickOwned={() => {}}
            />
            <Purchasable
              label="Jump"
              item="jump"
              cost={this.state.costs.jump}
              keyBinding="Space Bar"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.jump()}}
            />
            <Purchasable
              label="Spin"
              item="spin"
              cost={this.state.costs.spin}
              keyBinding="S"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.spin()}}
            />
            <Purchasable
              label="Wave"
              item="wave"
              cost={this.state.costs.wave}
              keyBinding="E"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.wave()}}
            />
            <Purchasable
              label="Speak"
              item="speak"
              cost={this.state.costs.speak}
              keyBinding="Shift"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.speak()}}
            />
            <Purchasable
              label="Top Hat"
              item="topHat"
              cost={this.state.costs.topHat}
              keyBinding="T"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.toggleAccessory("T")}}
            />
            <Purchasable
              label="Monocle"
              item="monocle"
              cost={this.state.costs.monocle}
              keyBinding="M"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.toggleAccessory("M")}}
            />
            <Purchasable
              label="Lollipop"
              item="lollipop"
              cost={this.state.costs.lollipop}
              keyBinding="L"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.toggleAccessory("L")}}
            />
          </Sidebar>
          <div className="App-playArea">
            <h1>Hi, I'm Steve!</h1>
            {!this.state.approved &&
              <div className="contractInteraction">
                <h2>Approve PenguinCoin to get started</h2>
                {/* <span class="fas fa-arrow-right"></span> */}
                <button onClick={this.approveToken}>APPROVE</button>
              </div>
            }
            {this.state.approved && <h2>Spend your PenguinCoins to buy accessories and skills for me.</h2>}
            <Penguin ref={this.penguin} costs={this.state.costs} />
            <p>CSS penguin design by FreeCodeCamp.com</p>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
