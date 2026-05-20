"use client"

import { useState } from "react";
import styles from "./taskProjectID.module.css";
import { formatDateFr, getInitials } from "@/lib/utils";
import Image from "next/image";
import type { Task } from "@/lib/actions/project";
import EditTaskModal from "@/components/modalEditTask/modalEditTask";
import CreateCommentModal from "@/components/modalCreateComment/modalCreateComment";

type TaskListProps = {
    projectId: string;
    tasks: Task[];
}

export default function TaskProjectID({ tasks, projectId }: TaskListProps) {
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

    const toggleComments = (taskId: string) => {
        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.status === "DONE" && b.status !== "DONE") return 1;
        if (a.status !== "DONE" && b.status === "DONE") return -1;
        return 0;
    });

    return (
        <div className={styles.tasksList}>
            {sortedTasks.map(task => {
                const isExpanded = expandedTasks.has(task.id);
                const commentsCount = task.comments?.length || 0;

                return (
                    <div key={task.id} className={styles.taskCard}>
                        <div className={styles.taskHeaderContainer}>
                            <div className={styles.taskHeader}>
                                <div className={styles.taskTitleContainer}>
                                    <h3 className={styles.taskTitle}>{task.title}</h3>
                                    <span className={`${styles.badge} ${styles[`status_${task.status}`]}`}>
                                        {task.status === "TODO" && "À faire"}
                                        {task.status === "IN_PROGRESS" && "En cours"}
                                        {task.status === "DONE" && "Terminée"}
                                    </span>
                                </div>
                                <p className={styles.taskDescription}>{task.description}</p>
                            </div>
                            <EditTaskModal projectId={projectId} task={task} />
                        </div>

                        <div className={styles.taskDate}>
                            Échéance :
                            <Image
                                src={"/icon/dateBlack.png"}
                                alt={"Date d'échéance"}
                                width={15}
                                height={16.54}
                                className={styles.dateIcon}
                            />
                            <p className={styles.taskDateText}>{formatDateFr(task.dueDate)}</p>
                        </div>

                        {task.assignees && task.assignees.length > 0 && (
                            <div className={styles.assignees}>
                                <span className={styles.assigneesLabel}>Assigné à :</span>
                                <div className={styles.assigneesList}>
                                    {task.assignees.map(assignee => (
                                        <div key={assignee.id} className={styles.assignee}>
                                            <span className={styles.initials}>
                                                {getInitials(assignee.user.name)}
                                            </span>
                                            <span className={styles.name}>
                                                {assignee.user.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <span className={styles.line}></span>

                        <button onClick={() => toggleComments(task.id)} className={styles.commentsToggle}>
                            Commentaire{commentsCount > 1 ? "s" : ""} ({commentsCount})
                            <Image
                                src={isExpanded ? "/icon/arrowUp.svg" : "/icon/arrowDown.svg"}
                                alt={isExpanded ? "Replier" : "Déplier"}
                                width={16}
                                height={8}
                                className={styles.toggleIcon}
                            />
                        </button>

                        {isExpanded && (
                            <div className={styles.commentsSection}>
                                {commentsCount === 0 ? (
                                    <p className={styles.noComments}>Aucun commentaire pour le moment</p>
                                ) : (
                                    <div className={styles.commentsList}>
                                        {task.comments.map(comment => (
                                            <div key={comment.id} className={styles.comment}>
                                                <div className={styles.commentHeader}>
                                                    <span className={styles.commentAuthor}>
                                                        {comment.author.name} :
                                                    </span>
                                                    <span className={styles.commentDate}>
                                                        <Image
                                                            src={"/icon/dateBlack.png"}
                                                            alt={"Date d'échéance"}
                                                            width={15}
                                                            height={16.54}
                                                            className={styles.dateIcon}
                                                        />
                                                        {formatDateFr(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p className={styles.commentContent}>
                                                    {comment.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <CreateCommentModal projectId={projectId} taskId={task.id} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}