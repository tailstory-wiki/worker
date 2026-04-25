import type { Child, FC, PropsWithChildren } from "hono/jsx";

interface AppLayoutProps {
  title: string;
  nav?: Child;
  mainClass?: string;
}

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({
  title,
  nav,
  mainClass,
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
      <footer class="site-footer">
        <p>
          <a href="https://github.com/tailstory-wiki">Source on GitHub</a>
        </p>
      </footer>
    </body>
  </html>
);
