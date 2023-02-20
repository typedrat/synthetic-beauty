import LightMode from "~icons/bi/lightbulb-fill";
import DarkMode from "~icons/bi/lightbulb";

import { toggleSiteTheme } from "../../stores/theme";
import styles from "./DarkModeToggle.module.scss";

export type DarkModeToggleProps = {
    className?: string | undefined;
};

export function DarkModeToggle(props: DarkModeToggleProps): JSX.Element {
    const classes = props.className
        ? [styles.themeButton, props.className].join(" ")
        : styles.themeButton;

    return (
        <button className={classes} onClick={toggleSiteTheme}>
            <LightMode className={styles.lightModeToggleLabel} />
            <DarkMode className={styles.darkModeToggleLabel} />
        </button>
    );
}
