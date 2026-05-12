import styles from "./projectCard.module.css";
import { formatDateFr, getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Member } from "@/lib/actions/project";

type ProjectCardProps = {
    id: string,
    name: string,
    description: string,
    ownerName: string,
    membersCount: number,
    members?: Member[],
    totalTasks: number,
    doneTasks: number,
}

export default function ProjectCard({
                                        id,
                                        name,
                                        description,
                                        ownerName,
                                        membersCount,
                                        members = [],
                                        totalTasks,
                                        doneTasks,
                                    }: ProjectCardProps) {

    const otherMembers = members.filter(m => m.role !== "OWNER");

    const progressPercent = totalTasks > 0
        ? Math.round((doneTasks / totalTasks) * 100)
        : 0;

    return (
        <Link href={`/project/${id}`} className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>{name}</h3>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.progressSection}>
                <div className={styles.progressInfo}>
                    <span className={styles.progressLabel}>Progression</span>
                    <span className={styles.progressValue}>{progressPercent}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <span className={styles.progressDetails}>
                    {doneTasks}/{totalTasks} tâches terminées
                </span>
            </div>
            <div className={styles.footer}>
                <div className={styles.members}>
                    <Image src={"/icon/team.png"} alt={"Icon équipe"} width={11.58} height={11} className={styles.membersImg} />
                    <p className={styles.membersText}>Équipe ({membersCount})</p>
                </div>
                <div className={styles.membersList}>
                    <div className={styles.memberItem}>
                        <p className={styles.ownerInitials}>{getInitials(ownerName)}</p>
                        <p className={styles.ownerText}>Propriétaire</p>
                    </div>
                    {otherMembers.map(member => (
                        <div key={member.id} className={styles.memberItem}>
                            <p className={styles.memberInitials}>{getInitials(member.user.name)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
}