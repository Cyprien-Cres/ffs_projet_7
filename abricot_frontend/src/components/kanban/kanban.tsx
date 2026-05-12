import styles from "./kanban.module.css";
import Task from "@/components/task/task";
import { getAssignedTasks, getProjectsWithTasks, type Task as TaskType } from "@/lib/actions/dashboard";

export default async function Kanban() {
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

    const projectsMap = new Map(
        projectsResult.data.map(p => [p.id, p.name])
    );

    const todoTasks = tasksResult.data.filter(task => task.status === "TODO");
    const inProgressTasks = tasksResult.data.filter(task => task.status === "IN_PROGRESS");
    const doneTasks = tasksResult.data.filter(task => task.status === "DONE");

    const renderColumn = (tasks: TaskType[], title: string, columnClass: string) => (
        <div className={`${styles.column} ${columnClass}`}>
            <div className={styles.columnHeader}>
                <h2 className={styles.columnTitle}>{title}</h2>
                <span className={styles.count}>{tasks.length}</span>
            </div>
            <div className={styles.taskList}>
                {tasks.map(task => (
                    <Task
                        key={task.id}
                        taskId={task.id}
                        projectId={task.projectId}
                        title={task.title}
                        description={task.description}
                        projectName={projectsMap.get(task.projectId) || "Projet inconnu"}
                        dueDate={task.dueDate}
                        commentsCount={task.comments.length}
                        status={task.status}
                        priority={task.priority}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.kanban}>
            {renderColumn(todoTasks, "À faire", styles.todoColumn)}
            {renderColumn(inProgressTasks, "En cours", styles.inProgressColumn)}
            {renderColumn(doneTasks, "Terminées", styles.doneColumn)}
        </div>
    );
}