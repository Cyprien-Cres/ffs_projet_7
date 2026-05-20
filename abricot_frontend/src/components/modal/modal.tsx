"use client"

import { ReactNode, useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./modal.module.css";
import Image from "next/image";

export type ModalHandle = {
    open: () => void;
    close: () => void;
}

type ModalProps = {
    children: ReactNode;
    title?: ReactNode;
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
                        <Image src={"/icon/close_orange.png"} alt={"Fermeture de la modale"} width={13.33} height={13.33}/>
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