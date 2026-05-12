"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const hasToken = document.cookie.includes("token=");

        if (!hasToken) {
            router.push("/login");
            return;
        }

        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return <>{children}</>;
}