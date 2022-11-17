import React from "react";
import Link from "next/link";
import "./global.css";

import { IBM_Plex_Mono } from '@next/font/google';

const plexMono = IBM_Plex_Mono({
    weight: ['400', '700'],
    variable: '--ibm-plex-mono-font',
    style: ['normal', 'italic']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={plexMono.variable}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <header className="container-fluid">
                    <nav>
                        <ul>
                            <li>
                                <Link href="/" className="header-brand">
                                    Synthetic Beauty
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <a href="#" role="button">
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main className="container">
                    {children}
                </main>
                <footer className="container-fluid">
                    <p>
                        Made by <a href="https://github.com/typedrat">Alexis Williams</a>, powered by <a href="https://nextjs.org/">Next.js</a>.
                    </p>
                </footer>
            </body>
        </html>
    );
}
