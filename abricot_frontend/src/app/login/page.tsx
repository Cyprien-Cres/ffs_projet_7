import Image from 'next/image'
import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
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
                    <form className={styles.form}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input id="email" type="email" placeholder="" className={styles.input}/>
                        <label htmlFor="password" className={styles.label}>Mot de passe</label>
                        <input type="password" placeholder="" className={styles.input} />
                        <button type="submit" className={styles.button}>Se connecter</button>
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