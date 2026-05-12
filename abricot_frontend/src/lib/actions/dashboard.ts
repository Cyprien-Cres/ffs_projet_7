"use server"

import { cookies } from "next/headers";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type User = {
    id: string;
    email: string;
    name: string;
}

export type Assignee = {
    id: string;
    userId: string;
    taskId: string;
    user: User;
    assignedAt: string;
}

export type Comment = {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    author: User;
    createdAt: string;
    updatedAt: string;
}

export type Task = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    projectId: string;
    creatorId: string;
    assignees: Assignee[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

export type ProjectWithTasks = {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    owner: User;
    members: {
        id: string;
        role: string;
        user: User;
        joinedAt: string;
    }[];
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}

type AssignedTasksResponse = {
    data?: Task[];
    error?: string;
}

type ProjectsWithTasksResponse = {
    data?: ProjectWithTasks[];
    error?: string;
}

export async function getAssignedTasks(): Promise<AssignedTasksResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/dashboard/assigned-tasks`, {
            headers: { "Authorization": `Bearer ${token}` },
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

export async function getProjectsWithTasks(): Promise<ProjectsWithTasksResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) return { error: "Non authentifié" };

    try {
        const response = await fetch(`${apiUrl}/dashboard/projects-with-tasks`, {
            headers: { "Authorization": `Bearer ${token}` },
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