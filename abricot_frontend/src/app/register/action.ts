// app/register/action.ts (ou là où tu organises tes actions)
"use server"

import { redirect } from "next/navigation";

type RegisterAction = {
    success?: boolean;
    error?: string;
}

export async function register( email: string, password: string, name: string ): Promise<RegisterAction | void> {
    const apiUrl = process.env.API_URL;

    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name })
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: data.message || "Erreur lors de l'inscription" };
        }

    } catch (error) {
        return { error: "Erreur de connexion au serveur" };
    }

    redirect("/login");
}