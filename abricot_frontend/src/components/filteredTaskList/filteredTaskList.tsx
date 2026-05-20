"use client"

import { useState } from "react";
import styles from "./filteredTaskList.module.css";
import type { Task as TaskType } from "@/lib/actions/dashboard";
import TaskDashboard from "../taskDashboard/taskDashboard";

type FilteredTaskListProps = {
    tasks: TaskType[];
    projectsMap: Record<string, string>;
}

export default function FilteredTaskList({ tasks, projectsMap }: FilteredTaskListProps) {
    const [search, setSearch] = useState("");

    // Filtrer les tâches en fonction de la recherche
    const filteredTasks = tasks.filter(task => {
        if (!search.trim()) return true; // Pas de filtre si recherche vide

        const searchLower = search.toLowerCase();
        const projectName = projectsMap[task.projectId] || "";

        return (
            task.title.toLowerCase().includes(searchLower) ||
            projectName.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className={styles.list}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h2 className={styles.secondTitle}>Mes tâches assignées</h2>
                    <p className={styles.titleP}>Par ordre de priorité</p>
                </div>
                <label htmlFor="filterTask" className="sr-only">
                    Rechercher une tâche
                </label>
                <input
                    type="text"
                    id="filterTask"
                    name="filterTask"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher une tâche"
                    className={styles.searchInput}
                />
            </div>

            {filteredTasks.length === 0 ? (
                <div className={styles.empty}>
                    <p>Aucune tâche trouvée pour "{search}"</p>
                </div>
            ) : (
                <div className={styles.task}>
                    {filteredTasks.map(task => (
                        <TaskDashboard
                            key={task.id}
                            taskId={task.id}
                            projectId={task.projectId}
                            title={task.title}
                            description={task.description}
                            projectName={projectsMap[task.projectId] || "Projet inconnu"}
                            dueDate={task.dueDate}
                            commentsCount={task.comments.length}
                            status={task.status}
                            priority={task.priority}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}