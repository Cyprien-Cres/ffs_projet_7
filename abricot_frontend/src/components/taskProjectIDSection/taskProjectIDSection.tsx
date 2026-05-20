"use client"

import {useState} from "react";
import styles from "./taskProjectIDSection.module.css";
import Image from "next/image";
import TaskProjectID from "../taskProjectID/taskProjectID";
import type {Task, TaskStatus} from "@/lib/actions/project";

type StatusFilter = "ALL" | TaskStatus;

type TaskSectionProps = {
    tasks: Task[],
    projectId: string
}

export default function TaskProjectIDSection({tasks, projectId}: TaskSectionProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

    // Filtrer les tâches par titre ET par statut
    const filteredTasks = tasks.filter(task => {
        // Filtre par titre
        const matchesSearch = !search.trim() ||
            task.title.toLowerCase().includes(search.toLowerCase());

        // Filtre par statut
        const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <section className={styles.sectionTask}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>Tâches</h2>
                    <p className={styles.subtitle}>Par ordre de priorité</p>
                </div>
                <div className={styles.actions}>
                    <div className={styles.viewSwitcher}>
                        <button className={`${styles.tabButton} ${styles.active}`}>
                            <Image src={"/icon/list.png"} alt={"Liste icon"} height={16} width={16}/>
                            <p className={styles.actionsP}>Liste</p>
                        </button>
                        <button className={`${styles.tabButton}`}>
                            <Image src={"/icon/date_orange.png"} alt={"Calendrier icon"} height={16} width={16}/>
                            <p className={styles.actionsP}>Calendrier</p>
                        </button>
                    </div>
                    <div className={styles.filters}>
                        <select
                            className={styles.statusFilter}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        >
                            <option value="ALL">Statut</option>
                            <option value="TODO">À faire</option>
                            <option value="IN_PROGRESS">En cours</option>
                            <option value="DONE">Terminée</option>
                        </select>

                        <div className={styles.searchContainer}>
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
                    </div>
                </div>
            </div>
            <TaskProjectID tasks={filteredTasks} projectId={projectId} />
        </section>
    );
}