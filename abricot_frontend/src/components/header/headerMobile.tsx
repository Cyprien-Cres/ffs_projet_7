"use client"

import { useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInitials } from "@/lib/utils";

type HeaderMobileProps = {
    name: string;
}

export default function HeaderMobile({ name }: HeaderMobileProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isDashboard = pathname === "/dashboard";
    const isProject = pathname === "/project";
    const isProfile = pathname === "/profile";

    const closeMenu = () => setIsOpen(false);

    return (
        <header className={styles.headerMobile}>
            <div className={styles.headerMobileTop}>
                <Image
                    src="/logos/logo_orange.png"
                    alt="Logo"
                    width={120}
                    height={16}
                />
                <button
                    type="button"
                    className={`${styles.burger} ${isOpen ? styles.burgerOpen : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isOpen}
                >
                    <span className={styles.burgerLine}></span>
                    <span className={styles.burgerLine}></span>
                    <span className={styles.burgerLine}></span>
                </button>
            </div>

            {isOpen && (
                <div>
                    <div
                        className={styles.overlay}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />
                    <nav className={styles.menuPanel}>
                        <ul className={styles.menuList}>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className={`${styles.menuLink} ${isDashboard ? styles.menuLinkActive : ""}`}
                                    onClick={closeMenu}
                                >
                                    <Image
                                        src={isDashboard ? "/icon/icon_dashboard_active.svg" : "/icon/icon_dashboard_inactive.svg"}
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                    Tableau de bord
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/project"
                                    className={`${styles.menuLink} ${isProject ? styles.menuLinkActive : ""}`}
                                    onClick={closeMenu}
                                >
                                    <Image
                                        src={isProject ? "/icon/icon_project_active.svg" : "/icon/icon_project_inactive.svg"}
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                    Projets
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profile"
                                    className={`${styles.menuLink} ${isProfile ? styles.menuLinkActive : ""}`}
                                    onClick={closeMenu}
                                >
                                    <span className={styles.profileInitials}>
                                        {getInitials(name)}
                                    </span>
                                    Mon profil
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}