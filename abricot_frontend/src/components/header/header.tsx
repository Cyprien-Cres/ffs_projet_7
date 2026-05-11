"use client"

import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const isDashboard = pathname === "/dashboard";
    const isProject = pathname === "/project";
    const isProfile = pathname === "/profile";

    return (
        <div className={styles.header}>
            <Image
                src="/logos/logo_orange.png"
                alt="Logo"
                width={147}
                height={19}
                className={styles.logo}
            />
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={isDashboard ? styles.active : styles.inactive}>
                        <Link className={styles.link} href="/dashboard">
                            <Image
                                src={isDashboard ? "/icon/icon_dashboard_active.svg" : "/icon/icon_dashboard_inactive.svg"}
                                alt="icon dashboard"
                                width={24}
                                height={24}
                            />
                            <p className={styles.p}>Tableau de bord</p>
                        </Link>
                    </li>
                    <li className={isProject ? styles.active : styles.inactive}>
                        <Link className={styles.link} href="/project">
                            <Image
                                src={isProject ? "/icon/icon_project_active.svg" : "/icon/icon_project_inactive.svg"}
                                alt="icon project"
                                width={24}
                                height={24}
                            />
                            <p className={styles.p}>Projets</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Link href="/profile" className={isProfile ? styles.activeProfile : styles.inactiveProfile}>
                <p className={styles.p}>AD</p>
            </Link>
        </div>
    );
}