import { useStore } from "@nanostores/react";
import { useLayoutEffect, useState } from "react";
import SpotifyIcon from "~icons/bi/spotify";

import {
    refreshIfExpired,
    userInfo as userInfoStore,
} from "../../stores/userInfo";

if (!import.meta.env.SSR) {
    refreshIfExpired();
}

export type UserMenuProps = {
    className?: string | undefined;
    path: string;
};

export default function UserMenu(props: UserMenuProps): JSX.Element {
    const loginParams = new URLSearchParams({ redirect: props.path });

    const [inClient, setInClient] = useState(false);
    useLayoutEffect(() => {
        setInClient(true);
    });

    let userInfo = useStore(userInfoStore);

    if (userInfo.loggedIn && inClient) {
        return (
            <a role="button" href="/auth/logout" className={props.className}>
                Log Out
            </a>
        );
    } else {
        return (
            <a
                role="button"
                href={`/auth/login?${loginParams}`}
                className={props.className}
            >
                <SpotifyIcon /> Log In
            </a>
        );
    }
}
