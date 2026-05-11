"use client"

import Image from 'next/image'
import styles from "./register.module.css";
import Link from "next/link";
import { register } from "./action";
import { useState } from "react";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emptyName, setEmptyName] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setEmptyName(false);
        setEmptyEmail(false);
        setEmptyPassword(false);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name) {
            setError("Le nom est requis");
            setEmptyName(true);
            setLoading(false);
            return;
        }

        if (!email) {
            setError("L'email est requis");
            setEmptyEmail(true);
            setLoading(false);
            return;
        }

        if (!password) {
            setError("Le mot de passe est requis");
            setEmptyPassword(true);
            setLoading(false);
            return;
        }

        const result = await register(email, password, name);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.leftPart}>
                    <Image
                        src="/logos/logo_orange.png"
                        alt="Logo"
                        width={252.57}
                        height={32.17}
                        className={styles.logo}
                    />
                    <h1 className={styles.h1}>Inscription</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor="name" className={styles.label}>Nom</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder=""
                            className={`${styles.input} ${emptyName ? styles.error : ""}`}
                        />
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder=""
                            className={`${styles.input} ${emptyEmail ? styles.error : ""}`}
                        />
                        <label htmlFor="password" className={styles.label}>Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder=""
                            className={`${styles.input} ${emptyPassword ? styles.error : ""}`}
                        />
                        {error && <p className={styles.p}>{error}</p>}
                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? "Inscription en cours..." : "S'inscrire"}
                        </button>
                    </form>
                    <div className={styles.register}>
                        <span className={styles.span}>Déjà inscrit ?</span>
                        <Link href="/login" className={styles.link}>Se connecter</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}