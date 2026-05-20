"use client"

import { useId, useRef, useState } from "react";
import Modal, { type ModalHandle } from "../modal/modal";
import { createComment } from "@/lib/actions/project";
import styles from "./modalCreateComment.module.css";

type CreateCommentModalProps = {
    projectId: string;
    taskId: string;
}

export default function CreateCommentModal({ projectId, taskId }: CreateCommentModalProps) {
    const id = useId();
    const modalRef = useRef<ModalHandle>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const content = (formData.get("content") as string).trim();

        if (!content) {
            setError("Le commentaire ne peut pas être vide");
            setLoading(false);
            return;
        }

        const result = await createComment(projectId, taskId, { content });

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        modalRef.current?.close();
        (e.target as HTMLFormElement).reset();
    }

    return (
        <>
            <button
                type="button"
                onClick={() => modalRef.current?.open()}
                className={styles.button}
            >
                + Ajouter un commentaire
            </button>

            <Modal ref={modalRef} title="Ajouter un commentaire">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor={`${id}-content`}>
                        Votre commentaire*
                    </label>
                    <textarea
                        className={styles.textarea}
                        id={`${id}-content`}
                        name="content"
                        placeholder="Écrivez votre commentaire..."
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        className={styles.buttonForm}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Publication..." : "Publier"}
                    </button>
                </form>
            </Modal>
        </>
    );
}