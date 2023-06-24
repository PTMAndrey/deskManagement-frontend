import React from 'react'
import Input from '../../componente/Input/Input';
import styles from './Search.module.scss'
import useStateProvider from '../../hooks/useStateProvider';
import { BiArrowToRight } from 'react-icons/bi'
import { searchEmployee } from '../../api/API';
import { useState } from 'react';
import { Col } from 'react-bootstrap';

const Search = ({ value, onChange, placeholder = "Cauta...", label = "Cauta angajati" }) => {

    const { setAlert } = useStateProvider();
    const [persoane, setPersoane] = useState(null);
    const handleIconClick = async (e) => {
        e.preventDefault();
        try {
            console.log(value);
            const response = await searchEmployee(value);
            if (response.status === 200) {
                setPersoane(response.data);
            }

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
                onIconClear={(e) => { onChange(''); setPersoane(null) }}
                onChange={(e) => onChange(e.target.value)}
                icon={<BiArrowToRight />}
                onIconClick={handleIconClick}
            />
            {persoane?.length == 0 && <>
                <h6>Nu există persoane care să corespundă căutărilor dumneavoastră.</h6><br/>
            </>}
            {persoane?.length > 0 && <>
                <div className={styles.rowSearch}>
                    <Col><b>Nr. crt. </b></Col>
                    <Col><b>Nume</b></Col>
                    <Col><b>Prenume</b></Col>
                    <Col><b>Rol</b></Col>
                    <Col><b>Proiect</b></Col>
                    <Col><b>Manager</b></Col>
                    <Col><b>Email</b></Col>
                </div>
            </>}
            {persoane?.map((pers, ind) => (
                <div key={pers.id} className={styles.rowSearch}>
                    <Col>{ind + 1}. </Col>
                    <Col>{pers.nume} </Col>
                    <Col>{pers.prenume} </Col>
                    <Col>{pers.rol} </Col>
                    <Col>{pers.nume_proiect} </Col>
                    <Col>{pers.manager} </Col>
                    <Col>{pers.email}</Col>
                </div>
            ))}
        </div>
    )
}

export default Search