import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { usePageContext } from "@/components/page-context-provider";
import { UserMenu } from "./user-menu";

function Link({
    href,
    children,
    className,
}: {
    href: string;
    children: (JSX.Element | string)[];
    className?: string;
}): JSX.Element {
    const { urlPathname } = usePageContext();
    const isActive = urlPathname === href;

    return (
        <NavigationMenu.Link active={isActive} asChild>
            <a className={className} href={href}>
                {children}
            </a>
        </NavigationMenu.Link>
    );
}

export function NavBar(): JSX.Element {
    return (
        <NavigationMenu.Root className="relative w-100% z-1">
            <NavigationMenu.List className="w-100% flex flex-row align-center color-primary9">
                <NavigationMenu.Item>
                    <Link
                        className="inline-block @hover:bg-primary4 focus-visible:bg-primary5 sm:-m-l-1.0em p-x-1.0em p-y-0.5em focus:outline-none"
                        href="/"
                    >
                        <img
                            alt=""
                            aria-hidden
                            className="inline-block align-middle w-2em m-r-0.5em rounded bg-primary9"
                            height="2em"
                            width="2em"
                            src="/logo.svg"
                        />
                        Synthetic Beauty
                    </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item className="m-l-auto lt-sm:p-r-1.0em">
                    <UserMenu />
                </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport className="relative" />
        </NavigationMenu.Root>
    );
}
