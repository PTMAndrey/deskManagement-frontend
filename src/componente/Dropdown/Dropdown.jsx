import Select from "react-select";
import styles from "./Dropdown.module.scss";
import { components } from "react-select";
import PropTypes from "prop-types";
import React, { useState } from "react";

const Option = (props) => {
    return (
        <div className={styles.option}>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                    className={styles.optionCheck}
                />
                <label className={styles.optionLabel}>{props.label}</label>
            </components.Option>
        </div>
    );
};

const Programare = [
    { value: 'Value1', label: "Value1" },
    { value: 'Value2', label: "Value2" },
    { value: 'Value3', label: "Value3" },
    { value: 'Value4', label: "Value4" },
];

const Dropdown = ({
    fontWeight,
    fontSize,
    title,
    multi,
    options,
    searchable,
    clearable,
    onChange,
    selectedOptions,
    setSelectedOptions,
    error,
    helper,
    className,
}) => {
    const [multipleOption] = useState(
        multi
            ? { IndicatorSeparator: () => null, Option }
            : { IndicatorSeparator: () => null }
    );
    function setColor(fontSize) {
        if (fontSize === "buton") return "red";
        else return "gray";
    }
    const color = setColor(fontSize);
    const style = {
        menuList: (base) => ({
            ...base,
            height: "100%",
            boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.25)",
            paddingTop: 0,
            paddingBottom: 0,
            border: 0,
            outline: 0,
            color: "$color-gray-400",
            "::-webkit-scrollbar": {
                width: "6px",
            },
            "::-webkit-scrollbar-track": {
                background: "$color-gray-white",
            },
            "::-webkit-scrollbar-thumb": {
                background: "#403633",
                borderRadius: "11px!important",
                height: "2px!important",
            },
        }),
        menu: (base) => ({
            ...base,
            marginTop: 0,
            border: 0,
            outline: 0,
        }),
        control: (base, state) => ({
            ...base,
            boxShadow: state.isFocused ? null : null,
            border: 0,
            backgroundColor: "transparent",
            color: "#0241ae",
            cursor: "pointer",
        }),
        placeholder: (base, state) => ({
            ...base,
            color: color,
            cursor: "pointer",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: color,
            "&:hover": {
                color: color,
            },
        }),
    };

    return (
        <>
            <Select
                value={selectedOptions}
                options={options}
                className={`${className} ${styles.dropdown} ${styles[fontWeight]} ${styles[fontSize]} ${styles.classicOption} ${error && styles.selectError}`}
                styles={style}
                placeholder={title}
                componente={multipleOption}
                isMulti={multi ? true : null}
                closeMenuOnSelect={multi ? false : true}
                hideSelectedOptions={multi ? false : true}
                defaultValue={title}
                controlShouldRenderValue={multi ? false : true}
                onChange={onChange}
                isSearchable={searchable ? true : false}
                isClearable={clearable ? true : false}
            />
            <p className={error ? styles.helperErr : null}>{helper}</p>
        </>
    );
};

Dropdown.propTypes = {
    fontWeight: PropTypes.oneOf(["bold", "semibold", "medium", "regular"])
        .isRequired,
    fontSize: PropTypes.oneOf(["buton", "bodySmall"]).isRequired,
    placeholder: PropTypes.string.isRequired,
    multi: PropTypes.bool,
    searchable: PropTypes.bool,
    clearable: PropTypes.bool,
    error: PropTypes.bool,
    helper: PropTypes.string,
};

Dropdown.defaultProps = {
    fontWeight: "semibold",
    fontSize: "bodySmall",
    placeholder: "Placeholder",
    multi: false,
    options: Programare,
    searchable: false,
    clearable: false,
    error: false,
    helper: "",
};

export default Dropdown;
