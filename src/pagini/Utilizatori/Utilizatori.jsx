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
import { addUser, deleteUser, getAllUsers, getUserById, updateUser } from '../../api/API';
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
import { Col } from 'react-bootstrap';
import Input from '../../componente/Input/Input';

const Utilizatori = () => {
    const navigate = useNavigate();
    const { user, fetchUser } = useAuth();

    useEffect(() => {
        if (user?.rol !== 'Admin' && user)
            navigate('/');
    }, [user])


    const { setAlert } = useStateProvider();
    const [modal, setModal] = useState(null);
    const [modalDelete, setModalDelete] = useState(null);
    const [modalAddEdit, setModalAddEdit] = useState(false);
    const [selectedUserID, setSelectedUserID] = useState(null);
    const [useri, setUseri] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const [dataNasterii, setDataNasterii] = useState("");

    const [formValue, setFormValue] = useState({
        id: '',
        nume: '',
        prenume: '',
        email: '',
        parola: '',
        departament: '',
        rol: '',
        nume_proiect: '',
        manager: '',
        tara: '',
        oras: '',
        nationalitate: '',
        dataNasterii: '',
    });


    const getUser = (id) => {
        const response = useri.find(obj => obj.id === id);
        setFormValue({
            id: response.id,
            nume: response.nume,
            prenume: response.prenume,
            email: response.email,
            parola: response.parola,
            departament: response.departament,
            rol: response.rol,
            nume_proiect: response.nume_proiect,
            manager: response.manager,
            tara: response.tara,
            oras: response.oras,
            nationalitate: response.nationalitate,
            dataNasterii: response.dataNasterii,
        });
        setDataNasterii(moment(response.dataNasterii, 'YYYY-MM-DD').toDate());

        toggleModalAddEdit();
    };



    const toggleModalDelete = () => {
        setModalDelete(!modalDelete);
    };
    const toggleModalAddEdit = () => {
        setModalAddEdit(!modalAddEdit);
    };

    useEffect(() => {
        fetchUseri();
    }, []);




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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows[0].length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchUseri = async () => {
        try {
            const response = await getAllUsers();
            if (response.status === 200) {
                setUseri(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(useri);

    const transformDate = (e) => {
        return (e.getFullYear() + '-' + ((e.getMonth() + 1) < 10 ? ('0' + String(e.getMonth() + 1)) : (e.getMonth() + 1)) + '-' + ((e.getDate() < 10 ? '0' + String(e.getDate()) : e.getDate())));
    }

    // handleChange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => {
            return { ...prev, [name]: value };
        });
    };

    // check errors
    const checkErrors = (field) => {

        if (field === 'etaj') {
            if (!formValue.etaj)
                return 'Selectarea etajului este obligatorie';
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

    const handleDeleteUser = async () => {
        try {
            const response = await deleteUser(selectedUserID);
            if (response?.status === 200) {
                setAlert({ type: 'success', message: 'Cont eliminat cu succes' });
                setSelectedUserID(null);
                toggleModalDelete();
                fetchUseri();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddEdit = async () => {
        try {
            let resp;
            if (modal === 'add')
                resp = await addUser(formValue);
            if (modal === 'edit')
                resp = await updateUser(formValue);
            if (resp?.status === 200) {
                if (modal === 'add') {

                    setAlert({
                        type: "success",
                        message: "Contul a fost adaugat cu succes",
                    });
                    fetchUseri();
                    toggleModalAddEdit();
                    setModal('');
                }
                if (modal === 'edit') {

                    setAlert({
                        type: "success",
                        message: "Contul a fost modificat cu succes",
                    });
                    fetchUseri();
                    toggleModalAddEdit();
                    setModal('');
                }

            }

        } catch (error) {
            console.log(error);
        }
    }

    const clearForm = () => {
        setFormValue({
            id: '',
            nume: '',
            prenume: '',
            email: '',
            parola: '',
            departament: '',
            rol: '',
            nume_proiect: '',
            manager: '',
            tara: '',
            oras: '',
            nationalitate: '',
            dataNasterii: '',
        });
    }

    return (
        <div className={styles.containerUseri}>
            <div className={styles.useriBody}>
                <Buton variant="tertiary" label='Adaugă' icon={<Add />} className={`${styles.width40} mb-5`} onClick={() => { setModal('add'); clearForm(); toggleModalAddEdit(); }} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                                <StyledTableCell align="center">Nume</StyledTableCell>
                                <StyledTableCell align="center">Parola</StyledTableCell>
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
                                        <Edit style={{ cursor: 'pointer' }} onClick={() => {
                                            // handleDeleteRezervare(row?.id);
                                            setSelectedUserID(row?.id);
                                            getUser(row?.id);
                                            setModal('edit');

                                        }} />
                                        <br />
                                        <br />
                                        <RiDeleteBinFill style={{ cursor: 'pointer' }} onClick={() => {
                                            // handleDeleteRezervare(row?.id);
                                            setSelectedUserID(row?.id);
                                            toggleModalDelete();
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
                                    count={rows[0].length}
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
                                            <MDBBtn size='sm' color='info' onClick={handleDeleteUser}>Șterge</MDBBtn>

                                            <MDBBtn size='sm' color='danger' onClick={() => { toggleModalDelete(); setSelectedUserID(null) }}>Anulează</MDBBtn>
                                        </div>
                                    }

                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )
            }

            {
                modalAddEdit && (
                    <MDBModal show={modalAddEdit} tabIndex='-1' setShow={setModalAddEdit}>
                        <MDBModalDialog size="lg">
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Cont utilizator</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleModalAddEdit}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>

                                    <Col>
                                        <Input
                                            label='Nume'
                                            id="nume"
                                            name='nume'
                                            type='text'
                                            disabled={modal === 'edit' ? true : false}
                                            value={formValue.nume}
                                            placeholder={'Nume'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('nume') ? true : false}
                                            helper={showErrors ? checkErrors('nume') : ''}
                                        />
                                    </Col>

                                    <Col>
                                        <Input
                                            label='Prenume'
                                            id="prenume"
                                            name='prenume'
                                            disabled={modal === 'edit' ? true : false}
                                            type='text'
                                            value={formValue.prenume}
                                            placeholder={'Prenume'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('prenume') ? true : false}
                                            helper={showErrors ? checkErrors('prenume') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Email'
                                            id="email"
                                            name='email'
                                            disabled={modal === 'edit' ? true : false}
                                            type='text'
                                            value={formValue.email}
                                            placeholder={'Email'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('email') ? true : false}
                                            helper={showErrors ? checkErrors('email') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Parola'
                                            id="parola"
                                            name='parola'
                                            type='text'
                                            value={formValue.parola}
                                            placeholder={'Parola'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('parola') ? true : false}
                                            helper={showErrors ? checkErrors('parola') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Departament'
                                            id="departament"
                                            name='departament'
                                            type='text'
                                            value={formValue.departament}
                                            placeholder={'Departament'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('departament') ? true : false}
                                            helper={showErrors ? checkErrors('departament') : ''}
                                        />
                                    </Col>
                                    <Col>

                                        <Input
                                            label='Rol'
                                            id="rol"
                                            name='rol'
                                            type='text'
                                            value={formValue.rol}
                                            placeholder={'Rol'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('rol') ? true : false}
                                            helper={showErrors ? checkErrors('rol') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Proiect'
                                            id="nume_proiect"
                                            name='nume_proiect'
                                            type='text'
                                            value={formValue.nume_proiect}
                                            placeholder={'Proiect'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('nume_proiect') ? true : false}
                                            helper={showErrors ? checkErrors('nume_proiect') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Manager'
                                            id="manager"
                                            name='manager'
                                            type='text'
                                            value={formValue.manager}
                                            placeholder={'Manager'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('manager') ? true : false}
                                            helper={showErrors ? checkErrors('manager') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Tara'
                                            id="tara"
                                            name='tara'
                                            type='text'
                                            value={formValue.tara}
                                            placeholder={'Tara'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('tara') ? true : false}
                                            helper={showErrors ? checkErrors('tara') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Oras'
                                            id="oras"
                                            name='oras'
                                            type='text'
                                            value={formValue.oras}
                                            placeholder={'Oras'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('oras') ? true : false}
                                            helper={showErrors ? checkErrors('oras') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Nationalitate'
                                            id="nationalitate"
                                            name='nationalitate'
                                            type='text'
                                            value={formValue.nationalitate}
                                            placeholder={'Nationalitate'}
                                            onChange={handleChange}
                                            required
                                            error={showErrors && checkErrors('nationalitate') ? true : false}
                                            helper={showErrors ? checkErrors('nationalitate') : ''}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            label='Data nasterii'
                                            id="dataNasterii"
                                            name='dataNasterii'
                                            type='date'
                                            value={formValue.dataNasterii}
                                            onChange={(e) => {
                                                !e.target.valueAsDate ?
                                                    setFormValue({ ...formValue, dataNasterii: '' })
                                                    :
                                                    setFormValue({ ...formValue, dataNasterii: transformDate(e.target.valueAsDate) });
                                                setDataNasterii(transformDate(e.target.valueAsDate));
                                            }}
                                            min={'1930-1-1'}
                                            max={'01-01-2011'}
                                            required
                                            error={showErrors && checkErrors('dataNasterii') ? true : false}
                                            helper={showErrors ? checkErrors('dataNasterii') : ''}
                                        />
                                    </Col>
                                    {/* </Col> */}
                                    {
                                        <div className={styles.buttonsModal}>
                                            <MDBBtn size='sm' color='danger' onClick={handleAddEdit}>Salvează</MDBBtn>

                                            <MDBBtn size='sm' color='info' onClick={() => { toggleModalAddEdit(); setSelectedUserID(null) }}>Anulează</MDBBtn>
                                        </div>
                                    }

                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )
            }

        </div >
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
