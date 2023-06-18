import React, { useState } from 'react'
import styles from './PaginaPrincipala.module.scss';
import { Container } from 'react-bootstrap';
import BirouriEtaj from '../../componente/BirouriEtaj/BirouriEtaj';
import SearchEmployees from '../../componente/Search/Search';
import BookDesk from '../../componente/BookDesk/BookDesk';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useAuth from '../../hooks/useAuth';

const PaginaPrincipala = () => {
  const [searchEmployees, setSearchEmployees] = useState('');
  const [miniNav, setMiniNav] = useState('search');
  const { width } = useWindowDimensions();
  const {user} = useAuth();

  return (
    <Container fluid className={styles.mainContainer}>
      {/* <BirouriEtaj/> */}
      <SearchEmployees value={searchEmployees} onChange={setSearchEmployees} placeholder="Caută angajați după numele lor" />

      <div className={styles.miniNav}>
        <button onClick={() => setMiniNav('search')} className={`${miniNav === 'search' && styles.activeNav}`}>Cauta birouri</button>
        {width > 550 && <button onClick={() => setMiniNav('map')} className={`${miniNav === 'map' && styles.activeNav}`}>Rezerva birou</button>}
      </div>
      {(() => {
        switch (miniNav) {
          case 'search':
            return <BookDesk rol='cautaBirou'/>;
          case 'map':
            return <BirouriEtaj rolComponenta={user?.rol === 'Admin' ? "admin" : "client" } />
          default:
            return null;
        }
      })()}

    </Container >
  )
}

export default PaginaPrincipala