import styles from "../profile/profile.module.css";
import Header from "@/components/header/header";

export default function ProjectPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header />
            </main>
        </div>
    );
}