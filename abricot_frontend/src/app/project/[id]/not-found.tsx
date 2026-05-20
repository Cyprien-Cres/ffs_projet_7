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
                    width={340}
                    height={45}
                    className={styles.logo}
                />
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Page introuvable</h2>
                <p className={styles.text}>
                    Désolé, le projet que vous cherchez n'existe pas.
                </p>
                <Link href="/project" className={styles.button}>
                    Projets
                </Link>
            </main>
        </div>
    );
}