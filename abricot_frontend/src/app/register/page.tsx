import Image from 'next/image'
import styles from "./register.module.css";
import Link from "next/link";

export default function RegisterPage() {
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
                    <form className={styles.form}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input id="email" type="email" placeholder="" className={styles.input}/>
                        <label htmlFor="password" className={styles.label}>Mot de passe</label>
                        <input type="password" placeholder="" className={styles.input} />
                        <button type="submit" className={styles.button}>Se connecter</button>
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