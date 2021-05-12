import React from 'react';
import * as styles from "./Purchasable.module.css"
import logo from './logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'

function Purchasable({label, item, cost, keyBinding, onClickUnowned, onClickOwned}) {
  const owned = cost === "OWNED";
  return (
    <button className={styles.purchasable} onClick={owned ? onClickOwned : () => onClickUnowned(item, cost)}>
      <div className={styles.iconContainer}>
        <img src={logo} className={styles.icon} alt={label} />
        {owned && <FontAwesomeIcon icon={faCheckSquare} className={styles.checkmark} />}
      </div>
      <p className={styles.label}>{label}: {owned ? keyBinding : cost}</p>
    </button>
  );
}

export default Purchasable;