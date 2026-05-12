// app/profile/page.tsx
import styles from "./profile.module.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getProfile } from "@/lib/actions/profile";
import { splitName } from "@/lib/utils";
import ProfileForm from "@/components/profilForm/profileForm";

export default async function ProfilePage() {
    const { data: user, error } = await getProfile();

    if (error || !user) {
        return <div>Erreur : {error}</div>;
    }

    const { firstName, lastName } = splitName(user.name);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Header name={user.name} />
                <div className={styles.container}>
                    <div className={styles.info}>
                        <h1 className={styles.title}>Mon Compte</h1>
                        <p className={styles.name}>{user?.name}</p>
                    </div>
                    <ProfileForm
                        firstName={firstName}
                        lastName={lastName}
                        email={user.email}
                    />
                </div>
                <Footer />
            </main>
        </div>
    );
}