import React, { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Group, Image } from "react-konva";
import { Html } from 'react-konva-utils';
import { v4 as uuidv4 } from "uuid";
import useImage from 'use-image';
import { Col } from 'react-bootstrap';
import { addBirouri, getBirouriPeEtaj } from '../../api/API';
import Buton from '../Buton/Buton'
import Popup from '../Popup/Popup';
import Dropdown from '../Dropdown/Dropdown';
import Img from "../Image/Image";
import useAuth from '../../hooks/useAuth';
import Etaj from './Etaj';
import pc from "../../assets/icons/pc.svg";
import styles from './BirouriEtaj.module.scss';
import { CiUndo } from 'react-icons/ci';

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

const BirouriEtaj = ({ rolComponenta }) => {
    const { user } = useAuth();
    const [etaj, setEtaj] = useState({ value: 1, label: 'Etajul 1' });

    const etaje = [];
    for (let i = 1; i < 6; i++) {
        etaje.push({ value: i, label: `Etajul ${i}` },);
    }

    const [ZIndex, setZIndex] = useState(10);
    const [modal, setModal] = useState(false);
    const [counter, setCounter] = useState(0);
    const [deskID, setDeskID] = useState(null);

    const [openPopup, setOpenPopup] = useState(false);
    const togglePopup = () => {
        setOpenPopup(!openPopup);
    };


    const dragUrl = useRef();
    const stageRef = useRef();
    const [images, setImages] = useState([]);
    let id = uuidv4();

    const toggleModal = () => {
        setModal(!modal);
    };


    useEffect(() => {
        if (rolComponenta === 'rezervaBirou') {
            fetchBirouri();
        }
    }, [etaj])

    const fetchBirouri = async () => {
        try {
            const response = await getBirouriPeEtaj(etaj.value);
            if (response.status === 200) {
                console.log(response.data);
                // response.data.map((birou, index) => {
                //     setImages([...images, { id: birou.id, counter: Number(String(birou.numar).slice(0, -1)), src: "http://localhost:3000/static/media/pc.55f98d641c464c430c2ad803d1ea18da.svg", x: birou.coordX, y: birou.coordY }])

                //     stageRef.current.setPointersPositions({x: birou.coordX, y: birou.coordY})
                // })
                const newImages = response.data.map((birou, index) => ({
                    id: birou.id,
                    counter: Number(String(birou.numar).slice(0, -1)),
                    src: "http://localhost:3000/static/media/pc.55f98d641c464c430c2ad803d1ea18da.svg",
                    x: birou.coordX,
                    y: birou.coordY
                }));
                response.data.map((birou, index) => stageRef.current.setPointersPositions({ x: birou.coordX, y: birou.coordY }));

                setImages(newImages);

                setCounter(response.data.length);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleDrop = (e) => {
        e.preventDefault();
        // register event position
        stageRef.current.setPointersPositions(e);
        console.log(stageRef.current.getPointerPosition());
        // add image
        setImages([
            ...images,
            {
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
                id,
                counter: counter * Math.pow(10, etaj.value) + etaj.value, // last digit is etaj
            }
        ]);
    };
    console.log(user);

    useEffect(() => {
        console.log(images);
        console.log(counter);
    }, [images])

    const dragHandle = (e) => {
        //? Updated cordinates based on ID from image

        console.log(typeof (e.target.x()));
        setImages(
            images.map((img) => {
                if (img.id === e.target.attrs.id) {
                    return { ...img, x: e.target.x(), y: e.target.y() };
                }

                return img;
            })
        );
    };


    const handleSaveBirouriAdmin = async () => {
        try {
            // if (!isFormValid()) {
            //     setShowErrors(true);
            //     setAlert({ type: 'danger', message: 'Câmpurile trebuie completate!' });
            // }
            // if (isFormValid()) {
            //     setShowErrors(false);
            const promises = images.map(image => addBirouri(etaj.value, image.counter, image.x, image.y));

            try {
                // Wait for all promises to resolve
                await Promise.all(promises);
                console.log('All data successfully added.');
            } catch (err) {
                // Handle errors here
                console.error('An error occurred:', err);
            }
            // })

            // }
        } catch (e) {
            console.log(e)
        }
    }

    const handleStergeBirouriAdmin = () => {
        if (counter > 0) {
            console.log(deskID);
            if (!deskID) {
                setImages(images.slice(0, -1));
            } else {
                setImages(images.filter(item => item.id !== deskID));
                setDeskID(null);
            }
            togglePopup();
            setCounter(counter - 1);
        }
    }


    return (
        <div >

            {rolComponenta === 'adaugaBirou' &&
                <Col style={{ width: '20% !important' }}>
                    <Buton variant="tertiary" className='mt-4 mb-4 rounded-pill' label='Salveaza' onClick={handleSaveBirouriAdmin} />
                </Col>
            }

            <Col>
                <p className={styles.label}>Etaj</p>
                <Dropdown
                    className='mt-4'
                    name='etaj'
                    title={etaj.label}
                    options={etaje}
                    onChange={(e) => {
                        // setFormValue({ ...formValue, etaj: e.value })
                        setEtaj({ value: e.value, label: e.label });
                    }}
                // error={showErrors && checkErrors('etaj') ? true : false}
                // helper={showErrors ? checkErrors('etaj') : ''}
                />
            </Col>
            <div
                onDrop={rolComponenta === 'adaugaBirou' ? handleDrop : null}
                onDragOver={(e) => e.preventDefault()}
                className={styles.addBirou}
            >
                {rolComponenta === 'adaugaBirou' ?
                    <>
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
                                        setCounter(counter + 1);
                                    }}
                                />
                            </li>
                            <li>
                                <h4>Sterge ultimul birou</h4>
                                <CiUndo style={{ cursor: images.length !== 0 ? 'pointer' : ' not-allowed' }} onClick={() => images.length !== 0 && togglePopup()} />
                            </li>
                        </ul>
                        <Stage
                            width={1035}
                            height={558}
                            ref={stageRef}
                        >
                            <Layer>
                                <Group
                                    x={0}
                                    y={-15}
                                    onMouseEnter={e => {
                                        e.target.getStage().container().style.cursor = "grab"
                                    }}
                                    onDragStart={e => {
                                        e.target.getStage().container().style.cursor = "grab"
                                    }}
                                    onMouseLeave={e => {
                                        const container = e.target.getStage().container();
                                        container.style.cursor = "default";
                                    }}
                                // tot: -60 -15
                                // b1: -60 -15
                                // b2: 
                                >
                                    {/* <Rect
                                
                                fill={"rgba(255, 255, 255, 0.9)"}
                                stroke={"gray"}
                                strokeWidth={5}
                                lineJoin="bevel"
                            /> */}
                                    {/* <BGImage width={800}
                                height={500}
                                className={styles.itemOnClick} /> */}
                                    <Html
                                        divProps={{
                                            style: {
                                                zIndex: -ZIndex
                                            },
                                        }}
                                    >
                                        <Etaj />

                                    </Html>

                                    {images.map((image, i) => {
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

                                {images.map((image, i) => {
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

            {modal && (
                <MDBModal show={modal} tabIndex='-1' setShow={setModal}>
                <MDBModalDialog size="lg">
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Rezerva birou</MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody className='d-flex flex-direction-column'>
                        <BookDesk rol='rezervareBirou' idEtaj={etaj.value} idBirou = {deskID} toggleModal={toggleModal}/>

                    </MDBModalBody>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            )}

        </div >
    );
};

export default BirouriEtaj;