import Web3 from 'web3';

const checkForMetamask = () => {
  window.addEventListener('load', async function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    // Modern DApp Browsers
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try { 
        // window.ethereum.enable().then(function() {
        //     // User has allowed account access to DApp...
        //     alert("Web3 Provider set to Mist/Metamask");
        // });
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // User has allowed account access to DApp...
        // alert("Web3 Provider set to Mist/Metamask");
      } 
      catch(e) {
        // User has denied account access to DApp...
        alert("User has denied account access to DApp!");
        console.error(e);
      }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // alert("Web3 Provider set to Mist/Metamask");
    }
    // Non-DApp Browsers
    else {
      // Handle the case where the user doesn't have web3.
      alert("Please install Metamask in order to use this app!");
    }
  });
}

export {checkForMetamask};