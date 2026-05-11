import styles from "./dashboard.module.css";
import Header from "@/components/header/header";

export default function DashboardPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header />
            </main>
        </div>
    );
}