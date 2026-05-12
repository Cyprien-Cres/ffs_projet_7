import styles from "./dashboard.module.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getProfile } from "@/lib/actions/profile";
import CreateProjectButton from "@/components/modaleCreateProject/modalCreateProject";
import ViewSwitcher from "@/components/viewSwitcher/viewSwitcher";
import List from "@/components/list/list";
import Kanban from "@/components/kanban/kanban";

export default async function DashboardPage() {
    const { data: user, error } = await getProfile();

    if (error || !user) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header name={user.name} />
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.welcome}>
                            <h1 className={styles.title}>Tableau de bord</h1>
                            <p className={styles.p}>Bonjour {user.name}, voici un aperçu de vos projets et tâches</p>
                        </div>
                        <CreateProjectButton />
                    </div>
                    <ViewSwitcher
                        listView={<List />}
                        kanbanView={<Kanban />}
                    />
                </div>
                <Footer />
            </main>
        </div>
    );
}