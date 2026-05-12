"use client"

import { useRef } from "react";
import Modal, { type ModalHandle } from "../modal/modal";
import UserSearchSelect from "@/components/userSearchSelect/userSearchSelect";
import styles from "./modalCreateProject.module.css";

export default function CreateProjectButton() {
    const modalRef = useRef<ModalHandle>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("projectName") as string;
        const description = formData.get("description") as string;
        const contributorsString = formData.get("contributeurs") as string;
        const contributors = contributorsString
            ? contributorsString.split(",").filter(Boolean)
            : [];
    }

    return (
        <>
            <button
                onClick={() => modalRef.current?.open()}
                className={styles.button}
            >
                + Créer un projet
            </button>

            <Modal ref={modalRef} title="Créer un projet">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor="projectName">Titre*</label>
                    <input className={styles.input} id="projectName" name="projectName" type="text" />

                    <label className={styles.label} htmlFor="description">Description*</label>
                    <textarea className={styles.textarea} id="description" name="description" />

                    <label className={styles.label}>Collaborateurs</label>
                    <UserSearchSelect
                        name="contributeurs"
                        placeholder="Choisir un ou plusieurs collaborateurs"
                    />

                    <button className={styles.buttonForm} type="submit">Ajouter un projet</button>
                </form>
            </Modal>
        </>
    );
}