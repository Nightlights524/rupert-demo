import React from 'react';
import * as styles from "./RupertApp.module.css"
import {checkForMetamask} from './Metamask.js';
import {dappContractABI} from './dappContract_abi.js';
import {tokenContractABI} from './tokenContract_abi.js';
import Penguin from './Penguin/Penguin.js';
import Hamburger from './Hamburger/Hamburger.js';
import Sidebar from './Sidebar/Sidebar.js';
import Purchasable from './Purchasable/Purchasable.js';
import Button from './Button/Button.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faArrowUp, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import Toggle from 'react-toggle'
import "react-toggle/style.css"

class RupertApp extends React.Component {
  constructor(props) {
    super(props);
    this.penguin = React.createRef();
    this.web3 = null;
    this.chainID = 3;
    // this.dappContractAddress = "0xf65Bc13bE010d7CE5e9EEB18051e4C2f9354000f"; // GANACHE BSC
    this.dappContractAddress = "0x26a1f2ba3bb1e96266008Fc95CB5ec162c9CF2E1"; // ROPSTEN
    this.dappContract = null;
    // this.tokenContractAddress = "0xEEEd6F31e8EB946069D8DfB7FF211795fB2cE3F6"; // GANACHE BSC
    this.tokenContractAddress = "0xdE326908798A57a7E8a5e86E6354dDb281F79484"; // ROPSTEN
    this.tokenContract = null;
    this.tokenApprovalAmount = 24000000;
    this.tokenApprovalThreshold = 1000;
    this.tokenPurchaseAmount = 10000;
    this.touchControlsMatchMedia = "(max-width: 768px)";
    this.sidebarMatchMedia = "(max-width: 450px)";
    this.state = {
      userAccount: "(connecting wallet...)",
      tokenBalance: 0,
      walletConnected: false,
      contractApproved: false,
      touchControlsEnabled: false,
      touchControlsVisible: false,
      sidebarOpen: false,
      sidebarToggleEnabled: false,
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
    window.matchMedia(this.touchControlsMatchMedia).addEventListener('change', this.handleMobileMatchMedia);
    window.matchMedia(this.sidebarMatchMedia).addEventListener('change', this.handleSidebarMatchMedia);
    this.setState({
      touchControlsVisible: window.matchMedia(this.touchControlsMatchMedia).matches,
      sidebarOpen: !window.matchMedia(this.sidebarMatchMedia).matches,
      sidebarToggleEnabled: window.matchMedia(this.sidebarMatchMedia).matches,
    });
  }

  componentWillUnmount() {
    window.matchMedia(this.touchControlsMatchMedia).removeEventListener('change', this.handleMobileMatchMedia);
    window.matchMedia(this.sidebarMatchMedia).removeEventListener('change', this.handleSidebarMatchMedia);
    clearInterval(this.metamaskInterval);
  }

  handleMobileMatchMedia = (event) => {
    if (event.matches) {
      this.setState({touchControlsVisible: true});
    }
    else {
      this.setState({sidebarOpen: true});
    }
  }

  handleSidebarMatchMedia = (event) => {
    this.setState({
      sidebarOpen: !event.matches,
      sidebarToggleEnabled: event.matches
    });
  }

  handleTouchControlsToggle = (event) => {
    this.setState({touchControlsVisible: event.target.checked});
  }

  connectToWallet = async () => {
    try {
      // First initialize the web3 object only if it doesn't exist yet
      if (!this.web3) {
        this.web3 = new window.Web3(window.Web3.givenProvider || "ws://localhost:8545");
      }
      if (await checkForMetamask()) {
        if (await this.checkForCorrectNetwork()) {
          this.startApp();
        }
      }
    } 
    catch (error) {
      console.error(error);
    }
  }

  checkForCorrectNetwork = async () => {
    try {
      const chainID = await this.web3.eth.getChainId();
      if (chainID !== this.chainID) {
        alert('Please switch Metamask to the "Ropsten" Ethereum test network.');
        return false;
      };
      return true;
    } 
    catch (error) {
      console.error(error);
    }
  }

  startApp = () => {
    this.dappContract = new this.web3.eth.Contract(dappContractABI, this.dappContractAddress);
    this.tokenContract = new this.web3.eth.Contract(tokenContractABI, this.tokenContractAddress);

    this.metamaskInterval = setInterval(async () => {
      // Check if account has changed
      try {
        const connected = await this.checkForCorrectNetwork();
        if (!connected) {
          return;
        } 
        const accounts = await this.web3.eth.getAccounts();
        if (accounts[0] !== this.state.userAccount) {
          this.setState({userAccount: accounts[0]}, () => {
          });
        }
        await this.updateTokenBalance();
        await this.updateCosts();
        await this.updateApproval();

        if (!this.state.walletConnected) {
          this.setState({walletConnected: true});
        }
      } 
      catch (error) {
        console.error(error);
      }
    }, 1000);
  }

  updateTokenBalance = async () => {
    try {
      const tokenBalance = await this.tokenContract.methods.balanceOf(this.state.userAccount).call();
      if (tokenBalance !== this.state.tokenBalance) {
        this.setState({tokenBalance});
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  updateCosts = async () => {
    try {
      const ownedPurchasables = await this.dappContract.methods.getOwnedPurchasables(this.state.userAccount).call();
      const touchControlsEnabled = ownedPurchasables.length > 0;
      const costs = {};
      
      for (const key in this.state.costs) {
        const isOwned = ownedPurchasables.includes(key);
        const purchasable = await this.dappContract.methods.purchasables(key).call();
        costs[key] = isOwned ? "OWNED" : purchasable.tokenCost;
      }
      this.setState({costs, touchControlsEnabled});
    }
    catch (error) {
      console.error(error);
    }
  }
  
  updateApproval = async () => {
    try {
      const allowance = await this.tokenContract.methods.allowance(this.state.userAccount, this.dappContractAddress).call();
      const approved = parseInt(allowance) >= this.tokenApprovalThreshold;
      if (approved !== this.state.contractApproved) {
        this.setState({contractApproved: approved});
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  
  approveToken = async () => {
    try {
      await this.tokenContract.methods.approve(this.dappContractAddress, this.tokenApprovalAmount).send({from: this.state.userAccount});
    }
    catch (error) {
      console.error(error);
    }
    document.activeElement.blur();
  }
  
  buyTokens = async () => {
    try {
      await this.tokenContract.methods.buyTokens(this.tokenPurchaseAmount).send({from: this.state.userAccount});
    }
    catch (error) {
      console.error(error);
    }
    document.activeElement.blur();
  }
  
  purchase = async (itemName, cost) => {
    try {
      if (!this.state.walletConnected) {
        alert("Please click the \"Connect Wallet\" button to get started!");
        return;
      }
      else if (!this.state.contractApproved) {
        alert("Please click the \"Approve\" button before purchasing!");
        return;
      }
      else if(this.state.tokenBalance < cost) {
        alert("You don't have enough PenguinCoins!");
        return;
      }
      const transaction = await this.dappContract.methods.purchase(itemName).send({from: this.state.userAccount});
      console.log(transaction);
    }
    catch (error) {
      console.error(error);
    }
  }

  formatAccount = (accountAddress) => {
    return `${accountAddress.slice(0,4)}...${accountAddress.slice(-4)}`;
  }

  purchasableOwned = (itemCost) => {
    return itemCost === "OWNED";
  }
  
  render() {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <p>PenguinCoin Balance: {this.state.tokenBalance}</p>
          {this.state.walletConnected &&
            <div>
              {this.state.sidebarToggleEnabled &&
                <Hamburger
                  menuOpen={this.state.sidebarOpen}
                  setMenuOpen={(sidebarOpen) => this.setState({sidebarOpen})}
                />
              }
              <Button 
                glow={this.state.tokenBalance < this.tokenApprovalThreshold}
                onClick={this.buyTokens}
              >
                "Buy" {this.tokenPurchaseAmount} Coins
              </Button>
            </div>
          }
          {this.state.walletConnected ? <p className={styles.account}>{`Account: ${this.formatAccount(this.state.userAccount)}`}</p>
                                      : <Button glow={true} onClick={this.connectToWallet}>Connect Wallet</Button>}
        </header>
        <main className={styles.appMain}>
          <Sidebar sidebarOpen={this.state.sidebarOpen}>
            <Purchasable
              label="Walk"
              item="walk" 
              cost={this.state.costs.walk}
              keyBinding="A - D - C"
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
            <div className={styles.instructions}>
              <h1 className={styles.title}>Hi, I'm Rupert!</h1>
              {!this.state.walletConnected &&
                <h2 className={styles.subtitle}>Connect your Metamask wallet to get started.</h2>
              }
              {this.state.walletConnected && !this.state.contractApproved &&
                <div className={styles.contractInteraction}>
                  <h2 className={styles.subtitle}>Please approve PenguinCoin smart contract</h2>
                  <div className={styles.approveButton}>
                    <Button onClick={this.approveToken}>Approve</Button>
                  </div>
                </div>
              }
              {this.state.contractApproved &&
                <h2 className={styles.subtitle}>
                  Spend your PenguinCoins to buy accessories and skills for me.
                </h2>
              }
            </div>
            <Penguin ref={this.penguin} costs={this.state.costs}/>
            {this.state.touchControlsEnabled &&
              <div className={styles.controlsArea}>
                {this.state.touchControlsVisible &&
                  <div className={styles.touchControls}>
                    <div className={styles.controlsGroup}>
                      {this.purchasableOwned(this.state.costs.walk) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("A")}>
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.walk) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("D")}>
                          <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.walk) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("C")}>
                          <FontAwesomeIcon icon={faArrowRight} />
                          {" "}
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.jump) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("W")}>
                          <FontAwesomeIcon icon={faArrowUp} />
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.spin) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("S")}>
                          <FontAwesomeIcon icon={faSyncAlt} />
                        </Button>
                      }
                    </div>
                    <div className={styles.controlsGroupTextButtons}>
                      {this.purchasableOwned(this.state.costs.wave) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("Q")}>
                          Wave Left
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.wave) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("E")}>
                          Wave Right
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.speak) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("F")}>
                          Speak
                        </Button>
                      }
                    </div>
                    <div className={styles.controlsGroupTextButtons}>
                      {this.purchasableOwned(this.state.costs.topHat) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("T")}>
                          Top Hat
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.monocle) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("M")}>
                          Monocle
                        </Button>
                      }
                      {this.purchasableOwned(this.state.costs.lollipop) &&
                        <Button onClick={() => this.penguin.current.handleKeyPress("L")}>
                          Lollipop
                        </Button>
                      }
                    </div>
                  </div>
                }
                <label htmlFor="touch-controls-toggle" className={styles.toggleContainer}>
                  <Toggle
                    id="touch-controls-toggle"
                    checked={this.state.touchControlsVisible}
                    disabled={!this.state.touchControlsEnabled}
                    onChange={this.handleTouchControlsToggle} />
                  <span>Button Controls</span>
                </label>
              </div>
            }
            {!this.state.walletConnected &&
              <div className={styles.infoArea}>
                <p>Penguin character design by FreeCodeCamp.com</p>
                <p>Accessories and animation by Nightlight Software</p>
              </div>
            }
          </div>
        </main>
      </div>
    );
  }
}

export default RupertApp;
