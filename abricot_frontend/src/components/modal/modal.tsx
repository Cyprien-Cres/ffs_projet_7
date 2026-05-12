"use client"

import { ReactNode, useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./modal.module.css";

export type ModalHandle = {
    open: () => void;
    close: () => void;
}

type ModalProps = {
    children: ReactNode;
    title?: string;
}

const Modal = forwardRef<ModalHandle, ModalProps>(({ children, title }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
            dialogRef.current?.close();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            onClick={handleBackdropClick}
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() => dialogRef.current?.close()}
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                    {title && <h2 className={styles.title}>{title}</h2>}
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </dialog>
    );
});

Modal.displayName = "Modal";

export default Modal;