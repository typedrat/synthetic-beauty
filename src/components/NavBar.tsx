import IconSpotify from "~icons/bi/spotify";

import { DarkModeToggle } from "./NavBar/DarkModeToggle";
import styles from "./NavBar/NavBar.module.scss";

export type NavBarProps = {
    path: string;
};

export default function NavBar({ path }: NavBarProps): JSX.Element {
    const loginParams = new URLSearchParams({ redirect: path });

    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <a href="/" className={styles.navbarItem}>
                        Synthetic Beauty
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <DarkModeToggle className={styles.navbarItem} />
                </li>
                <li>
                    <a
                        role="button"
                        href={`/auth/login?${loginParams}`}
                        className={styles.navbarItem}
                    >
                        <IconSpotify /> Log In
                    </a>
                </li>
            </ul>
        </nav>
    );
}
