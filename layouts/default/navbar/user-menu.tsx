import * as React from "react";
import { useRef } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Separator from "@radix-ui/react-separator";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Provider } from "@supabase/supabase-js";
import IconDiscordLogo from "~icons/radix-icons/discord-logo";
import IconGithubLogo from "~icons/radix-icons/github-logo";
import IconPaperPlane from "~icons/radix-icons/paper-plane";

export function UserMenu(): JSX.Element {
    const supabase = useSupabaseClient();
    const session = useSession();

    function loginWithSocial(provider: Provider): () => void {
        return () => {
            void supabase.auth
                .signInWithOAuth({
                    provider,
                    options: {
                        redirectTo: import.meta.env.DEV ? "http://localhost:3000" : undefined,
                    },
                })
                .then(({ error }) => {
                    if (error !== null) {
                        console.error("Error logging in with Discord:", error);
                    }
                });
        };
    }

    const emailFieldRef = useRef<HTMLInputElement | null>(null);
    function loginWithMagicLink(): void {
        if (emailFieldRef.current) {
            const emailField = emailFieldRef.current;

            void supabase.auth.signInWithOtp({
                email: emailField.value,
                options: {
                    emailRedirectTo: import.meta.env.DEV ? "http://localhost:3000" : undefined,
                },
            });
        }
    }

    if (session !== null) {
        return (
            <button
                className="text-black bg-primary9 @hover:bg-primary10 focus-visible:bg-primary10 data-[state=open]:bg-primary10 focus-visible:outline-none m-t-0.5em p-x-1.0em p-y-0.3em rounded"
                onClick={(): void => void supabase.auth.signOut()}
            >
                Log Out
            </button>
        );
    } else {
        return (
            <Popover.Root>
                <Popover.Trigger className="text-black bg-primary9 @hover:bg-primary10 focus-visible:bg-primary10 data-[state=open]:bg-primary10 focus-visible:outline-none m-t-0.5em p-x-1.0em p-y-0.3em rounded">
                    Log In
                </Popover.Trigger>
                <Popover.Content className="flex flex-col content-center bg-primary2 sm:rounded border border-primary7 color-primary12 lt-sm:w-screen m-t-0.25em">
                    <section className="text-primary9 text-2xl flex">
                        <button
                            className="bg-transparent @hover:bg-primary4 focus:outline-none focus-visible:bg-primary5 border-r border-primary7 py-4 basis-1/2 flex justify-center"
                            onClick={loginWithSocial("discord")}
                            title="Log In with Discord"
                        >
                            <IconDiscordLogo />
                        </button>
                        <button
                            className="bg-transparent @hover:bg-primary4 focus:outline-none focus-visible:bg-primary5 py-4 basis-1/2 flex justify-center"
                            onClick={loginWithSocial("github")}
                            title="Log In with GitHub"
                        >
                            <IconGithubLogo />
                        </button>
                    </section>
                    <Separator.Root className="border-t border-primary6" />
                    <section className="flex text-primary9 text-2xl">
                        <input
                            className="bg-primary3 @hover:bg-primary4 focus:bg-primary5 placeholder:text-primary8 focus:outline-none p-x w-16em"
                            placeholder="Email"
                            ref={emailFieldRef}
                            type="email"
                        />
                        <button
                            className="bg-transparent @hover:bg-primary4 focus:outline-none focus-visible:bg-primary5 p-4"
                            onClick={loginWithMagicLink}
                            title="Log In with Email"
                        >
                            <IconPaperPlane />
                        </button>
                    </section>
                </Popover.Content>
            </Popover.Root>
        );
    }
}
