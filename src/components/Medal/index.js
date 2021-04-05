import React from 'react';

import { getMedalById } from 'lookups';
import styles from './Medal.module.css';


const Medal = ({ id, small, anchor }) => {
  const { description, name, spriteLocation: { left, top } } = getMedalById(id);
  return <span className={styles.el}>
    <input
      className={styles.input}
      type="checkbox"
      id={`${anchor}${id}`}
    />
    <label
      className={styles.label}
      htmlFor={`${anchor}${id}`}
      title={`${name} - ${description}`}
      style={{
        backgroundPositionX: -(small ? left / 4 : left),
        backgroundPositionY: -(small ? top / 4 : top),
        ...(small && {height: 74 / 4}),
        ...(small && {width: 74 / 4}),
        ...(small && {backgroundSize: 512}),
      }}
    />
  </span>
};

export default Medal;
