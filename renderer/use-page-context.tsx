import type { ReactNode } from "react";
import * as React from "react";
import type { PageContext } from "./types";

const { createContext, useContext } = React;

const Context = createContext<PageContext>({} as PageContext);

export function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext;
    children: ReactNode;
}): JSX.Element {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

export function usePageContext(): PageContext {
    return useContext(Context);
}
