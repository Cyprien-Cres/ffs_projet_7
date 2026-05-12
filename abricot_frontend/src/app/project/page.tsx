import styles from "./project.module.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getProfile } from "@/lib/actions/profile";
import { getProjects, getProjectTasks } from "@/lib/actions/project";
import CreateProjectButton from "@/components/modaleCreateProject/modalCreateProject";
import ProjectCard from "@/components/projectCard/projectCard";

export default async function ProjectPage() {
    const [profileResult, projectsResult] = await Promise.all([
        getProfile(),
        getProjects(),
    ]);

    if (profileResult.error || !profileResult.data) {
        return <div>Erreur : {profileResult.error}</div>;
    }

    if (projectsResult.error || !projectsResult.data) {
        return <div>Erreur : {projectsResult.error}</div>;
    }

    const user = profileResult.data;
    const projects = projectsResult.data;

    const tasksResults = await Promise.all(
        projects.map(project => getProjectTasks(project.id))
    );

    const projectsWithProgress = projects.map((project, index) => {
        const tasks = tasksResults[index].data || [];
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.status === "DONE").length;

        return {
            ...project,
            totalTasks,
            doneTasks,
        };
    });

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header name={user.name} />
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.welcome}>
                            <h1 className={styles.title}>Mes projets</h1>
                            <p className={styles.p}>Gérez vos projets</p>
                        </div>
                        <CreateProjectButton />
                    </div>

                    <div className={styles.projectsList}>
                        {projectsWithProgress.map(project => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                description={project.description}
                                ownerName={project.owner.name}
                                membersCount={project.members.length}
                                members={project.members}
                                totalTasks={project.totalTasks}
                                doneTasks={project.doneTasks}
                            />
                        ))}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}