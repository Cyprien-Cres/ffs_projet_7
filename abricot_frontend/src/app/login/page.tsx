"use client"

import Image from 'next/image'
import styles from "./login.module.css";
import Link from "next/link";
import { login } from "./action";
import {useEffect, useState} from "react";
import { redirect } from "next/navigation";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);

    useEffect(() => {
        const hasToken = document.cookie.includes("token=");
        if (hasToken) {
            redirect("/dashboard");
        }
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setEmptyEmail(false);
        setEmptyPassword(false);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

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

        const result = await login(email, password);

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
                    <h1 className={styles.h1}>Connexion</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
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
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </button>
                    </form>
                    <Link href="/forgot-password" className={styles.link}>Mot de passe oublié?</Link>
                    <div className={styles.register}>
                        <span className={styles.span}>Pas encore de compte ?</span>
                        <Link href="/register" className={styles.link}>S'inscrire</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}