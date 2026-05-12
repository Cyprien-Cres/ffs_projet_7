"use server"

import { cookies } from "next/headers";

export type SearchUser = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

type SearchUsersResponse = {
    data?: SearchUser[];
    error?: string;
}

export async function searchUsers(query: string): Promise<SearchUsersResponse> {
    const apiUrl = process.env.API_URL;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return { error: "Non authentifié" };
    }

    if (!query.trim()) {
        return { data: [] };
    }

    try {
        const response = await fetch(`${apiUrl}/users/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return { error: "Erreur lors de la recherche" };
        }

        const result = await response.json();
        return { data: result.data.users };  // ← changement ici

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }
}