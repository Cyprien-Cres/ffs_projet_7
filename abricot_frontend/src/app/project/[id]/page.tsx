import styles from "./projectDetail.module.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getProfile } from "@/lib/actions/profile";
import { getProject, getProjectTasks } from "@/lib/actions/project";
import { getInitials } from "@/lib/utils";
import EditProjectModal from "@/components/modalEditProject/modalEditProject";
import Link from "next/link";
import CreateTaskModal from "@/components/modalCreateTask/modalCreateTask";
import TaskProjectIDSection from "../../../components/taskProjectIDSection/taskProjectIDSection";
import Image from "next/image";
import {notFound} from "next/navigation";

type ProjectDetailPageProps = {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = await params;

    const [profileResult, projectResult, tasksResult] = await Promise.all([
        getProfile(),
        getProject(id),
        getProjectTasks(id),
    ]);

    if (profileResult.error || !profileResult.data) {
        return <div>Erreur : {profileResult.error}</div>;
    }
    if (projectResult.error || !projectResult.data) {
        notFound();
    }
    if (tasksResult.error || !tasksResult.data) {
        return <div>Erreur : {tasksResult.error}</div>;
    }

    const user = profileResult.data;
    const project = projectResult.data;
    const tasks = tasksResult.data;

    const otherMembers = project.members.filter(m => m.role !== "OWNER");

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header name={user.name} />
                <div className={styles.content}>
                    <div className={styles.projectHeader}>
                        <div className={styles.projectInfo}>
                            <Link href="/project" className={styles.backLink}>
                                <Image src={"/icon/arrowDetailProject.png"} alt={"Flêche retour page projets"} width={15} height={7}/>
                            </Link>
                            <div className={styles.projectTitleSection}>
                                <div className={styles.projectTitleContainer}>
                                    <h1 className={styles.title}>{project.name}</h1>
                                    {user.id === project.ownerId && (
                                        <EditProjectModal
                                            projectId={project.id}
                                            currentName={project.name}
                                            currentDescription={project.description}
                                            currentMembers={project.members}
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className={styles.description}>{project.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.projectActions}>
                            <CreateTaskModal projectId={project.id} />
                        </div>
                    </div>

                    <section className={styles.sectionContributors}>
                        <div className={styles.sectionContributorsHeader}>
                            <h2 className={styles.sectionContributorsTitle}>Contributeurs</h2>
                            <p className={styles.sectionContributorsText}>{project.members.length + 1} personnes</p>
                        </div>
                        <div className={styles.membersList}>
                            <div className={styles.memberCard}>
                                <p className={styles.ownerInitials}>{getInitials(project.owner.name)}</p>
                                <p className={styles.memberRole}>Propriétaire</p>
                            </div>
                            {otherMembers.map(member => (
                                <div key={member.id} className={styles.memberCard}>
                                    <p className={styles.memberInitials}>{getInitials(member.user.name)}</p>
                                    <p className={styles.memberName}>{member.user.name}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <TaskProjectIDSection tasks={tasks} projectId={project.id} />
                </div>
                <Footer />
            </main>
        </div>
    );
}