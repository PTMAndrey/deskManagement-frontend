import React, { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Group, Image } from "react-konva";
import { Html } from 'react-konva-utils';
import { v4 as uuidv4 } from "uuid";
import useImage from 'use-image';
import { Col, Row } from 'react-bootstrap';
import { addBirouri, getBirouriPeEtaj, updateBirouri } from '../../api/API';
import Buton from '../Buton/Buton'
import Popup from '../Popup/Popup';
import Dropdown from '../Dropdown/Dropdown';
import Img from "../Image/Image";
import useAuth from '../../hooks/useAuth';
import Etaj from './Etaj3';
import pc from "../../assets/icons/pc.svg";
import pcRezervat from '../../assets/icons/pcRezervat.svg';
import styles from './BirouriEtaj.module.scss';
import { CiUndo } from 'react-icons/ci';
import { birou1, birou2, birou3, birou4, birou5, birou6 } from './coordonatesBiouri';

import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';
import BookDesk from '../BookDesk/BookDesk';
import useStateProvider from '../../hooks/useStateProvider';
import { useNavigate } from 'react-router-dom';

const BirouriEtaj = ({ rolComponenta }) => {

    const { user } = useAuth();
    const [etaj, setEtaj] = useState({ value: 1, label: 'Etajul 1' });

    const etaje = [];
    for (let i = 1; i < 6; i++) {
        etaje.push({ value: i, label: `Etajul ${i}` },);
    }

    const { setAlert } = useStateProvider();
    const [ZIndex, setZIndex] = useState(10);
    const [modal, setModal] = useState(false);
    const [deskID, setDeskID] = useState(null);
    const [editBirou, setEditBirou] = useState(false);
    const [addBirou, setAddBirou] = useState(false);
    const navigate = useNavigate();

    const [openPopup, setOpenPopup] = useState(false);
    const togglePopup = () => {
        setOpenPopup(!openPopup);
    };


    const dragUrl = useRef();
    const stageRef = useRef();
    const [birouri, setBirouri] = useState([]);
    let id = uuidv4();

    const toggleModal = () => {
        setModal(!modal);
    };


    useEffect(() => {
        fetchBirouri();
    }, [])


    useEffect(() => {
        fetchBirouri();
    }, [etaj])


    const fetchBirouri = async () => {
        try {
            const response = await getBirouriPeEtaj(etaj.value);
            if (response.status === 200) {
                console.log(response.data);
                const birouriNoi = response.data.map((birou, index) => {
                    const isDeskReserved = birou.reservari.some(
                        (rezervare) =>
                            rezervare?.idBirou === birou?.id && rezervare?.idPersoana === user?.id
                    );
                    console.log(isDeskReserved);
                    const src = isDeskReserved ? pcRezervat : pc;
                    console.log(src);

                    return {
                        etaj: birou.etaj,
                        id: birou.id,
                        src:src,
                        x: birou.coordX,
                        y: birou.coordY,
                        camera: birou.camera,
                        rezervari: birou.reservari,
                    };
                });

                response.data.map((birou, index) =>
                    stageRef.current.setPointersPositions({
                        x: birou.coordX,
                        y: birou.coordY,
                    })
                );
                setBirouri(birouriNoi);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function isPointInPolygon(point, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
            if (inside)
                break;
        }

        return inside;
    }

    const [addToUpdateBirouri, setAddToUpdateBirouri] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        // register event position
        stageRef.current.setPointersPositions(e);
        console.log(stageRef.current.getPointerPosition());

        const point = stageRef.current.getPointerPosition();

        // add image
        setBirouri([
            ...birouri,
            {
                etaj: etaj.value,
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
                id,
                camera: isPointInPolygon(point, birou1) ? 1 : isPointInPolygon(point, birou2) ? 2 : isPointInPolygon(point, birou3) ? 3 : isPointInPolygon(point, birou4) ? 4 : isPointInPolygon(point, birou5) ? 5 : isPointInPolygon(point, birou6) ? 6 : 0
            }
        ]);
        if (birouri.length > 0) {
            setAddToUpdateBirouri([
                ...addToUpdateBirouri,
                {
                    etaj: etaj.value,
                    ...stageRef.current.getPointerPosition(),
                    src: dragUrl.current,
                    id,
                    camera: isPointInPolygon(point, birou1) ? 1 : isPointInPolygon(point, birou2) ? 2 : isPointInPolygon(point, birou3) ? 3 : isPointInPolygon(point, birou4) ? 4 : isPointInPolygon(point, birou5) ? 5 : isPointInPolygon(point, birou6) ? 6 : 0
                }
            ]);
        }

    };

    const dragHandle = (e) => {

        console.log(typeof (e.target.x()));

        const point = { x: e.target.x(), y: e.target.y() };
        console.log(point);
        setBirouri(
            birouri.map((img) => {
                if (img.id === e.target.attrs.id) {
                    return {
                        ...img, x: e.target.x(), y: e.target.y(),
                        camera: isPointInPolygon(point, birou1) ? 1 : isPointInPolygon(point, birou2) ? 2 : isPointInPolygon(point, birou3) ? 3 : isPointInPolygon(point, birou4) ? 4 : isPointInPolygon(point, birou5) ? 5 : isPointInPolygon(point, birou6) ? 6 : 0
                    };
                }

                return img;
            })
        );
    };


    const handleSaveBirouriAdmin = async () => {
        try {
            let promises;
            if (addToUpdateBirouri.length > 0)
                promises = addToUpdateBirouri.map(birou => addBirouri(etaj.value, birou.camera, birou.x, birou.y));
            else
                promises = birouri.map(birou => addBirouri(etaj.value, birou.camera, birou.x, birou.y));

            try {
                // Wait for all promises to resolve
                await Promise.all(promises);
                setEditBirou(false);
                setAlert({ type: 'success', message: 'Birouri adaugate cu succes!' });
                setEditBirou(false);
                setAddBirou(false);
                window.location.reload(false);
            } catch (err) {
                // Handle errors here
                console.error('An error occurred:', err);
                setAlert({ type: 'danger', message: 'Eroare la adaugarea birourilor' });
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleUpdateBirouriAdmin = async () => {
        try {
            const updatedBirouri = birouri.map(birou => ({
                ...birou,
                coordX: birou.x,
                coordY: birou.y,
                x: undefined,
                y: undefined
            }));

            console.log(birouri, '\n', updatedBirouri);
            const response = await updateBirouri(updatedBirouri)
            try {
                setEditBirou(false);
                setAlert({ type: 'success', message: 'Birouri actualizate cu succes!' });
                setEditBirou(false);
                setAddBirou(false);
            } catch (err) {
                // Handle errors here
                console.error('An error occurred:', err);
                setAlert({ type: 'danger', message: 'Eroare la editarea birourilor' });
            }
        } catch (e) {
            console.log(e)
        }
    }



    const handleStergeBirouriAdmin = () => {
        if (birouri.length > 0) {
            console.log(deskID);
            if (!deskID) {
                setBirouri(birouri.slice(0, -1));
            } else {
                setBirouri(birouri.filter(item => item.id !== deskID));
                setDeskID(null);
            }
            togglePopup();
        }
    }
    const handleEditBirouri = () => {
        setEditBirou(true)
        setAddBirou(false);
    }

    const handleAddBirouri = () => {
        setEditBirou(false);
        setAddBirou(true);
    }

    const handleCancel = () => {
        setEditBirou(false);
        setAddBirou(false);
        fetchBirouri();
    }
    return (
        <div >
            {rolComponenta === 'admin' && editBirou === false &&
                <Row className={styles.actionButtonsAdmin}>
                    <Col>
                        <Buton variant="tertiary" className={`mt-4 mb-4 rounded-pill  ${styles.width40}`} label='Edit' onClick={handleEditBirouri} />
                    </Col>
                    <Col>
                        <Buton variant="tertiary" className={`mt-4 mb-4 rounded-pill  ${styles.width40}`} label='Add' onClick={handleAddBirouri} />
                    </Col>

                </Row>
            }
            <Row className={styles.actionButtonsAdmin}>
                <Col>
                    <Dropdown
                        className={`mt-4 mb-4 ${styles.width40}`}
                        name='etaj'
                        title={etaj.label}
                        value={etaj.value}
                        options={etaje}
                        onChange={(e) => {
                            setEtaj({ value: e.value, label: e.label });
                        }}
                    />
                </Col>

                {rolComponenta === 'admin' && (editBirou === true || addBirou === true) &&
                    <>
                        {editBirou === true ?
                            <Col>
                                <Buton variant="tertiary" className={`mt-5 mb-5 rounded-pill `} label={'Actualizează'} onClick={handleUpdateBirouriAdmin} />
                            </Col>
                            :
                            <Col>
                                <Buton variant="tertiary" className={`mt-5 mb-5 rounded-pill `} label={'Salvează'} onClick={handleSaveBirouriAdmin} />
                            </Col>
                        }
                        <Col>
                            <Buton variant="destructive" className={`mt-5 mb-5 rounded-pill `} label='Anuleaza' onClick={handleCancel} />
                        </Col>
                    </>
                }
            </Row>
            <div
                onDrop={rolComponenta === 'admin' ? handleDrop : null}
                onDragOver={(e) => e.preventDefault()}
                className={styles.addBirou}
            >
                {rolComponenta === 'admin' && (editBirou === true || addBirou === true) ?
                    <>
                        {/* admin interface */}
                        {addBirou === true &&
                            <ul className={styles.optiuni}>
                                <li>
                                    <h4>Birou</h4>
                                    <img
                                        alt={"pc"}
                                        src={pc}
                                        style={{ cursor: 'pointer' }}
                                        width="30"
                                        draggable="true"
                                        onDragStart={(e) => {
                                            dragUrl.current = e.target.src;
                                            console.log(e.target.src)
                                        }}
                                    />
                                </li>
                                {addBirou === false ?
                                    <li style={{ marginTop: '70px' }}></li>
                                    :
                                    <li >
                                        <h4>Sterge ultimul birou</h4>
                                        <CiUndo style={{ cursor: birouri.length !== 0 ? 'pointer' : ' not-allowed' }} onClick={() => birouri.length !== 0 && togglePopup()} />
                                    </li>
                                }
                            </ul>
                        }
                        <Stage
                            width={976}
                            height={558}
                            ref={stageRef}
                        >
                            <Layer>
                                <Group
                                    x={-12}
                                    y={-16}
                                    onMouseEnter={e => {
                                        e.target.getStage().container().style.cursor = "grab"
                                    }}
                                    onDragStart={e => {
                                        e.target.getStage().container().style.cursor = "grab"
                                    }}
                                    onMouseLeave={e => {
                                        const container = e.target.getStage().container();
                                        container.style.cursor = "default";
                                    }}>
                                    <Html
                                        divProps={{
                                            style: {
                                                zIndex: -ZIndex
                                            },
                                        }}
                                    >
                                        <Etaj />

                                    </Html>

                                    {birouri.map((image, i) => {
                                        return (
                                            <Img
                                                style={{
                                                    zIndex: 125,
                                                }}
                                                image={image}
                                                key={i}
                                                onDragEnd={dragHandle}
                                                id={image.id}
                                                isDraggable={'true'}
                                                className={styles.itemOnClick}
                                                onClick={(e) => { console.log("ASASA", e.target.attrs.id); togglePopup(); setDeskID(e.target.attrs.id) }}
                                            />
                                        );
                                    })}
                                </Group>
                            </Layer>
                        </Stage>
                    </>

                    :
                    // user interface 
                    <Stage
                        width={1035}
                        height={558}
                        ref={stageRef}
                    >
                        <Layer>
                            <Group
                                x={0}
                                y={0}
                                onMouseEnter={e => {
                                    e.target.getStage().container().style.cursor = "pointer"
                                }}
                                onDragStart={e => {
                                    e.target.getStage().container().style.cursor = "pointer"
                                }}
                                onMouseLeave={e => {
                                    const container = e.target.getStage().container();
                                    container.style.cursor = "default";
                                }}
                            >

                                <Html
                                    divProps={{
                                        style: {
                                            zIndex: -ZIndex
                                        },
                                    }}
                                >
                                    <Etaj />

                                </Html>

                                {birouri.map((image, i) => {
                                    return (
                                        <Img
                                            style={{
                                                zIndex: 125,
                                            }}
                                            image={image}
                                            key={i}
                                            id={image.id}
                                            className={styles.itemOnClick}
                                            isDraggable={'false'}
                                            onClick={(e) => { console.log('PL', e.target.id); toggleModal(); setDeskID(e.target.attrs.id) }}
                                        />

                                    );
                                })}
                            </Group>
                        </Layer>
                    </Stage>
                }

            </div>
            {
                openPopup && (
                    <Popup
                        setOpenPopup={setOpenPopup}
                        openPopup={openPopup}
                        content={
                            <div className={styles.popup}>
                                <h3 className={styles.titlePopup}>Șterge birou</h3>
                                <p className={styles.descriptionPopup}>
                                    Această acțiune este permanentă și nu poate fi anulată.
                                </p>
                                <div className={styles.butonsPopup}>
                                    <button
                                        className={styles.backPopup}
                                        onClick={() => handleStergeBirouriAdmin()}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        className={styles.deletePopup}
                                        onClick={() => { togglePopup(); setDeskID(null) }}
                                    >
                                        Renunț
                                    </button>
                                </div>
                            </div>
                        }
                    />
                )
            }

            {
                modal && (
                    <MDBModal show={modal} tabIndex='-1' setShow={setModal}>
                        <MDBModalDialog size="lg">
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Rezerva birou</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>
                                    <BookDesk fetchBirouri={fetchBirouri} rol='rezervareBirou' idEtaj={etaj.value} idBirou={deskID} toggleModal={toggleModal} />

                                </MDBModalBody>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                )
            }

        </div >
    );
};

export default BirouriEtaj;