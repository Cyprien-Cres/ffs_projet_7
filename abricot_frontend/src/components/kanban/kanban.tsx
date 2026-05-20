"use client"

import { useRef, useState, useEffect } from "react";  // ← ajouter useEffect
import styles from "./kanban.module.css";
import TaskDashboard from "../taskDashboard/taskDashboard";
import type { Task as TaskType } from "@/lib/actions/dashboard";

type KanbanProps = {
    tasks: TaskType[];
    projectsMap: Map<string, string>;
}

export default function Kanban({ tasks, projectsMap }: KanbanProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // 🎯 Au montage, on force le scroll à 0 pour reset le carrousel
    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.scrollLeft = 0;
        }
    }, []);

    const todoTasks = tasks.filter(task => task.status === "TODO");
    const inProgressTasks = tasks.filter(task => task.status === "IN_PROGRESS");
    const doneTasks = tasks.filter(task => task.status === "DONE");

    // Aller à une colonne spécifique avec les boutons
    const goToColumn = (index: number) => {
        if (!wrapperRef.current) return;
        const columnWidth = wrapperRef.current.offsetWidth;
        wrapperRef.current.scrollTo({
            left: columnWidth * index,
            behavior: "smooth"
        });
        setActiveIndex(index);
    };

    const renderColumn = (tasksList: TaskType[], title: string, columnClass: string) => (
        <div className={`${styles.column} ${columnClass}`}>
            <div className={styles.columnHeader}>
                <h2 className={styles.columnTitle}>{title}</h2>
                <span className={styles.count}>{tasksList.length}</span>
            </div>
            <div className={styles.taskList}>
                {tasksList.map(task => (
                    <TaskDashboard
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
        <div className={styles.kanbanContainer}>
            <div
                ref={wrapperRef}
                className={styles.kanban}
            >
                {renderColumn(todoTasks, "À faire", styles.todoColumn)}
                {renderColumn(inProgressTasks, "En cours", styles.inProgressColumn)}
                {renderColumn(doneTasks, "Terminées", styles.doneColumn)}
            </div>

            {/* Contrôles du carrousel (visibles uniquement en mobile/tablette) */}
            <div className={styles.carouselControls}>
                <button
                    type="button"
                    onClick={() => goToColumn(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className={styles.carouselButton}
                    aria-label="Colonne précédente"
                >
                    ←
                </button>

                <div className={styles.dots}>
                    {[0, 1, 2].map(index => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => goToColumn(index)}
                            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
                            aria-label={`Aller à la colonne ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => goToColumn(activeIndex + 1)}
                    disabled={activeIndex === 2}
                    className={styles.carouselButton}
                    aria-label="Colonne suivante"
                >
                    →
                </button>
            </div>
        </div>
    );
}