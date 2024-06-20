import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

type ConfirmMessageProps = {
    message: string;
    onConfirm: () => void;
    isShow: boolean;
    onHide: () => void;

}

function ConfirmMessage({ message, onConfirm, isShow, onHide }: ConfirmMessageProps) {

    const [show, setShow] = useState(false);

    const handleClose = () => {
        onHide();
        setShow(false);
    }


    const handleConfirm = () => {
        onConfirm();
        setShow(false);
    };

    return (
        <>
            <Modal show={isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button style={{ color: "#000", backgroundColor: "#c8b6b7ab", border: "none", outline: "none" }} variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button style={{ color: "#fff", backgroundColor: "#d4383b", border: "none", outline: "none" }} onClick={handleConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmMessage