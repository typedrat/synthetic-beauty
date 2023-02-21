import LightMode from "~icons/bi/lightbulb-fill";
import DarkMode from "~icons/bi/lightbulb";

import { toggleSiteTheme } from "../../stores/theme";
import styles from "./DarkModeToggle.module.scss";

export type DarkModeToggleProps = {
    className?: string | undefined;
};

export function DarkModeToggle({
    className,
}: DarkModeToggleProps): JSX.Element {
    const classes = className
        ? [styles.themeButton, className].join(" ")
        : styles.themeButton;

    return (
        <button
            className={classes}
            onClick={toggleSiteTheme}
            aria-label="Toggle light/dark theme"
        >
            <LightMode className={styles.lightModeToggleLabel} />
            <DarkMode className={styles.darkModeToggleLabel} />
        </button>
    );
}
