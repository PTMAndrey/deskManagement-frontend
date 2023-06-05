import React from 'react'
import styles from './Popup.module.scss'

const Popup = ({ content, openPopup, setOpenPopup }) => {
    return (
        <div className={styles.popupbox} onClick={(e) => { e.stopPropagation();}}>
            <div className={styles.box} onClick={(e) => { e.stopPropagation() }}>
                {content}
            </div>
        </div>
    )
}

export default Popup