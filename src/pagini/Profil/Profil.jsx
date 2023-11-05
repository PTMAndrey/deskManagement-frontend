import React, { useCallback, useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import styles from './Profil.module.scss';
import ListGroup from 'react-bootstrap/ListGroup';
import useAuth from '../../hooks/useAuth';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { ReactComponent as Add } from '../../assets/icons/add.svg';
import { RiDeleteBinFill } from 'react-icons/ri';
import { useDropzone } from 'react-dropzone';

import { styled } from '@mui/material/styles';
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


import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';
import { deleteRezervareByID, getRezervariByUserID, updateUserPoza } from '../../api/API';
import useStateProvider from '../../hooks/useStateProvider';
import { useTheme } from '@emotion/react';
import moment from 'moment';
import 'moment/locale/ro';

const Profil = () => {

    const { user, userID, fetchUser } = useAuth();
    const { setAlert } = useStateProvider();
    const { width } = useWindowDimensions();

    const [modal, setModal] = useState(false);

    const [file, setFile] = useState({ file: user?.imagine });
    const [fileInForm, setFileInForm] = useState({ file: [] });
    const [formValue, setFormValue] = useState({
        imagini: user?.imagine,
        imaginiURL: user?.imagine,
        file: [],
    });

    useEffect(() => {
        formValue.file = fileInForm.file;
    }, [fileInForm])

    // handleDrop
    const handleDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) =>
            setFileInForm((prevState) => {
                return {
                    ...prevState,
                    file: file,
                }
            })
        )

        acceptedFiles.map((file) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                setFile((prevState) => {
                    return {
                        ...prevState,
                        file: e.target.result,
                    };
                });
            };
            reader.readAsDataURL(file);
            return file;
        });

    }, []);
    // handleDelete imagine
    const handleDelete = (index) => {
        setFile((prevState) => {
            return {
                file: null,
            };
        });
        setFileInForm((prevState) => {
            return {
                file: null,
            };
        });

        setFormValue((prevState) => {
            return {
                ...prevState,
                imaginiURL: null,
            };
        });

    };
    const handleUpdatePhoto = async () => {
        try {
            var FormData = require('form-data');
            var data = new FormData();
            formValue.file && data.append('file', formValue?.file);
            const response = await updateUserPoza(user.id, data);
            if (response?.status === 200) {
                toggleModal();
                setAlert({ type: 'success', message: 'Poza a fost actualizata cu succes!' });
                fetchUser();
            }
            else {
                setAlert({ type: 'danger', message: 'Eroare la actualizarea pozei de profil' });
            }

        } catch (error) {
            console.log(error);
        }
    }

    const toggleModal = () => {
        setModal(!modal);
    };

    const [rezervariProfil, setRezervariProfil] = useState(null);
    useEffect(() => {
        fetchRezervari();
    }, [user]);

    const fetchRezervari = async () => {
        try {
            console.log(user);
            const id = userID;
            const response = await getRezervariByUserID(id);
            if (response.status === 200) {
                setRezervariProfil(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function createData(id, etaj, camera, data, oraInceput, oraFinal) {
        return { id, etaj, camera, data, oraInceput, oraFinal };
    }
    const rows = [
        rezervariProfil?.map((rez) => {
            return (
                createData(rez.id, rez.etaj, rez.camera, rez.data, rez.oraInceput, rez.oraFinal))
        }
        )
    ].sort((a, b) => (a.etaj < b.etaj ? -1 : 1));


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

    const handleDeleteRezervare = async (idRez) => {
        try {
            const response = await deleteRezervareByID(idRez);
            if (response.status === 200) {

                setRezervariProfil(rezervariProfil.filter(item => item.id !== idRez));
                setAlert({
                    type: "success",
                    message: "Rezervare eliminata cu succes!",
                });
                fetchRezervari();
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className={styles.containerProfil}>
            <div className={styles.profilBody}>
                <Card className={styles.cardProfil}>
                    <div className={styles.imageZone}>
                        <Card.Img src={user?.imagine} className={styles.imgProfile} />
                        <p type='button' onClick={() => toggleModal()}>Change photo</p>
                    </div>

                    <Card.Body>
                        <Card.Title><h2><b>{user?.nume} {user?.prenume}</b></h2></Card.Title>
                        <Card.Text>
                            {user?.email}
                        </Card.Text>
                        <ListGroup className={` ${styles.cardList} list-group-flush`}>
                            <ListGroup.Item className={styles.cardList}>
                                <b>Rol</b> <br />
                                <span className={styles.profileList}>{user?.rol}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className={styles.cardList}>
                                <b>Proiect</b> <br />
                                <span className={styles.profileList}>{user?.nume_proiect}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className={styles.cardList}>
                                <b>Manager proiect</b> <br />
                                <span className={styles.profileList}>{user?.manager}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className={styles.cardList}>
                                <b>Departament</b> <br />
                                <span className={styles.profileList}>{user?.departament}</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
                {rezervariProfil?.length  &&
                    <Col className={styles.profilRezervari}>
                        <Row>
                            <h3>Rezervările mele</h3>
                        </Row>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Nr. crt.</StyledTableCell>
                                        <StyledTableCell align="center">Etaj</StyledTableCell>
                                        <StyledTableCell align="center">Camera</StyledTableCell>
                                        <StyledTableCell align="center">Data</StyledTableCell>
                                        <StyledTableCell align="center">Ora de inceput</StyledTableCell>
                                        <StyledTableCell align="center">Ora incheiere</StyledTableCell>
                                        <StyledTableCell align="center">Actiune</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? rows[0]?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rows[0]
                                    )?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" style={{ width: 160 }} align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {row?.etaj}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {row?.camera}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {moment(row?.data, 'YYYY-MM-DD').format('DD MMMM YYYY')}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {row?.oraInceput}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                {row?.oraFinal}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="center">
                                                <RiDeleteBinFill style={{cursor:'pointer'}} onClick={() => {
                                                    handleDeleteRezervare(row?.id);
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
                    </Col>
                }


            </div >


            {
                modal && (
                    <MDBModal show={modal} tabIndex='-1' setShow={setModal}>
                        <MDBModalDialog size="lg">
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Schimba poza profil</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>
                                    <p>Adaugă poza</p>
                                    <Dropzone onDrop={handleDrop} />

                                    {file?.file &&
                                        <div className={styles.previzualizarePoza}>
                                            <img src={file?.file} alt="" />
                                            <RiDeleteBinFill onClick={() => {
                                                handleDelete(1);
                                            }} />
                                        </div>
                                    }
                                    {file?.file && <>
                                        <div className={styles.buttonsModal}>
                                            <MDBBtn size='sm' color='danger' onClick={() => { handleUpdatePhoto(); toggleModal() }}>Actualizează</MDBBtn>

                                            <MDBBtn size='sm' color='info' onClick={() => { toggleModal(); handleDelete() }}>Anulează</MDBBtn>
                                        </div>
                                    </>}

                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )
            }
        </div >
    )
}

export default Profil;


function Dropzone({ onDrop, accept, open, error, helper }) {
    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject,
        isDragActive,
    } = useDropzone({
        accept: {
            'image/png': [],
            'image/jpg': [],
            'image/jpeg': [],
            'image/bmp': [],
        },
        maxFiles: 1,
        onDrop,
    });

    const [isHovered, setHovered] = useState(false);
    return (
        <div
            onMouseLeave={() => setHovered(false)}
            onMouseOver={() => setHovered(true)}
        >
            <div
                {...getRootProps({
                    className: `${styles.dropzone} 
            ${isDragAccept && styles.accept} 
            ${isDragReject && styles.reject}
            ${error && styles.error}
            `,
                })}
            >
                <input {...getInputProps()} />
                <div>
                    {isDragActive ? (
                        isDragReject ? (
                            <p>File not supported</p>
                        ) : (
                            <p>Release here</p>
                        )
                    ) : isHovered ? (
                        <p>Drag and drop or click</p>
                    ) : (
                        <Add />
                    )}
                </div>

            </div>
            <p className={error ? styles.helperErr : null}>{helper}</p>
        </div>
    );
}


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
