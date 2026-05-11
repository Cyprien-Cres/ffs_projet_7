"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginAction = {
    success?: boolean;
    error?: string;
}

export async function login(email: string, password: string): Promise<LoginAction | void> {
    const apiUrl = process.env.API_URL;

    let token: string;

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            return { error: "Email ou mot de passe incorrect" };
        }

        const data = await response.json();
        token = data.data.token;

        const cookie = await cookies();
        cookie.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });

    } catch (error) {
        return { error: "Erreur de connexion" };
    }

    redirect("/dashboard");
}