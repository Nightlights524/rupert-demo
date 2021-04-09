export function amountString(amount, decimals) {
  return (amount * (10 ** decimals)).toString();
}

export async function getMessage(contract) {
  try {
    return await contract.methods.message().call();
  } catch (error) {
    alert(error);
  }
}

export async function kill(contract, sender) {
  try {
    await contract.methods.kill().send({from: sender});
    alert("CONTRACT SUCCESSFULLY SELF-DESTRUCTED!!!");
  } catch (error) {
    alert(error.message);
  }
}

export async function getOwner(contract) {
  try {
    return await contract.methods.owner().call();
  } catch (error) {
    alert(error);
  }
}

export async function totalSupply(contract) {
  try {
    return await contract.methods.totalSupply().call();
  } catch (error) {
    alert(error);
  }
}

export async function decimals(contract) {
  try {
    return await contract.methods.decimals().call();
  } catch (error) {
    alert(error);
  }
}

export async function symbol(contract) {
  try {
    return await contract.methods.symbol().call();
  } catch (error) {
    alert(error);
  }
}

export async function name(contract) {
  try {
    return await contract.methods.name().call();
  } catch (error) {
    alert(error);
  }
}

export async function balanceOf(contract, account) {
  try {
    return await contract.methods.balanceOf(account).call();
  } catch (error) {
    alert(error);
  }
}

export async function transfer(contract, recipient, amount, sender) {
  try {
    const decimals = await contract.methods.decimals().call();
    const amountString = (amount * (10 ** decimals)).toString();
    return await contract.methods.transfer(recipient, amountString).send({from: sender});
  } catch (error) {
    alert(error.message);
  }
}
  
  // /**
  //  * @dev Returns the remaining number of tokens that `spender` will be
  //  * allowed to spend on behalf of `owner` through {transferFrom}. This is
  //  * zero by default.
  //  *
  //  * This value changes when {approve} or {transferFrom} are called.
  //  */
  // function allowance(address _owner, address spender) external view returns (uint256);
  
  // /**
  //  * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
  //  *
  //  * Returns a boolean value indicating whether the operation succeeded.
  //  *
  //  * IMPORTANT: Beware that changing an allowance with this method brings the risk
  //  * that someone may use both the old and the new allowance by unfortunate
  //  * transaction ordering. One possible solution to mitigate this race
  //  * condition is to first reduce the spender's allowance to 0 and set the
  //  * desired value afterwards:
  //  * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
  //  *
  //  * Emits an {Approval} event.
  //  */
  // function approve(address spender, uint256 amount) external returns (bool);

  // /**
  //  * @dev Moves `amount` tokens from `sender` to `recipient` using the
  //  * allowance mechanism. `amount` is then deducted from the caller's
  //  * allowance.
  //  *
  //  * Returns a boolean value indicating whether the operation succeeded.
  //  *
  //  * Emits a {Transfer} event.
  //  */
  // function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  // /**
  //  * @dev Emitted when `value` tokens are moved from one account (`from`) to
  //  * another (`to`).
  //  *
  //  * Note that `value` may be zero.
  //  */
  // event Transfer(address indexed from, address indexed to, uint256 value);

  // /**
  //  * @dev Emitted when the allowance of a `spender` for an `owner` is set by
  //  * a call to {approve}. `value` is the new allowance.
  //  */


  //  * @dev Returns the bep token owner.
  //  */
  // function getOwner() external view returns (address);
  // event Approval(address indexed owner, address indexed spender, uint256 value);