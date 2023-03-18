import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Popover from "@radix-ui/react-popover";
import * as Separator from "@radix-ui/react-separator";
import { usePageContext } from "../../renderer/use-page-context";
import IconDiscordLogo from "~icons/radix-icons/discord-logo";
import IconGithubLogo from "~icons/radix-icons/github-logo";
import IconPaperPlane from "~icons/radix-icons/paper-plane";

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
                    <Popover.Root>
                        <Popover.Trigger className="text-black bg-primary9 @hover:bg-primary10 focus-visible:bg-primary10 data-[state=open]:bg-primary10 focus-visible:outline-none m-t-0.5em p-x-1.0em p-y-0.3em rounded">
                            Log In
                        </Popover.Trigger>
                        <Popover.Content className="flex flex-col content-center bg-primary2 sm:rounded border border-primary7 color-primary12 lt-sm:w-screen m-t-0.25em">
                            <section className="text-primary9 text-2xl flex">
                                <button
                                    className="bg-transparent @hover:bg-primary4 focus:outline-none focus-visible:bg-primary5 border-r border-primary7 py-4 basis-1/2 flex justify-center"
                                    title="Log In with Discord"
                                >
                                    <IconDiscordLogo />
                                </button>
                                <button
                                    className="bg-transparent @hover:bg-primary4 focus:outline-none focus-visible:bg-primary5 py-4 basis-1/2 flex justify-center"
                                    title="Log In with Discord"
                                >
                                    <IconGithubLogo />
                                </button>
                            </section>
                            <Separator.Root className="border-t border-primary6" />
                            <section className="flex text-primary9 text-2xl">
                                <input
                                    className="bg-primary3 @hover:bg-primary4 focus:bg-primary5 placeholder:text-primary8 focus:outline-none p-x w-16em"
                                    placeholder="Email"
                                    type="email"
                                />
                                <button
                                    className="bg-transparent @hover:bg-primary4 focus:outline-none focus-visible:bg-primary5 p-4"
                                    title="Log In with Email"
                                    type="button"
                                >
                                    <IconPaperPlane />
                                </button>
                            </section>
                        </Popover.Content>
                    </Popover.Root>
                </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport className="relative" />
        </NavigationMenu.Root>
    );
}
