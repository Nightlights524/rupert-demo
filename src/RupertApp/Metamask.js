const checkForMetamask = async () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  // Modern DApp Browsers
  if (window.ethereum) {
    try { 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // User has allowed account access to DApp...
      return true;
    } 
    catch(error) {
      // User has denied account access to DApp...
      console.error(error);
      return false;
    }
  }
  // Legacy DApp Browsers
  else if (window.web3) {
    window.web3 = new window.Web3(window.web3.currentProvider);
    return true;
  }
  // Non-DApp Browsers
  else {
    // Handle the case where the user doesn't have web3.
    alert("Please install Metamask to use this app!");
    return false;
  }
}

export {checkForMetamask};