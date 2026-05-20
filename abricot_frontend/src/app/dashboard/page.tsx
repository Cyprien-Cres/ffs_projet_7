import styles from "./dashboard.module.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getProfile } from "@/lib/actions/profile";
import { getAssignedTasks, getProjectsWithTasks } from "@/lib/actions/dashboard";
import CreateProjectModal from "@/components/modaleCreateProject/modalCreateProject";
import ViewSwitcher from "@/components/viewSwitcher/viewSwitcher";
import List from "@/components/list/list";
import Kanban from "@/components/kanban/kanban";

export default async function DashboardPage() {
    const [profileResult, tasksResult, projectsResult] = await Promise.all([
        getProfile(),
        getAssignedTasks(),
        getProjectsWithTasks(),
    ]);

    if (profileResult.error || !profileResult.data) {
        return <div>Erreur : {profileResult.error}</div>;
    }
    if (tasksResult.error || !tasksResult.data) {
        return <div>Erreur : {tasksResult.error}</div>;
    }
    if (projectsResult.error || !projectsResult.data) {
        return <div>Erreur : {projectsResult.error}</div>;
    }

    const user = profileResult.data;
    const tasks = tasksResult.data;
    const projectsMap = new Map(
        projectsResult.data.map(p => [p.id, p.name])
    );

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
                        <CreateProjectModal />
                    </div>
                    <ViewSwitcher
                        listView={<List />}
                        kanbanView={<Kanban tasks={tasks} projectsMap={projectsMap} />}
                    />
                </div>
                <Footer />
            </main>
        </div>
    );
}