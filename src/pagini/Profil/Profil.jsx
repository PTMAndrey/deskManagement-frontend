import React from 'react'
import { Card } from 'react-bootstrap';
import styles from './Profil.module.scss';

const Istorie = () => {
    return (
        <div className={styles.containerIstorie}>
            <div>
                <h3 className={styles.titluIstorie}>Istorie</h3>
            </div>

            <div className={styles.istorieBody}>
                <Card className={`${styles.cardIstorie} mt-5`}>
                    {/* <Card.Body className={styles.descriereIstorie}> */}
                        <Card.Img variant="top" className={styles.imgIstorie1}  />

                        <Card.Body className={styles.descriere}>
                            <Card.Title className={styles.titluArticol}>Suceava Orașul Cetății de Scaun</Card.Title>

                            <Card.Text className='text-white mt-5'>
                                Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
                            </Card.Text>
                            <Card.Text className='text-white mt-5'>

                                "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...
                            </Card.Text>
                            <Card.Text className='text-white mt-5'>

                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt turpis mi, vel pretium tellus pellentesque vel. Duis in nunc sem. Ut sagittis volutpat magna imperdiet vehicula. Donec placerat, neque quis bibendum tempus, orci ipsum scelerisque nisi, bibendum luctus est ante non eros. Ut a ligula arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                            </Card.Text>
                        {/* </Card.Body> */}
                    </Card.Body>
                </Card>

               

            </div>
        </div >
    )
}

export default Istorie