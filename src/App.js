import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import {checkForMetamask} from './Metamask.js';
import Penguin from './Penguin.js';
import Sidebar from './Sidebar.js';

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: "Connecting wallet..."
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
      } catch (error) {
        alert(error);
      }
    }, 1000);

    checkForMetamask();
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>PenguinCoin Balance:</p>
          {/* <p>Ethereum ERC-20 Token & Dapp Demo</p> */}
          <p>{this.state.userAccount}</p>
        </header>
        <main>
          <Sidebar />
          <div className="App-playArea">
            <h1>Hi, I'm Steve!</h1>
            <h2>Spend your PenguinCoins to buy accessories and skills for me.</h2>
            <Penguin />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
