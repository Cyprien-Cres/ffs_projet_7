"use server"

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type ProjectRole = "OWNER" | "MEMBER";

export type Member = {
    id: string;
    role: ProjectRole;
    user: User;
    joinedAt: string;
}



export type Project = {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    owner: User;
    members: Member[];
    createdAt: string;
    updatedAt: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Assignee = {
    id: string;
    userId: string;
    taskId: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
    assignedAt: string;
}

export type Comment = {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    author: {
        id: string;
        email: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type Task = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: string;
    dueDate: string;
    projectId: string;
    assignees: Assignee[];
    comments: Comment[];  // ← ajouter
}

type GetProjectsResponse = {
    data?: Project[];
    error?: string;
}

type GetProjectTasksResponse = {
    data?: Task[];
    error?: string;
}

type CreateProjectInput = {
    name: string;
    description: string;
    contributors: string[];
}

type CreateProjectResponse = {
    success?: boolean;
    error?: string;
}

type GetProjectResponse = {
    data?: Project;
    error?: string;
}

type UpdateProjectInput = {
    name?: string;
    description?: string;
}

type ActionResponse = {
    success?: boolean;
    error?: string;
}

type CreateTaskInput = {
    title: string;
    description: string;
    dueDate: string;
    assigneeIds: string[];
}

type UpdateTaskInput = {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
    assigneeIds?: string[];
}

type CreateCommentInput = {
    content: string;
}


export async function getProjects(): Promise<GetProjectsResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Erreur lors de la récupération des projets" };
        }

        const result = await response.json();
        return { data: result.data.projects };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function getProjectTasks(projectId: string): Promise<GetProjectTasksResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}/tasks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Erreur lors de la récupération des tâches" };
        }

        const result = await response.json();
        return { data: result.data.tasks };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function createProject(input: CreateProjectInput): Promise<CreateProjectResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la création du projet" };
        }

        revalidatePath("/project");
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function getProject(projectId: string): Promise<GetProjectResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Erreur lors de la récupération du projet" };
        }

        const result = await response.json();
        return { data: result.data.project };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function updateProject(
    projectId: string,
    input: UpdateProjectInput
): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la modification" };
        }

        revalidatePath("/project");
        revalidatePath(`/project/${projectId}`);
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function addContributor(projectId: string, email: string): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}/contributors`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de l'ajout du contributeur" };
        }

        revalidatePath("/project");
        revalidatePath(`/project/${projectId}`);
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function removeContributor(projectId: string, userId: string): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}/contributors/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la suppression du contributeur" };
        }

        revalidatePath("/project");
        revalidatePath(`/project/${projectId}`);
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function deleteProject(projectId: string): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la suppression du projet" };
        }

        revalidatePath("/project");
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function createTask(
    projectId: string,
    input: CreateTaskInput
): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}/tasks`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la création de la tâche" };
        }

        revalidatePath(`/project/${projectId}`);
        revalidatePath("/dashboard");
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function updateTask(
    projectId: string,
    taskId: string,
    input: UpdateTaskInput
): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la modification de la tâche" };
        }

        revalidatePath(`/project/${projectId}`);
        revalidatePath("/dashboard");
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function deleteTask(
    projectId: string,
    taskId: string
): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    console.log("🗑️ DELETE Task");
    console.log("  projectId:", projectId);
    console.log("  taskId:", taskId);
    console.log("  URL:", `${apiUrl}/projects/${projectId}/tasks/${taskId}`);
    console.log("  Token présent:", !!token);

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log("📡 Status:", response.status);

        if (!response.ok) {
            const result = await response.json();
            console.log("❌ Erreur backend:", result);
            return { error: result.message || "Erreur lors de la suppression de la tâche" };
        }

        console.log("✅ Tâche supprimée avec succès");

        revalidatePath(`/project/${projectId}`);
        revalidatePath("/dashboard");
        return { success: true };

    } catch (error) {
        console.log("💥 Erreur catch:", error);
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function createComment(
    projectId: string,
    taskId: string,
    input: CreateCommentInput
): Promise<ActionResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(
            `${apiUrl}/projects/${projectId}/tasks/${taskId}/comments`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            }
        );

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Erreur lors de la création du commentaire" };
        }

        revalidatePath(`/project/${projectId}`);
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

