import React, { useEffect } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import styles from './BookDesk.module.scss';
import { Col, Row } from 'react-bootstrap';
import Input from '../Input/Input';
import Button from '../Buton/Buton'

const FiltreCautareBirou = ({ handleSearch, rolComponenta, dataAzi, firstInterval, secondInterval, formValue, etaje, setFormValue, transformDate, showErrors, checkErrors, setRaspunsRezervareBirou, ora1, setOra1, ora2, setOra2 }) => {

    useEffect(() => {
        console.log(formValue)
    }, [formValue])

    return (
        <>
            {rolComponenta === 'cautaBirou' &&
                <Col>
                    <p className={styles.label}>Etaj</p>
                    <Dropdown
                        className='mt-4'
                        name='etaj'
                        title={formValue.etaj ? etaje[formValue.etaj - 1].label : 'Etaj'}
                        options={etaje}
                        onChange={(e) => {
                            setFormValue({ ...formValue, etaj: e.value });
                        }}
                        error={showErrors && checkErrors('etaj') ? true : false}
                        helper={showErrors ? checkErrors('etaj') : ''}
                    />
                </Col>
            }
            <Col>
                <p className={styles.label}>Ziua</p>

                <Input
                    id="data"
                    type='date'
                    name='ziuaCautare'
                    value={formValue.ziuaCautare ? formValue.ziuaCautare : ''}
                    onChange={(e) => {
                        !e.target.valueAsDate ?
                            setFormValue({ ...formValue, ziuaCautare: '' })
                            :
                            setFormValue({ ...formValue, ziuaCautare: transformDate(e.target.valueAsDate) });

                        setRaspunsRezervareBirou(null);
                    }}
                    min={dataAzi}
                    required
                    error={showErrors && checkErrors('ziuaCautare') ? true : false}
                    helper={showErrors ? checkErrors('ziuaCautare') : ''}
                />
            </Col>
            <Col>
                <p className={styles.label}>Ora de inceput</p>
                <Dropdown
                    title={!ora1 ? 'Alege ora' : ora1}
                    options={firstInterval}
                    className='mt-4'
                    onChange={(e) => {
                        setFormValue({ ...formValue, oraInceput: e.value + ':00' })
                        setOra1(e.value);
                        setOra2(null);
                        setRaspunsRezervareBirou(null);
                    }}
                    error={showErrors && checkErrors('oraInceput') ? true : false}
                    helper={showErrors ? checkErrors('oraInceput') : ''}
                />
            </Col>
            <Col>
                <p className={styles.label}>Ora incheiere</p>
                <Dropdown
                    title={!ora2 ? 'Alege ora' : Number(ora1) >= Number(ora2) ? "Alege ora" : ora2}
                    options={secondInterval}
                    className='mt-4'
                    onChange={(e) => {
                        setFormValue({ ...formValue, oraIncheiere: e.value + ':00' })
                        setOra2(e.value);
                        setRaspunsRezervareBirou(null);
                    }}
                    error={showErrors && checkErrors('oraIncheiere') ? true : false}
                    helper={showErrors ? checkErrors('oraIncheiere') : ''}
                />

            </Col>

            <Col>
                <Button variant="tertiary" className='mt-4 rounded-pill' label='Cauta' border={false} iconRol='search' position='left' onClick={handleSearch} />
            </Col>
        </>
    )
}

export default FiltreCautareBirou