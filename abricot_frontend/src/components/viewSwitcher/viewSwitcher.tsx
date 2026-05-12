"use client"

import { ReactNode, useState } from "react";
import styles from "./viewSwitcher.module.css";
import Image from "next/image";

type ViewSwitcherProps = {
    listView: ReactNode;
    kanbanView: ReactNode;
}

export default function ViewSwitcher({ listView, kanbanView }: ViewSwitcherProps) {
    const [activeView, setActiveView] = useState<"list" | "kanban">("list");

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    onClick={() => setActiveView("list")}
                    className={`${styles.tabButton} ${activeView === "list" ? styles.active : ""}`}
                >
                    <Image src={"/icon/list.png"} alt={"Liste icon"} height={16} width={16}/>
                    <p className={styles.p}>Liste</p>
                </button>
                <button
                    onClick={() => setActiveView("kanban")}
                    className={`${styles.tabButton} ${styles.marginLeft} ${activeView === "kanban" ? styles.active : ""}`}
                >
                    <Image src={"/icon/kanban.png"} alt={"Kanban icon"} height={16} width={16}/>
                    <p className={styles.p}>Kanban</p>
                </button>
            </div>

            <div className={`${styles.viewContent} view-${activeView}`}>
                {activeView === "list" ? listView : kanbanView}
            </div>
        </div>
    );
}