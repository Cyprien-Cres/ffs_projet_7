"use client"

import { useState, useRef, useEffect } from "react";
import styles from "./userSearchSelect.module.css";
import { searchUsers, type SearchUser } from "@/lib/actions/users";
import Image from "next/image";

type UserSearchSelectProps = {
    name: string;
    placeholder?: string;
    onChange?: (selected: SearchUser[]) => void;
}

export default function UserSearchSelect({name, placeholder = "Rechercher un collaborateur...", onChange,}: UserSearchSelectProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [selected, setSelected] = useState<SearchUser[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown quand on clique en dehors
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);

        const timer = setTimeout(async () => {
            const result = await searchUsers(query);
            if (result.data) {
                // Filtrer ceux déjà sélectionnés
                const filtered = result.data.filter(
                    u => !selected.find(s => s.id === u.id)
                );
                setResults(filtered);
            }
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, selected]);

    const selectUser = (user: SearchUser) => {
        const newSelected = [...selected, user];
        setSelected(newSelected);
        onChange?.(newSelected);
        setQuery("");
        setResults([]);
    };

    const removeUser = (userId: string) => {
        const newSelected = selected.filter(u => u.id !== userId);
        setSelected(newSelected);
        onChange?.(newSelected);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <input
                type="hidden"
                name={name}
                value={selected.map(u => u.email).join(",")}
            />

            <input
                type="text"
                className={`${styles.input} ${isOpen ? styles.open : ""}`}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
            />

            {isOpen && query.trim() && (
                <ul className={styles.dropdown}>
                    {loading && (
                        <li className={styles.option}>Recherche...</li>
                    )}
                    {!loading && results.length === 0 && (
                        <li className={styles.option}>Aucun résultat</li>
                    )}
                    {!loading && results.map(user => (
                        <li
                            key={user.id}
                            className={styles.option}
                            onClick={() => selectUser(user)}
                        >
                            <div className={styles.optionName}>{user.name}</div>
                            <div className={styles.optionEmail}>{user.email}</div>
                        </li>
                    ))}
                </ul>
            )}

            {selected.length > 0 && (
                <div className={styles.tags}>
                    {selected.map(user => (
                        <span key={user.id} className={styles.tag}>
                            {user.name}
                            <button
                                type="button"
                                onClick={() => removeUser(user.id)}
                                className={styles.removeTag}
                                aria-label={`Retirer ${user.name}`}
                            >
                                <Image
                                    src={"/icon/close_orange.png"}
                                    alt={"Bouton de suppression nom"}
                                    width={10}
                                    height={10}
                                />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}