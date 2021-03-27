import React from 'react';

import { getMedalById } from '../../lookups';


const Medal = ({ id, small, anchor }) => {
  const { description, name, spriteLocation: { left, top } } = getMedalById(id);
  return <span className="Award">
    <input
      className="Award-input"
      type="checkbox"
      id={`${anchor}${id}`}
    />
    <label
      className="Award-label"
      htmlFor={`${anchor}${id}`}
      title={`${name} - ${description}`}
      style={{
        backgroundPositionX: -(small ? left / 2 : left),
        backgroundPositionY: -(small ? top / 2 : top),
        ...(small && {height: 37}),
        ...(small && {width: 37}),
        ...(small && {backgroundSize: 1024}),
      }}
    />
  </span>
};

export default Medal;
