import { StrictMode } from "react";

import { DarkModeToggle } from "./NavBar/DarkModeToggle";
import styles from "./NavBar/NavBar.module.scss";
import UserMenu from "./NavBar/UserMenu";

export type NavBarProps = {
    path: string;
};

export default function NavBar({ path }: NavBarProps): JSX.Element {
    return (
        <StrictMode>
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
                        <UserMenu path={path} className={styles.navbarItem} />
                    </li>
                </ul>
            </nav>
        </StrictMode>
    );
}
