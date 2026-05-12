export function splitName(fullName: string): { firstName: string; lastName: string } {
    const [firstName, ...rest] = fullName.trim().split(" ");
    return {
        firstName: firstName || "",
        lastName: rest.join(" "),
    };
}

export function getInitials(fullName: string): string {
    return fullName
        .trim()
        .split(" ")
        .map(part => part[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function formatDateFr(dateString: string): string {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
    });
}