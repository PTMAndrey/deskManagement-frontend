import React, { useEffect, useState } from 'react'
import styles from './BookDesk.module.scss'
import Dropdown from '../Dropdown/Dropdown'
import { Col, Row } from 'react-bootstrap'
import Input from '../Input/Input';
import { getBirouriLiberePeEtaj, getIsBirouFree, rezervaBirou } from '../../api/API'
import useStateProvider from '../../hooks/useStateProvider';
import Button from '../Buton/Buton'
import useAuth from '../../hooks/useAuth';

const BookDesk = (props) => {

  const [showErrors, setShowErrors] = useState(false);
  const {userID} = useAuth();
  const { setAlert } = useStateProvider();
  const [birouriDisponibile, setBirouriDisponibile] = useState(null);
  const [raspunsRezervareBirou, setRaspunsRezervareBirou] = useState(null);

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

  const [ora1, setOra1] = useState('');
  const [ora2, setOra2] = useState('');
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
            console.log(response.data);
            setBirouriDisponibile(response.data);
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

  const handleRezervaAcum = async() =>{
try {
  const response = await rezervaBirou(props.idBirou, userID, formValue);
  if(response.status === 200){
    setAlert({ type: 'success', message: 'Rezervare efectuata cu succes!' });
    props.toggleModal();
  }
} catch (error) {
  console.log(e);
}
  }

  return (
    <div className={styles.bookDeskContainer}>
      <Row className={styles.bookDeskBody}>
        {props.rol === 'cautaBirou' &&
          <Col>
            <p className={styles.label}>Etaj</p>
            <Dropdown
              className='mt-4'
              name='etaj'
              title={'Etaj'}
              options={etaje}
              onChange={(e) => {
                setFormValue({ ...formValue, etaj: e.value })
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
            onChange={(e) => {
              !e.target.valueAsDate ?
                setFormValue({ ...formValue, ziuaCautare: '' })
                :
                setFormValue({ ...formValue, ziuaCautare: transformDate(e.target.valueAsDate) })
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
            }}
            error={showErrors && checkErrors('oraIncheiere') ? true : false}
            helper={showErrors ? checkErrors('oraIncheiere') : ''}
          />

        </Col>

        <Col>
          <Button variant="tertiary" className='mt-4 rounded-pill' label='Cauta' border={false} iconRol='search' position='left' onClick={() => handleSearch()} />
        </Col>

      </Row>
      <Row>
        {props.rol === 'cautaBirou' &&
          <>
            {(birouriDisponibile && formValue.ziuaCautare) && <>
              {console.log(birouriDisponibile)}
              {birouriDisponibile.map((birou, index) => (
                <div key={index}>
                  <p>Biroul {birou.numar} este disponibil in intervalul [ {formValue.oraInceput} - {formValue.oraIncheiere} ] la data de {formValue.ziuaCautare}</p>
                </div>)
              )}
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
              <p style={{color:'red'}}>Biroul nu este disponibil la aceasta data</p>
            </Col>
          </>
        }


      </Row>
    </div>
  )
}

export default BookDesk