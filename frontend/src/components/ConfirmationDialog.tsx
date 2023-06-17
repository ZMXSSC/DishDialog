import React, {useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";

interface ConfirmationDialogProps {
    show: boolean,
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void,
}

const ConfirmationDialog = ({show, title, message, onConfirm, onCancel}: ConfirmationDialogProps) => {
    const [countdown, setCountdown] = useState(2);
    const [enableConfirm, setEnableConfirm] = useState(false);

    // when the modal is shown, start a countdown
    useEffect(() => {
        if (show) {
            setEnableConfirm(false);
            setCountdown(2);
            const intervalId = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown === 1) {
                        clearInterval(intervalId);
                        setEnableConfirm(true);
                        return 0;
                    } else {
                        return prevCountdown - 1;
                    }
                });
            }, 1000);
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={!enableConfirm}>
                    Confirm <b>{countdown !== 0 ? `(${countdown})` : ""}</b>
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationDialog;
