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
  const { user } = useAuth();

  return (
    <Container fluid className={styles.mainContainer}>
      <SearchEmployees value={searchEmployees} onChange={setSearchEmployees} placeholder="Caută angajați după numele lor" />
      <BookDesk rol='cautaBirou' />
    </Container >
  )
}

export default PaginaPrincipala