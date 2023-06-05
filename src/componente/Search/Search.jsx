import React from 'react'
import Input from '../../componente/Input/Input';
import styles from './Search.module.scss'
import useStateProvider from '../../hooks/useStateProvider';
import { BiArrowToRight } from 'react-icons/bi'

const Search = ({ value, onChange, placeholder="Cauta...", label = "Cauta angajati" }) => {

    const { setAlert } = useStateProvider();
    const handleIconClick = (e) => {
        e.preventDefault();
        try {
            console.log(value);

        } catch (e) {
            console.log("Error: ", e);
            setAlert({
                type: "error",
                message: "Error on searching",
            });
        }
    }
    return (
        <div className={styles.searchContainer}>
            <Input
                className={styles.inputEmployee}
                value={value}
                label={label !== "" ? label : null}
                placeholder={placeholder}
                clearable
                onIconClear={(e) => onChange('')}
                onChange={(e) => onChange(e.target.value)}
                icon={<BiArrowToRight />}
                onIconClick={handleIconClick}
            />
            <div>
                
            </div>
        </div>
    )
}

export default Search