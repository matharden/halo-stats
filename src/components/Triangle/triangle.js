import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './Triangle.module.css';


const Triangle = props => <svg
  xmlns="http://www.w3.org/2000/svg"
  width="5"
  height="5"
  fill="none"
  viewBox="0 0 5 5"
  className={cn(styles.triangle, {
    [styles[`chevron--bright`]]: props.bright,
  }, props.className)}>
  <polygon points="0 0, 5 0, 5 5" />
</svg>

Triangle.propTypes = {
  bright: PropTypes.bool,
};

Triangle.defaultProps = {
  bright: true,
};

export default Triangle;
