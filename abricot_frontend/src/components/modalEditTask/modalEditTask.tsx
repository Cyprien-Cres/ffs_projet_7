"use client"

import { useId, useRef, useState } from "react";
import Modal, { type ModalHandle } from "../modal/modal";
import UserSearchSelect from "@/components/userSearchSelect/userSearchSelect";
import { updateTask, deleteTask } from "@/lib/actions/project";
import type { Task, TaskStatus } from "@/lib/actions/project";
import type { SearchUser } from "@/lib/actions/users";
import styles from "./modalEditTask.module.css";

type EditTaskButtonProps = {
    projectId: string;
    task: Task;
}

export default function EditTaskModal({ projectId, task }: EditTaskButtonProps) {
    const id = useId();
    const modalRef = useRef<ModalHandle>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [status, setStatus] = useState<TaskStatus>(task.status);

    const initialAssignees: SearchUser[] = task.assignees?.map(a => ({
        id: a.user.id,
        email: a.user.email,
        name: a.user.name,
        createdAt: "",
        updatedAt: "",
    })) || [];

    const formatDateForInput = (dateString: string) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const newTitle = (formData.get("title") as string).trim();
        const newDescription = (formData.get("description") as string).trim();
        const newDueDate = formData.get("dueDate") as string;
        const assigneesString = formData.get("assignees") as string;
        const newAssigneeIds = assigneesString
            ? assigneesString.split(",").filter(Boolean)
            : [];

        const changes: {
            title?: string;
            description?: string;
            dueDate?: string;
            status?: TaskStatus;
            assigneeIds?: string[];
        } = {};

        if (newTitle && newTitle !== task.title) {
            changes.title = newTitle;
        }

        if (newDescription !== task.description) {
            changes.description = newDescription;
        }

        if (newDueDate) {
            const newDueDateISO = new Date(newDueDate).toISOString();
            if (newDueDateISO !== task.dueDate) {
                changes.dueDate = newDueDateISO;
            }
        }

        if (status !== task.status) {
            changes.status = status;
        }

        const currentAssigneeIds = initialAssignees.map(a => a.id).sort();
        const newAssigneeIdsSorted = [...newAssigneeIds].sort();
        if (JSON.stringify(currentAssigneeIds) !== JSON.stringify(newAssigneeIdsSorted)) {
            changes.assigneeIds = newAssigneeIds;
        }

        if (Object.keys(changes).length === 0) {
            setLoading(false);
            modalRef.current?.close();
            return;
        }

        const result = await updateTask(projectId, task.id, changes);

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        modalRef.current?.close();
    }

    async function handleDelete() {
        setError("");
        setDeleting(true);

        const result = await deleteTask(projectId, task.id);

        if (result.error) {
            setError(result.error);
            setDeleting(false);
            return;
        }

        setDeleting(false);
        modalRef.current?.close();
    }

    return (
        <div>
            <button
                onClick={() => modalRef.current?.open()}
                className={styles.button}
                aria-label={`Modifier la tâche : ${task.title}`}
            >
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
            </button>

            <Modal ref={modalRef} title="Modifier">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor={`${id}-title`}>Titre*</label>
                    <input
                        className={styles.input}
                        id={`${id}-title`}
                        name="title"
                        type="text"
                        defaultValue={task.title}
                        required
                    />

                    <label className={styles.label} htmlFor={`${id}-description`}>Description</label>
                    <textarea
                        className={styles.textarea}
                        id={`${id}-description`}
                        name="description"
                        defaultValue={task.description}
                    />

                    <label className={styles.label} htmlFor={`${id}-dueDate`}>Échéance</label>
                    <input
                        className={styles.input}
                        id={`${id}-dueDate`}
                        name="dueDate"
                        type="date"
                        defaultValue={formatDateForInput(task.dueDate)}
                    />

                    <label className={styles.label} htmlFor={`${id}-assignees`}>Assigner à</label>
                    <UserSearchSelect
                        name="assignees"
                        placeholder="Assigner un ou plusieurs collaborateurs"
                        valueField="id"
                        initialSelected={initialAssignees}
                    />

                    <label className={styles.label}>Statut</label>
                    <div className={styles.statusGroup}>
                        <button
                            type="button"
                            className={`${styles.statusButton} ${styles.status_TODO} ${status === "TODO" ? styles.activeTODO : ""}`}
                            onClick={() => setStatus("TODO")}
                        >
                            À faire
                        </button>
                        <button
                            type="button"
                            className={`${styles.statusButton} ${styles.status_IN_PROGRESS} ${status === "IN_PROGRESS" ? styles.activeINPROGRESS : ""}`}
                            onClick={() => setStatus("IN_PROGRESS")}
                        >
                            En cours
                        </button>
                        <button
                            type="button"
                            className={`${styles.statusButton} ${styles.status_DONE} ${status === "DONE" ? styles.activeDONE : ""}`}
                            onClick={() => setStatus("DONE")}
                        >
                            Terminée
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        className={styles.buttonForm}
                        type="submit"
                        disabled={loading || deleting}
                    >
                        {loading ? "Modification..." : "Enregistrer les modifications"}
                    </button>
                </form>

                <div className={styles.dangerZone}>
                    {!confirmDelete ? (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className={styles.deleteButton}
                            disabled={loading || deleting}
                        >
                            Supprimer
                        </button>
                    ) : (
                        <div className={styles.confirmDelete}>
                            <p className={styles.confirmText}>
                                Êtes-vous sûr ? Cette action est irréversible.
                            </p>
                            <div className={styles.confirmButtons}>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className={styles.cancelButton}
                                    disabled={deleting}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className={styles.confirmDeleteButton}
                                    disabled={deleting}
                                >
                                    {deleting ? "Suppression..." : "Confirmer"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}