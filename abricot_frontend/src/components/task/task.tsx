import styles from "./task.module.css";
import type { TaskStatus, TaskPriority } from "@/lib/actions/dashboard";
import { formatDateFr } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type TaskProps = {
    taskId: string;
    projectId: string;
    title: string;
    description: string;
    projectName: string;
    dueDate: string;
    commentsCount: number;
    status: TaskStatus;
    priority: TaskPriority;
}

export default function Task({
                                 taskId,
                                 title,
                                 projectId,
                                 description,
                                 projectName,
                                 dueDate,
                                 commentsCount,
                                 status,
                             }: TaskProps) {

    const statusLabels: Record<TaskStatus, string> = {
        TODO: "À faire",
        IN_PROGRESS: "En cours",
        DONE: "Terminée",
    };

    return (
        <div className={styles.task} data-task-id={taskId}>
            <div className={styles.left}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>
                <div className={styles.info}>
                    <div className={styles.div}>
                        <Image src={"/icon/project.png"} alt={"Projet"} width={18} height={13.96} />
                        <p className={styles.p}>{projectName}</p>
                    </div>
                    <div className={styles.bar}></div>
                    <div className={styles.div}>
                        <Image src={"/icon/date.png"} alt={"Date"} width={15} height={16.54} />
                        <p className={styles.p}>{formatDateFr(dueDate)}</p>
                    </div>
                    <div className={styles.bar}></div>
                    <div className={styles.div}>
                        <Image src={"/icon/comment.png"} alt={"Commentaires"} width={15} height={15} />
                        <p className={styles.p}>{commentsCount}</p>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <span className={`${styles.badge} ${styles[`status_${status}`]}`}>
                    {statusLabels[status]}
                </span>
                <Link href={`/project/${projectId}`} className={styles.link}>
                    Voir
                </Link>
            </div>
        </div>
    );
}