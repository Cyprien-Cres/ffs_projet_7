"use client"

import { useId, useRef, useState } from "react";
import Modal, { type ModalHandle } from "../modal/modal";
import UserSearchSelect from "@/components/userSearchSelect/userSearchSelect";
import { createTask } from "@/lib/actions/project";
import styles from "./modalCreateTask.module.css";

type CreateTaskButtonProps = {
    projectId: string;
}

export default function CreateTaskModal({ projectId }: CreateTaskButtonProps) {
    const id = useId();
    const modalRef = useRef<ModalHandle>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = (formData.get("title") as string).trim();
        const description = (formData.get("description") as string).trim();
        const dueDate = formData.get("dueDate") as string;
        const assigneesString = formData.get("assignees") as string;
        const assigneeIds = assigneesString
            ? assigneesString.split(",").filter(Boolean)
            : [];

        if (!title) {
            setError("Le titre est requis");
            setLoading(false);
            return;
        }

        if (!description) {
            setError("La description est requise");
            setLoading(false);
            return;
        }

        if (!dueDate) {
            setError("La date d'échéance est requise");
            setLoading(false);
            return;
        }

        const dueDateISO = new Date(dueDate).toISOString();

        const result = await createTask(projectId, {
            title,
            description,
            dueDate: dueDateISO,
            assigneeIds,
        });

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
                onClick={() => modalRef.current?.open()}
                className={styles.button}
            >
                Créer une tâche
            </button>

            <Modal ref={modalRef} title="Créer une tâche">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor={`${id}-title`}>Titre*</label>
                    <input
                        className={styles.input}
                        id={`${id}-title`}
                        name="title"
                        type="text"
                        required
                    />

                    <label className={styles.label} htmlFor={`${id}-description`}>Description*</label>
                    <textarea
                        className={styles.textarea}
                        id={`${id}-description`}
                        name="description"
                        required
                    />

                    <label className={styles.label} htmlFor={`${id}-dueDate`}>Échéance*</label>
                    <input
                        className={styles.input}
                        id={`${id}-dueDate`}
                        name="dueDate"
                        type="date"
                        required
                    />

                    <label className={styles.label} htmlFor={`${id}-assignees`}>Assigner à</label>
                    <UserSearchSelect
                        name="assignees"
                        placeholder="Assigner un ou plusieurs collaborateurs"
                        valueField="id"
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        className={styles.buttonForm}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Création..." : "Créer la tâche"}
                    </button>
                </form>
            </Modal>
        </>
    );
}