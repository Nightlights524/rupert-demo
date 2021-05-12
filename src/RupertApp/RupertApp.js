import React from 'react';
import * as styles from "./RupertApp.module.css"
import {checkForMetamask} from './Metamask.js';
import {dappContractABI} from './dappContract_abi.js';
import {tokenContractABI} from './tokenContract_abi.js';
import Penguin from './Penguin/Penguin.js';
import Sidebar from './Sidebar/Sidebar.js';
import Purchasable from './Purchasable/Purchasable.js';

const web3 = new window.Web3(window.Web3.givenProvider || "ws://localhost:8545");

// GANACHE BSC
// const dappContractAddress = "0xf65Bc13bE010d7CE5e9EEB18051e4C2f9354000f";
// ROPSTEN
const dappContractAddress = "0x26a1f2ba3bb1e96266008Fc95CB5ec162c9CF2E1";
const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress);

// GANACHE BSC
// const tokenContractAddress = "0xEEEd6F31e8EB946069D8DfB7FF211795fB2cE3F6";
// ROPSTEN
const tokenContractAddress = "0xdE326908798A57a7E8a5e86E6354dDb281F79484";
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

const tokenApprovalAmount = 24000000;
const tokenApprovalThreshold = 1000;

class RupertApp extends React.Component {
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
    checkForMetamask();

    this.metamaskInterval = setInterval(async () => {
      // Check if account has changed
      try {
        console.log("EXECUTING METAMASK INTERVAL FUNCTIONS");  

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

    // checkForMetamask();
  }

  componentWillUnmount() {
    clearInterval(this.metamaskInterval);
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
    document.activeElement.blur();
  }
  
  buyTokens = async () => {
    try {
      await tokenContract.methods.buyTokens(10000).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
    document.activeElement.blur();
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
      <div className={styles.app}>
        <header className={styles.header}>
          <p>PenguinCoin Balance: {this.state.tokenBalance}</p>
          <div id="buy" className={styles.contractInteraction}>
              <p>"Buy" 10,000 PenguinCoins</p>
              <button className={styles.utilityButton} onClick={this.buyTokens}>BUY</button>
          </div>
          <p>{`Account: ${this.state.userAccount}`}</p>
        </header>
        <main className={styles.appMain}>
          <Sidebar>
            <Purchasable
              label="Walk"
              item="walk" 
              cost={this.state.costs.walk}
              keyBinding="A - D"
              onClickUnowned={this.purchase}
              onClickOwned={() => {}}
            />
            <Purchasable
              label="Jump"
              item="jump"
              cost={this.state.costs.jump}
              keyBinding="W"
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
              keyBinding="Q - E"
              onClickUnowned={this.purchase}
              onClickOwned={() => {this.penguin.current.wave()}}
            />
            <Purchasable
              label="Speak"
              item="speak"
              cost={this.state.costs.speak}
              keyBinding="F"
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
          <div className={styles.playArea}>
            <div /*className="App-playArea-instructions"*/>
              <h1 className={styles.title}>Hi, I'm Steve!</h1>
              {!this.state.approved &&
                <div className={styles.contractInteraction}>
                  <h2 className={styles.subtitle}>Approve PenguinCoin to get started</h2>
                  <button className={styles.utilityButton} onClick={this.approveToken}>APPROVE</button>
                </div>
              }
              {this.state.approved && <h2 className={styles.subtitle}>Spend your PenguinCoins to buy accessories and skills for me.</h2>}
            </div>
            <Penguin ref={this.penguin} costs={this.state.costs} accessories={this.state.accessories}/>
            <p>Penguin character design by FreeCodeCamp.com</p>
          </div>
        </main>
      </div>
    );
  }
}

export default RupertApp;
