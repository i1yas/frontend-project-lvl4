import React from 'react';
import iconsSprite from '../../assets/bootstrap-icons.svg';

const Icon = ({ name }) => (
  <svg width={24} height={24}>
    <use xlinkHref={`${iconsSprite}#${name}`} />
  </svg>
);

// const Icon = () => 'test';

export default Icon;
