import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Image
                    src="/logos/logo_orange.png"
                    alt="Logo"
                    width={252}
                    height={32}
                    className={styles.logo}
                />
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Page introuvable</h2>
                <p className={styles.text}>
                    Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
                </p>
                <Link href="/dashboard" className={styles.button}>
                    Tableau de bord
                </Link>
            </main>
        </div>
    );
}