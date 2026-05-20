"use client"

import { useId, useState, useRef, useEffect } from "react";
import styles from "./userSearchSelect.module.css";
import { searchUsers, type SearchUser } from "@/lib/actions/users";
import Image from "next/image";

type UserSearchSelectProps = {
    name: string;
    placeholder?: string;
    initialSelected?: SearchUser[];
    onChange?: (selected: SearchUser[]) => void;
    valueField?: "id" | "email";
}

export default function UserSearchSelect({
                                             name,
                                             placeholder = "Rechercher un collaborateur...",
                                             initialSelected = [],
                                             onChange,
                                             valueField = "id",
                                         }: UserSearchSelectProps) {
    const id = useId();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [selected, setSelected] = useState<SearchUser[]>(initialSelected);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
                const filtered = result.data.filter(
                    u => !selected.find(s => s.id === u.id)
                );
                setResults(filtered);
                setHighlightedIndex(filtered.length > 0 ? 0 : -1);
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
        setHighlightedIndex(-1);
    };

    const removeUser = (userId: string) => {
        const newSelected = selected.filter(u => u.id !== userId);
        setSelected(newSelected);
        onChange?.(newSelected);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;

            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && results[highlightedIndex]) {
                    selectUser(results[highlightedIndex]);
                }
                break;

            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                break;
        }
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <input
                type="hidden"
                name={name}
                value={selected.map(u => u[valueField]).join(",")}
            />

            <label htmlFor={`${id}-search`} className="sr-only">
                Rechercher un utilisateur
            </label>
            <input
                type="text"
                id={`${id}-search`}
                className={`${styles.input} ${isOpen ? styles.open : ""}`}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                role="combobox"
                aria-expanded={isOpen}
                aria-autocomplete="list"
                aria-controls={`${id}-listbox`}
            />

            {isOpen && query.trim() && (
                <ul
                    className={styles.dropdown}
                    role="listbox"
                    id={`${id}-listbox`}
                >
                    {loading && (
                        <li className={styles.option}>Recherche...</li>
                    )}
                    {!loading && results.length === 0 && (
                        <li className={styles.option}>Aucun résultat</li>
                    )}
                    {!loading && results.map((user, index) => (
                        <li
                            key={user.id}
                            className={`${styles.option} ${index === highlightedIndex ? styles.highlighted : ""}`}
                            onClick={() => selectUser(user)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            role="option"
                            aria-selected={index === highlightedIndex}
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
                                    alt=""
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