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

type GetProfileResponse = {
    data?: User;
    error?: string;
}

type UpdateResponse = {
    success?: boolean;
    error?: string;
}

export async function getProfile(): Promise<GetProfileResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return { error: "Non authentifié" };
    }

    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Erreur lors de la récupération du profil" };
        }

        const result = await response.json();
        return { data: result.data.user };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function updateProfile(data: { name?: string; email?: string }): Promise<UpdateResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return { error: "Non authentifié" };
    }

    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return { error: "Erreur lors de la mise à jour du profil" };
        }

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<UpdateResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return { error: "Non authentifié" };
    }

    try {
        const response = await fetch(`${apiUrl}/auth/password`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
            return { error: "Erreur lors de la mise à jour du mot de passe" };
        }

        return { success: true };

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}