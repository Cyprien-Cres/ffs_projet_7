"use client"

import { useEffect, useState } from "react";
import {router} from "next/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hasToken = document.cookie.includes("token=");

        if (!hasToken) {
            router.push("/login");
        }

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return <>{children}</>;
}