import React from "react";
import styles from "./Input.module.scss";
import PropTypes from "prop-types";
import {MdOutlineCancel} from 'react-icons/md'

const Input = ({
  ref,
  error,
  icon,
  id,
  label,
  name,
  onBlur,
  onChange,
  onClick,
  onIconClick,
  placeholder,
  type,
  value,
  helper,
  disabled,
  min,
  max,
  pattern,
  title,
  clearable,
  onIconClear,
  checked,
  readOnly,
}) => {
  return (
    <div className={`${styles.containerInput} ${error && styles.error}`}>
      {label ? <label htmlFor={name}>{label}</label> : <p></p> }
      <input
        title={title}
        disabled={disabled}
        value={value}
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        placeholder={placeholder}
        className={error ? styles.inputErr : null}
        type={type}
        pattern={pattern}
        min={min}
        max={max}
        checked={checked}
        readOnly={readOnly}
      />
      {clearable &&
        <span
          onClick={onIconClear}
          className={`${styles.iconX} ${disabled && styles.disabled}`}
        >
          <MdOutlineCancel/>
        </span>
      }
      <span
        onClick={onIconClick}
        className={`${styles.icon} ${disabled && styles.disabled}`}
      >
        {icon}
      </span>
      <p className={error ? styles.helperErr : null}>{helper}</p>
    </div>
  );
};

Input.propTypes = {
  error: PropTypes.bool,
  icon: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onIconClick: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  helper: PropTypes.string,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  title: PropTypes.string,
  pattern: PropTypes.string,
  clearable: PropTypes.bool,
  onIconClear: PropTypes.func,
  checked: PropTypes.bool,
  readOnly: PropTypes.bool,
};

Input.defaultProps = {
  error: false,
  icon: null,
  id: "",
  label: "",
  name: "",
  onBlur: () => { },
  onChange: () => { },
  onClick: () => { },
  onIconClick: () => { },
  placeholder: "Placeholder",
  type: "text",
  helper: "",
  disabled: false,
  min: '',
  max: '',
  clearable: false,
  onIconClear:  () => { },
  checked: false,
  readOnly: false,
};

export default Input;
