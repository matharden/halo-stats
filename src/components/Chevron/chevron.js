import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './Chevron.module.css';


const Chevron = props => <svg
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  fill="none"
  viewBox="0 0 407.437 407.437"
  className={cn(styles.chevron, {
    [styles[`chevron--down`]]: props.down,
    [styles[`chevron--bright`]]: props.bright,
    [styles[`chevron--spin`]]: props.spin,
  })}>
  <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "/>
</svg>

Chevron.propTypes = {
  down: PropTypes.bool,
  bright: PropTypes.bool,
  spin: PropTypes.bool,
};

Chevron.defaultProps = {
  down: false,
  bright: false,
  spin: false,
};

export default Chevron;
