import React, { useCallback, useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import styles from './Profil.module.scss';
import ListGroup from 'react-bootstrap/ListGroup';
import useAuth from '../../hooks/useAuth';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { ReactComponent as Add } from '../../assets/icons/add.svg';
import { RiDeleteBinFill } from 'react-icons/ri';
import { useDropzone } from 'react-dropzone';

import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';
import { updateUserPoza } from '../../api/API';
import useStateProvider from '../../hooks/useStateProvider';

const Profil = () => {

    const { user } = useAuth();
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
                file: null, //prevState.file.filter((imagine, i) => i !== index),
            };
        });
        setFileInForm((prevState) => {
            return {
                file: null,// prevState.file.filter((imagine, i) => i !== index),
            };
        });

        setFormValue((prevState) => {
            return {
                ...prevState,
                imaginiURL: null, //  prevState.imaginiURL.filter((image, i) => i !== index),
            };
        });

    };

    console.log('form:' , formValue);
    console.log('\n\n');
    console.log('file: ', file);

    const handleUpdatePhoto = async () => {
        try {

            var FormData = require('form-data');
            var data = new FormData();
            // formValue.file ?
            //     formValue?.file.map((img, i) => {
            //         data.append('file', img);
            //     }) : data.append('file', null)
            console.log(formValue);
            console.log('\n\n');
            console.log(file);
            formValue.file && data.append('file', formValue?.file);
            const response = await updateUserPoza(user.id, data);
            if (response?.status === 200) {
                toggleModal();
                setAlert({ type: 'success', message: 'Poza a fost actualizata cu succes!' });
            }
            else{
                setAlert({ type: 'danger', message: 'Eroare la actualizarea pozei de profil' });
            }

        } catch (error) {
            console.log(error);
        }
    }


    const toggleModal = () => {
        setModal(!modal);
    };


    return (
        <div className={styles.containerProfil}>
            <div>
                {/* <div className={styles.previzualizarePoza}>
                    <img src={user?.imagine} alt="" />
                    <RiDeleteBinFill onClick={() => {
                        handleDelete(1);
                    }} />
                </div> */}

                {/* dropzone */}
            </div>
            <div className={styles.profilBody}>

                <Card style={{ display: 'flex', flexDirection: width < 550 ? 'column' : 'row' }}>
                    <div>
                        <Card.Img src={user?.imagine} className={styles.imgProfile} />
                        <p type='button' onClick={() => toggleModal()}>Change photo</p>
                    </div>

                    <Card.Body>
                        <Card.Title><b>{user?.nume} {user?.prenume}</b></Card.Title>
                        <Card.Text>
                            {user?.email}
                        </Card.Text>
                        {console.log(user)}
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item><b>Rol</b> <br /> {user?.rol}</ListGroup.Item>
                            {user?.nume_proiect && <ListGroup.Item><b>Proiect</b><br />{user?.nume_proiect}</ListGroup.Item>}
                            {user?.manager && <ListGroup.Item><b>Manager proiect</b><br /> {user?.manager}</ListGroup.Item>}
                            <ListGroup.Item><b>Departament</b> <br /> {user?.departament}</ListGroup.Item>
                        </ListGroup>
                        <Card.Link href="#">Card Link</Card.Link>
                        <Card.Link href="#">Another Link</Card.Link>
                    </Card.Body>
                </Card>



            </div>


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
                                        <div className='d-flex justify-content-space-between align-items-center'>
                                            <MDBBtn color='danger' onClick={() => { handleUpdatePhoto(); toggleModal() }}>Actualizează</MDBBtn>

                                            <MDBBtn color='info' onClick={() => { toggleModal(); handleDelete() }}>Anulează</MDBBtn>
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