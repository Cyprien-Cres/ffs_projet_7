import styles from "./list.module.css";
import FilteredTaskList from "@/components/filteredTaskList/filteredTaskList";
import { getAssignedTasks, getProjectsWithTasks } from "@/lib/actions/dashboard";

export default async function List() {
    const [tasksResult, projectsResult] = await Promise.all([
        getAssignedTasks(),
        getProjectsWithTasks(),
    ]);

    if (tasksResult.error || !tasksResult.data) {
        return <div>Erreur : {tasksResult.error}</div>;
    }

    if (projectsResult.error || !projectsResult.data) {
        return <div>Erreur : {projectsResult.error}</div>;
    }

    const projectsMap = Object.fromEntries(
        projectsResult.data.map(p => [p.id, p.name])
    );

    const tasks = tasksResult.data;

    if (tasks.length === 0) {
        return (
            <div className={styles.empty}>
                <p>Aucune tâche assignée pour le moment.</p>
            </div>
        );
    }

    return <FilteredTaskList tasks={tasks} projectsMap={projectsMap} />;
}