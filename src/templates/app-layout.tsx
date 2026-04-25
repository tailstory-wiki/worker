import type { Child, FC, PropsWithChildren } from "hono/jsx";

interface AppLayoutProps {
  title: string;
  nav?: Child;
  mainClass?: string;
  footerMode?: "site" | "plain" | "none";
  footerContent?: Child;
}

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({
  title,
  nav,
  mainClass,
  footerMode = "site",
  footerContent,
  children,
}) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header class="site-header">
        <a href="/" class="site-title">Tailstory wiki</a>
        {nav && <nav>{nav}</nav>}
      </header>
      <main class={mainClass}>{children}</main>
      {footerMode !== "none" && (
        <footer class={footerMode === "site" ? "site-footer" : undefined}>
          {footerContent ?? <p>Tailstory wiki</p>}
        </footer>
      )}
    </body>
  </html>
);