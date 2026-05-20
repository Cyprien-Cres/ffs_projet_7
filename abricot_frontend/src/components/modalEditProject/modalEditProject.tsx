"use client"

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal, { type ModalHandle } from "../modal/modal";
import UserSearchSelect from "@/components/userSearchSelect/userSearchSelect";
import {
    updateProject,
    addContributor,
    removeContributor,
    deleteProject,
} from "@/lib/actions/project";
import type { Member } from "@/lib/actions/project";
import type { SearchUser } from "@/lib/actions/users";
import styles from "./modalEditProject.module.css";

type EditProjectButtonProps = {
    projectId: string;
    currentName: string;
    currentDescription: string;
    currentMembers: Member[];
}

export default function EditProjectModal({
                                              projectId,
                                              currentName,
                                              currentDescription,
                                              currentMembers,
                                          }: EditProjectButtonProps) {
    const id = useId();
    const modalRef = useRef<ModalHandle>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const router = useRouter();

    const initialContributors: SearchUser[] = currentMembers
        .filter(m => m.role !== "OWNER")
        .map(m => ({
            id: m.user.id,
            email: m.user.email,
            name: m.user.name,
            createdAt: m.user.createdAt,
            updatedAt: m.user.updatedAt,
        }));

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const newName = (formData.get("name") as string).trim();
        const newDescription = (formData.get("description") as string).trim();
        const contributorsString = formData.get("contributeurs") as string;
        const newContributorsEmails = contributorsString
            ? contributorsString.split(",").filter(Boolean)
            : [];

        const projectChanges: { name?: string; description?: string } = {};
        if (newName && newName !== currentName) projectChanges.name = newName;
        if (newDescription && newDescription !== currentDescription) {
            projectChanges.description = newDescription;
        }

        const currentEmails = initialContributors.map(c => c.email);
        const toAdd = newContributorsEmails.filter(email => !currentEmails.includes(email));
        const toRemove = initialContributors.filter(
            c => !newContributorsEmails.includes(c.email)
        );

        if (Object.keys(projectChanges).length === 0 && toAdd.length === 0 && toRemove.length === 0) {
            setLoading(false);
            modalRef.current?.close();
            return;
        }

        if (Object.keys(projectChanges).length > 0) {
            const result = await updateProject(projectId, projectChanges);
            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }
        }

        for (const email of toAdd) {
            const result = await addContributor(projectId, email);
            if (result.error) {
                setError(`Erreur lors de l'ajout de ${email} : ${result.error}`);
                setLoading(false);
                return;
            }
        }

        for (const member of toRemove) {
            const result = await removeContributor(projectId, member.id);
            if (result.error) {
                setError(`Erreur lors de la suppression de ${member.name} : ${result.error}`);
                setLoading(false);
                return;
            }
        }

        setLoading(false);
        modalRef.current?.close();
    }

    async function handleDelete() {
        setError("");
        setDeleting(true);

        const result = await deleteProject(projectId);

        if (result.error) {
            setError(result.error);
            setDeleting(false);
            return;
        }

        modalRef.current?.close();
        router.push("/project");
    }

    return (
        <>
            <button
                onClick={() => modalRef.current?.open()}
                className={styles.button}
            >
                Modifier
            </button>

            <Modal ref={modalRef} title="Modifier un projet">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor={`${id}-name`}>Titre*</label>
                    <input
                        className={styles.input}
                        id={`${id}-name`}
                        name="name"
                        type="text"
                        defaultValue={currentName}
                        required
                    />

                    <label className={styles.label} htmlFor={`${id}-description`}>Description*</label>
                    <textarea
                        className={styles.textarea}
                        id={`${id}-description`}
                        name="description"
                        defaultValue={currentDescription}
                        required
                    />

                    <label className={styles.label} htmlFor={`${id}-contributeurs`}>Collaborateurs</label>
                    <UserSearchSelect
                        name="contributeurs"
                        placeholder="Ajouter un collaborateur"
                        initialSelected={initialContributors}
                        valueField="email"
                    />

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
        </>
    );
}