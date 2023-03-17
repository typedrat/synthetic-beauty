import * as React from "react";

export function Page(): JSX.Element {
    return (
        <>
            <section
                className="dark-theme text-5xl color-primary11 bg-primary1 -m-x-100vw m-b-1em p-x-100vw p-y-1em"
                style={{
                    textShadow: "0 0 40px var(--un-preset-radix-amber11)",
                }}
            >
                <p className="m-b-1em">
                    if <b>truth</b> is <i>beauty</i>
                </p>
                <p className="m-b-1em">
                    and <u>mathematics</u> is the <b>ultimate truth</b>
                </p>
                <p>
                    doesn&apos;t it stand to reason that <u>mathematics</u> should be able to create the{" "}
                    <i>ultimate beauty</i>?
                </p>
            </section>

            <p>Synthetic Beauty is a project that allows users to create and share programmatic music visualizers.</p>
        </>
    );
}
