import React from "react";
import PropTypes from "prop-types";
import styles from "./Buton.module.scss";
import {RiUserSearchLine} from 'react-icons/ri'

const Buton = ({
  className,
  variant,
  label,
  icon,
  position,
  disabled,
  onClick,
  iconRol,
  border,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${styles[position]} ${className} ${border ? styles.border : styles.noBorder}`}
    >
      {
        iconRol === 'search' ?  <RiUserSearchLine/> : null
      }
      <span className={styles.label}> {icon} </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
};

Buton.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "tertiary", "destructive","transparent"]).isRequired,
  
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  position: PropTypes.oneOf(["left", "right", "none"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  iconRol: PropTypes.string,
  border: PropTypes.bool,
};

Buton.defaultProps = {
  variant: "primary",
  label: "Buton",
  position: "none",
  disabled: false,
  onClick: () => { },
  className: "",
  iconRol: "",
  border: true,
};

export default Buton;
