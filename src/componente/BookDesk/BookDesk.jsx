import React, { useEffect, useState } from 'react'
import styles from './BookDesk.module.scss'
import Dropdown from '../Dropdown/Dropdown'
import { Col, Row } from 'react-bootstrap'
import Input from '../Input/Input';
import { getBirouriLiberePeEtaj, getIsBirouFree, rezervaBirou } from '../../api/API'
import useStateProvider from '../../hooks/useStateProvider';
import Button from '../Buton/Buton'
import useAuth from '../../hooks/useAuth';

import moment from 'moment';
import 'moment/locale/ro';
import FiltreCautareBirou from './FiltreCautareBirou';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody
} from 'mdb-react-ui-kit';
import { HiViewList } from 'react-icons/hi'

const BookDesk = (props) => {

  const [showErrors, setShowErrors] = useState(false);
  const { userID } = useAuth();
  const { setAlert } = useStateProvider();
  const [birouriDisponibile, setBirouriDisponibile] = useState(null);
  const [raspunsRezervareBirou, setRaspunsRezervareBirou] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [deskID, setDeskID] = useState(null);
  const [modal, setModal] = useState(null);

  const transformDate = (e) => {
    return (e.getFullYear() + '-' + ((e.getMonth() + 1) < 10 ? ('0' + String(e.getMonth() + 1)) : (e.getMonth() + 1)) + '-' + ((e.getDate() < 10 ? '0' + String(e.getDate()) : e.getDate())));
  }

  const [formValue, setFormValue] = useState({
    etaj: null,
    ziuaCautare: null,
    oraInceput: null,
    oraIncheiere: null,
  });


  // --------------------------------------- Default data ------------------------------------------

  const [ora1, setOra1] = useState(null);
  const [ora2, setOra2] = useState(null);
  const [firstInterval, setFirstInterval] = useState([]);
  const [secondInterval, setSecondInterval] = useState([]);

  let finalProgram = 17;

  useEffect(() => {
    setBirouriDisponibile(null);
    let newFirstInterval = [];
    let fp = finalProgram;

    if (ora1 === null && ora2 !== null) {
      fp = Number(ora2) - 1;
    }

    for (let i = 8; i < fp; i++) {
      if (i < 10)
        newFirstInterval.push({ value: `0${i}`, label: `0${i}:00` });
      else
        newFirstInterval.push({ value: `${i}`, label: `${i}:00` });
    }
    setFirstInterval(newFirstInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ora2])

  useEffect(() => {
    setBirouriDisponibile(null);
    if (Number(ora1) >= Number(ora2))
      setOra2(null);

    let newSecondInterval = [];
    let intervals = 10;

    if (ora1 !== null) {
      intervals = Number(ora1) + 2;
    }

    for (let i = intervals; i < 19; i++) {
      if (i < 10)
        newSecondInterval.push({ value: `0${i}`, label: `0${i}:00` });
      else
        newSecondInterval.push({ value: `${i}`, label: `${i}:00` });
    }
    setSecondInterval(newSecondInterval);
  }, [ora1])

  const etaje = [];
  for (let i = 1; i < 6; i++) {
    etaje.push({ value: i, label: `Etajul ${i}` },);
  }


  // --------------------------------------- END default data ------------------------------------------



  //-------------------------------- VALIDARI
  // check errors
  const checkErrors = (field) => {

    if (field === 'etaj' && props.rol === 'cautaBirou') {
      if (!formValue.etaj)
        return 'Selectarea etajului este obligatorie';
    }
    if (field === 'ziuaCautare') {
      if (!formValue.ziuaCautare)
        return 'Selectarea zilei este obligatorie';
      if (Number(formValue.ziuaCautare.slice(0, 4)) < Number(new Date().getFullYear()))
        return 'Data trebuie sa fie in viitor!'
      else {
        if (Number(formValue.ziuaCautare.slice(5, 7)) < Number(new Date().getMonth() + 1))
          return 'Data trebuie sa fie in viitor!'
        if (Number(formValue.ziuaCautare.slice(5, 7)) === Number(new Date().getMonth() + 1) && Number(formValue.ziuaCautare.slice(8, 10)) < Number(new Date().getDate()))
          return 'Data trebuie sa fie in viitor!'
      }
    }
    if (field === 'oraInceput') {
      if (!formValue.oraInceput)
        return 'Ora de incepere este obligatorie';
    }
    if (field === 'oraIncheiere') {
      if (!formValue.oraIncheiere)
        return 'Ora de incheiere este obligatorie';
      if (Number(ora2) < Number(ora1))
        return 'Ora de incheiere trebuie sa fie mai mare decat ora de inceput'
    }

    return '';
  };


  const isFormValid = () => {
    let isValid = true;
    Object.keys(formValue).forEach((field) => {
      if (checkErrors(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const e = new Date();
  const dataAzi = (e.getFullYear() + '-' + ((e.getMonth() + 1) < 10 ? ('0' + String(e.getMonth() + 1)) : (e.getMonth() + 1)) + '-' + ((e.getDate() < 10 ? '0' + String(e.getDate()) : e.getDate())));


  const handleSearch = async () => {
    try {
      if (!isFormValid()) {
        setShowErrors(true);
        setAlert({ type: 'danger', message: 'Câmpurile trebuie completate!' });
      }
      if (isFormValid()) {
        setShowErrors(false);
        if (props.rol === 'cautaBirou') {
          const response = await getBirouriLiberePeEtaj(formValue);
          if (response.status === 200) {
            setBirouriDisponibile(response.data.sort((a, b) => a.numar - b.numar));
            setSelectedValue(null);
          }
        }
        if (props.rol === 'rezervareBirou') {
          console.log(props.idBirou)
          const response = await getIsBirouFree(props.idBirou, formValue);
          if (response.status === 200) {
            console.log(response);
            setRaspunsRezervareBirou(response.data);
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleRezervaAcum = async (id) => {
    try {
      console.log(formValue);
      const response = await rezervaBirou(id ? id : props.idBirou, userID, formValue);
      if (response.status === 200) {

        if (props.rol === 'rezervareBirou') {
          props.toggleModal();
          props.fetchBirouri();
        }
        if (props.rol === 'cautaBirou') {
          handleSearch();

        }
        setAlert({ type: 'success', message: 'Rezervare efectuata cu succes!' });
      }
    } catch (error) {
      console.log(e);
    }
  }

  const uniqueValues = [...new Set(birouriDisponibile?.map(obj => obj.numar))];

  const handleChange = (item) => {
    console.log(item)
    if (item === 'noValue')
      setSelectedValue(null)
    else
      setSelectedValue(item);
  }


  const toggleModalConfirmareRezervare = () => {
    setModal(!modal);
  };


  return (
    <div className={styles.bookDeskContainer}>
      <Row className={styles.bookDeskBody}>
        <FiltreCautareBirou handleSearch={handleSearch} rolComponenta={props.rol} dataAzi={dataAzi} firstInterval={firstInterval} secondInterval={secondInterval} formValue={formValue} etaje={etaje} setFormValue={setFormValue} transformDate={transformDate} showErrors={showErrors} checkErrors={checkErrors} setRaspunsRezervareBirou={setRaspunsRezervareBirou} ora1={ora1} setOra1={setOra1} ora2={ora2} setOra2={setOra2} />
      </Row>

      <Row>
        {props.rol === 'cautaBirou' &&
          <>
            {/* <Row className={styles.camereBirouriLibere}>
              <Col>
                <span><HiViewList/></span>
                <span>Camera 1</span>
              </Col>
            </Row>
            <Row className={styles.camereBirouriLibere}>
              <div>Camera 2</div>
            </Row>
            <Row className={styles.camereBirouriLibere}>
              <div>Camera 3</div>
            </Row> */}
            {(birouriDisponibile && formValue.ziuaCautare) &&
              <>
                <Row>
                  <p>Ziua aleasa: {moment(formValue.ziuaCautare, 'YYYY-MM-DD').format('DD MMMM YYYY')}</p>
                </Row>
                <div>
                  {/* <select onChange={handleChange} style={{ cursor: 'pointer' }}>
                    <option value='noValue'>Alege camera</option>
                    {uniqueValues.map((item, ind) => (
                      <option key={ind} value={item}>
                        Camera {item}
                      </option>
                    ))}
                  </select> */}

                  {uniqueValues?.map((item, ind) => (
                    <Row key={item} className={styles.camereBirouriLibere} onClick={() => handleChange(item)}>
                      <Col>
                        <span><HiViewList /></span>
                        <span>Camera {item}</span>
                      </Col>
                    </Row>
                  ))}

                  {selectedValue && (
                    <div style={{ border: '1px solid gray !important' }}>
                      {/* {birouriDisponibile?.map((obj, ind) => (
                        {
                          obj.numar == selectedValue &&
                            <Row key={ind} className={styles.birouLiber}>
                              <Col className={styles.birouLiberText}>Birou in camera {obj.numar} este disponibil in intervalul <b> {formValue.oraInceput} - {formValue.oraIncheiere} </b> </Col>
                              <Col style={{ width: '1%!important' }}></Col>
                              <Button label='Rezerva' className={styles.rezervaBirouriLibere} onClick={() => { toggleModalConfirmareRezervare(); setDeskID(obj.id); handleRezervaAcum() }} />
                            </Row>
                        })
                      )} */}
                      {birouriDisponibile?.map((obj, ind) => {
                        if (obj.numar === selectedValue) {
                          return (
                            <Row key={ind} className={styles.birouLiber}>
                              <Col className={styles.birouLiberText}>
                                Birou in camera {obj.numar} este disponibil in intervalul{' '}
                                <b>
                                  {formValue.oraInceput} - {formValue.oraIncheiere}
                                </b>
                              </Col>
                              <Col style={{ width: '1%!important' }}></Col>
                              <Button
                                label="Rezerva"
                                className={styles.rezervaBirouriLibere}
                                onClick={() => {
                                  setDeskID(obj.id);
                                  toggleModalConfirmareRezervare();
                                }}
                              />
                            </Row>
                          );
                        } else {
                          return null; // Return null if the condition is not met
                        }
                      })}

                    </div>
                  )}
                </div>
              </>}
            {birouriDisponibile?.length === 0 &&
              <>
                <p>Nu exista birouri disponibile</p>
              </>}
          </>
        }
        {props.rol === 'rezervareBirou' && raspunsRezervareBirou === true &&
          <>
            <Col>
              <p>Biroul este disponibil</p>
            </Col>
            <Col>
              <Button variant="tertiary" className='mt-4 rounded-pill' label='Rezerva acum' border={false} iconRol='search' position='left' onClick={() => handleRezervaAcum()} />
            </Col>
          </>
        }
        {props.rol === 'rezervareBirou' && raspunsRezervareBirou === false &&
          <>
            <Col>
              <p style={{ color: 'red' }}>Biroul nu este disponibil la aceasta data</p>
            </Col>
          </>
        }

        {
          modal && (
            <MDBModal show={modal} tabIndex='-1' setShow={setModal}>
              <MDBModalDialog size="lg">
                <MDBModalContent>
                  <MDBModalHeader>
                    <MDBModalTitle>Confirmare</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={() => { toggleModalConfirmareRezervare(); setDeskID(null) }}></MDBBtn>
                  </MDBModalHeader>
                  <MDBModalBody>
                    <p>Doriți să rezervați acest birou?</p>
                    <div className='d-flex justify-items-space-between align-items-center'>
                      <MDBBtn color='danger' onClick={() => { handleRezervaAcum(deskID); toggleModalConfirmareRezervare(); setDeskID(null) }}>Da</MDBBtn>

                      <MDBBtn color='info' onClick={() => { toggleModalConfirmareRezervare(); setDeskID(null) }}>Nu</MDBBtn>
                    </div>
                  </MDBModalBody>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          )
        }


      </Row>
    </div>
  )
}

export default BookDesk