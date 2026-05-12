"use client"

import styles from "./footer.module.css";
import Image from "next/image";
import {usePathname} from "next/navigation";

export default function Header() {

    return (
        <div className={styles.footer}>
            <Image
                src="/logos/logo_black.png"
                alt="Logo"
                width={101}
                height={12.86}
                className={styles.logo}
            />
            <p className={styles.p}>Abricot 2025</p>
        </div>
    );
}