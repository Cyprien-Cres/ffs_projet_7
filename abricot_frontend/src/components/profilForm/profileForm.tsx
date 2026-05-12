"use client"

import { useState } from "react";
import styles from "./profileForm.module.css";
import { updateProfile, updatePassword } from "@/lib/actions/profile";

type ProfileFormProps = {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ProfileForm({ firstName, lastName, email }: ProfileFormProps) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const initialName = `${firstName} ${lastName}`.trim();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);
        const newFirstName = (formData.get("firstName") as string).trim();
        const newLastName = (formData.get("lastName") as string).trim();
        const newEmail = (formData.get("email") as string).trim();
        const currentPassword = (formData.get("currentPassword") as string).trim();
        const newPassword = (formData.get("newPassword") as string).trim();

        const newName = `${newFirstName} ${newLastName}`.trim();

        // Détecter les changements de profil
        const profileChanges: { name?: string; email?: string } = {};
        if (newName !== initialName) profileChanges.name = newName;
        if (newEmail !== email) profileChanges.email = newEmail;

        const hasProfileChanges = Object.keys(profileChanges).length > 0;
        const hasPasswordChange = currentPassword.length > 0 && newPassword.length > 0;

        // Si rien n'a changé, on ne fait rien
        if (!hasProfileChanges && !hasPasswordChange) {
            return;
        }

        setLoading(true);

        // Update profil
        if (hasProfileChanges) {
            const result = await updateProfile(profileChanges);
            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }
        }

        // Update password
        if (hasPasswordChange) {
            const result = await updatePassword(currentPassword, newPassword);
            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }
        }

        setSuccess("Informations mises à jour avec succès");
        setLoading(false);

        // Reset les champs password
        (document.getElementById("currentPassword") as HTMLInputElement).value = "";
        (document.getElementById("newPassword") as HTMLInputElement).value = "";
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="firstName" className={styles.label}>Prénom</label>
            <input
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={firstName}
                className={styles.input}
            />

            <label htmlFor="lastName" className={styles.label}>Nom</label>
            <input
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={lastName}
                className={styles.input}
            />

            <label htmlFor="email" className={styles.label}>Email</label>
            <input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                className={styles.input}
            />

            <label htmlFor="currentPassword" className={styles.label}>Mot de passe actuel</label>
            <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="●●●●●●●●●●●"
                className={styles.input}
            />

            <label htmlFor="newPassword" className={styles.label}>Nouveau mot de passe</label>
            <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="●●●●●●●●●●●"
                className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
                {loading ? "Enregistrement..." : "Modifier les informations"}
            </button>
        </form>
    );
}