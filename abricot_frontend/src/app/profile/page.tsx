import styles from "./profile.module.css";
import Header from "@/components/header/header";

export default function ProfilePage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header />
            </main>
        </div>
    );
}