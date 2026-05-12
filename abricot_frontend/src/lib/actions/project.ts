"use server"

import { cookies } from "next/headers";

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

export type Task = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: string;
    dueDate: string;
    projectId: string;
}

type GetProjectsResponse = {
    data?: Project[];
    error?: string;
}

type GetProjectTasksResponse = {
    data?: Task[];
    error?: string;
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