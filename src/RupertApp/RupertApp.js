import React from 'react';
import * as styles from "./RupertApp.module.css"
import {checkForMetamask} from './Metamask.js';
import {dappContractABI} from './dappContract_abi.js';
import {tokenContractABI} from './tokenContract_abi.js';
import Penguin from './Penguin/Penguin.js';
import Sidebar from './Sidebar/Sidebar.js';
import Purchasable from './Purchasable/Purchasable.js';
import Button from './Button/Button.js';

// const web3 = new window.Web3(window.Web3.givenProvider || "ws://localhost:8545");

// // GANACHE BSC
// // const dappContractAddress = "0xf65Bc13bE010d7CE5e9EEB18051e4C2f9354000f";
// // ROPSTEN
// const dappContractAddress = "0x26a1f2ba3bb1e96266008Fc95CB5ec162c9CF2E1";
// const dappContract = new web3.eth.Contract(dappContractABI, dappContractAddress);

// // GANACHE BSC
// // const tokenContractAddress = "0xEEEd6F31e8EB946069D8DfB7FF211795fB2cE3F6";
// // ROPSTEN
// const tokenContractAddress = "0xdE326908798A57a7E8a5e86E6354dDb281F79484";
// const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

// const tokenApprovalAmount = 24000000;
// const tokenApprovalThreshold = 1000;

class RupertApp extends React.Component {
  constructor(props) {
    super(props);
    this.penguin = React.createRef();
    this.chainID = 3;
    this.dappContractAddress = "0x26a1f2ba3bb1e96266008Fc95CB5ec162c9CF2E1";
    this.dappContract = null;
    this.tokenContractAddress = "0xdE326908798A57a7E8a5e86E6354dDb281F79484";
    this.tokenContract = null;
    this.tokenApprovalAmount = 24000000;
    this.tokenApprovalThreshold = 1000;
    this.state = {
      userAccount: "(connecting wallet...)",
      tokenBalance: 0,
      walletConnected: false,
      contractApproved: false,
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

  // componentDidMount() {
    // checkForMetamask();

    // this.metamaskInterval = setInterval(async () => {
    //   // Check if account has changed
    //   try {
    //     console.log("EXECUTING METAMASK INTERVAL FUNCTIONS");  

    //     const accounts = await web3.eth.getAccounts();
    //     if (accounts[0] !== this.state.userAccount) {
    //       this.setState({userAccount: accounts[0]});
    //     }
    //     this.updateTokenBalance();
    //     this.updateCosts();
    //     this.updateApproval();
    //   } catch (error) {
    //     alert(error);
    //   }
    // }, 1000);

    // checkForMetamask();
  // }

  componentWillUnmount() {
    clearInterval(this.metamaskInterval);
  }

  connectToWallet = async () => {
    if (await checkForMetamask()) {
      const web3 = new window.Web3(window.Web3.givenProvider || "ws://localhost:8545");
      const chainID = await web3.eth.getChainId();
      alert(chainID === this.chainID);

      this.startApp();
    }
  }

  startApp = () => {
    const web3 = new window.Web3(window.Web3.givenProvider || "ws://localhost:8545");

    this.dappContract = new web3.eth.Contract(dappContractABI, this.dappContractAddress);
    this.tokenContract = new web3.eth.Contract(tokenContractABI, this.tokenContractAddress);

    this.metamaskInterval = setInterval(async () => {
      // Check if account has changed
      try {
        console.log("EXECUTING METAMASK INTERVAL FUNCTIONS");  

        const accounts = await web3.eth.getAccounts();
        if (accounts[0] !== this.state.userAccount) {
          this.setState({userAccount: accounts[0]}, () => {
            // if (!this.state.walletConnected) {
            //   this.setState({walletConnected: true});
            // }
          });
        }
        this.updateTokenBalance();
        this.updateCosts();
        this.updateApproval();

        // if (!this.state.walletConnected) {
        //   this.setState({walletConnected: true});
        // }
      } catch (error) {
        alert(error);
      }
    }, 1000);

    // this.setState({walletConnected: true});
  }

  updateTokenBalance = async () => {
    try {
      const tokenBalance = await this.tokenContract.methods.balanceOf(this.state.userAccount).call();
      if (tokenBalance !== this.state.tokenBalance) {
        this.setState({tokenBalance});
      }
      if (!this.state.walletConnected) {
        this.setState({walletConnected: true});
      }
    } catch (error) {
      alert(error);
    }
  }

  updateCosts = async () => {
    try {
      const ownedPurchasables = await this.dappContract.methods.getOwnedPurchasables(this.state.userAccount).call();
      const costs = {};
      
      for (const key in this.state.costs) {
        const isOwned = ownedPurchasables.includes(key);
        const purchasable = await this.dappContract.methods.purchasables(key).call();
        costs[key] = isOwned ? "OWNED" : purchasable.tokenCost;
      }
      
      this.setState({costs});
      
    } catch (error) {
      alert(error);
    }
  }
  
  updateApproval = async () => {
    try {
      const allowance = await this.tokenContract.methods.allowance(this.state.userAccount, this.dappContractAddress).call();
      const approved = parseInt(allowance) >= this.tokenApprovalThreshold;
      if (approved !== this.state.contractApproved) {
        this.setState({contractApproved: approved});
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
      await this.tokenContract.methods.approve(this.dappContractAddress, this.tokenApprovalAmount).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
    document.activeElement.blur();
  }
  
  buyTokens = async () => {
    try {
      await this.tokenContract.methods.buyTokens(10000).send({from: this.state.userAccount});
    } catch (error) {
      console.error(error);
    }
    document.activeElement.blur();
  }
  
  purchase = async (itemName, cost) => {
    try {
      // const approved = await this.isApproved();
      // if (!approved) {
      if (!this.state.contractApproved) {
        alert("Please click the \"APPROVE\" button before purchasing!");
        return;
      }
      else if(this.state.tokenBalance < cost) {
        alert("You don't have enough PenguinCoins!");
        return;
      }
      const transaction = await this.dappContract.methods.purchase(itemName).send({from: this.state.userAccount});
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
          {this.state.walletConnected &&
            <div id="buy" className={styles.contractInteraction}>
              <p>"Buy" 10,000 PenguinCoins</p>
              <Button 
                glow={this.state.tokenBalance < this.tokenApprovalThreshold}
                onClick={this.buyTokens}
              >
                BUY
              </Button>
            </div>
          }
          <p>
            {this.state.walletConnected ? `Account: ${this.state.userAccount}`
                                        : <Button glow={true} onClick={this.connectToWallet}>CONNECT WALLET</Button>}
          </p>
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
              <h1 className={styles.title}>Hi, I'm Rupert!</h1>
              {!this.state.walletConnected &&
                <h2 className={styles.subtitle}>Connect your Metamask wallet to get started.</h2>
              }
              {this.state.walletConnected && !this.state.contractApproved &&
                <div className={styles.contractInteraction}>
                  <h2 className={styles.subtitle}>Please approve PenguinCoin smart contract</h2>
                  <Button onClick={this.approveToken}>APPROVE</Button>
                </div>
              }
              {this.state.contractApproved && <h2 className={styles.subtitle}>Spend your PenguinCoins to buy accessories and skills for me.</h2>}
            </div>
            <Penguin ref={this.penguin} costs={this.state.costs} accessories={this.state.accessories}/>
            <p>Penguin character design by FreeCodeCamp.com</p>
            <p>Accessories and animation by Nightlight Software</p>
          </div>
        </main>
      </div>
    );
  }
}

export default RupertApp;
