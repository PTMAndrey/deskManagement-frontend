import React, { useEffect, useState } from 'react'
import { detectOverflow } from '@popperjs/core'
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import useStateProvider from '../../hooks/useStateProvider';
import { ReactComponent as Add } from '../../assets/icons/add.svg';
import { ReactComponent as Edit } from '../../assets/icons/edit.svg';
import { RiDeleteBinFill } from 'react-icons/ri';
import { getAllUsers } from '../../api/API';
import moment from 'moment';
import 'moment/locale/ro';
import Buton from '../../componente/Buton/Buton'

import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';
import styles from './Utilizatori.module.scss';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Utilizatori = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(() => {
      if(user?.rol !== 'Admin' && user)
        navigate('/');
    }, [user])
    

    const { setAlert } = useStateProvider();
    const [modalDelete, setModalDelete] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [useri, setUseri] = useState([]);


    const toggleModalDelete = () => {
        setModalDelete(!modalDelete);
    };
    const toggleModalEdit = () => {
        setModalEdit(!modalEdit);
    };

    useEffect(() => {
        fetchRezervari();
    }, [useri]);




    function createData(id, nume, prenume, email, departament, rol, nume_proiect, manager) {
        return { id, nume, prenume, email, departament, rol, nume_proiect, manager };
    }
    const rows = [
        useri?.map((rez) => {
            return (
                createData(rez.id, rez.nume, rez.prenume, rez.email, rez.departament, rez.rol, rez.nume_proiect, rez.manager))
        }
        )
    ];



    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchRezervari = async () => {
        try {
            const response = await getAllUsers();
            if (response.status === 200) {
                setUseri(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.containerUseri}>
            <div className={styles.useriBody}>
                <Buton variant="tertiary" label='Adaugă' icon={<Add/>} className={`${styles.width40} mb-5`}/>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                                <StyledTableCell align="center">Nume</StyledTableCell>
                                <StyledTableCell align="center">Prenume</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Departament</StyledTableCell>
                                <StyledTableCell align="center">Rol</StyledTableCell>
                                <StyledTableCell align="center">Proiect</StyledTableCell>
                                <StyledTableCell align="center">Manager</StyledTableCell>
                                <StyledTableCell align="center">Actiuni</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? rows[0]?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows[0]
                            )?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell style={{ width: 260 }} align="center">
                                        {row?.nume}
                                    </TableCell>
                                    <TableCell style={{ width: 260 }} align="center">
                                        {row?.prenume}
                                    </TableCell>
                                    <TableCell style={{ width: 460 }} align="center">
                                        {row?.email}
                                    </TableCell>
                                    <TableCell style={{ width: 70 }} align="center">
                                        {row?.departament}
                                    </TableCell>
                                    <TableCell style={{ width: 360 }} align="center">
                                        {row?.rol}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="center">
                                        {row?.nume_proiect}
                                    </TableCell>
                                    <TableCell style={{ width: 460 }} align="center">
                                        {row?.manager}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="center">
                                        <RiDeleteBinFill style={{ cursor: 'pointer' }} onClick={() => {
                                            // handleDeleteRezervare(row?.id);
                                        }} />
                                        <br />
                                        <Edit style={{ cursor: 'pointer' }} onClick={() => {
                                            // handleDeleteRezervare(row?.id);
                                        }} />
                                    </TableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={5}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>

            </div>

            {
                modalDelete && (
                    <MDBModal show={modalDelete} tabIndex='-1' setShow={setModalDelete}>
                        <MDBModalDialog size="lg">
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Sterge utilizator</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleModalDelete}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>
                                    <p>Ești sigur că dorești să ștergi acest cont?</p>
                                    <p>Această acțiune este ireversibilă! </p>
                                    {
                                        <div className={styles.buttonsModal}>
                                            <MDBBtn size='sm' color='danger' onClick={() => { toggleModalDelete() }}>Actualizează</MDBBtn>

                                            <MDBBtn size='sm' color='info' onClick={() => { toggleModalDelete(); }}>Anulează</MDBBtn>
                                        </div>
                                    }

                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )
            }
            
            {
                modalEdit && (
                    <MDBModal show={modalEdit} tabIndex='-1' setShow={setModalEdit}>
                        <MDBModalDialog size="lg">
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Schimba poza profil</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleModalEdit}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>

                                    {
                                        <div className={styles.buttonsModal}>
                                            <MDBBtn size='sm' color='danger' onClick={() => { toggleModalEdit() }}>Actualizează</MDBBtn>

                                            <MDBBtn size='sm' color='info' onClick={() => { toggleModalEdit(); }}>Anulează</MDBBtn>
                                        </div>
                                    }

                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )
            }
        </div>
    )
}

export default Utilizatori;



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}


TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
