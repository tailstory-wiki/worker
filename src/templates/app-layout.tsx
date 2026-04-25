import type { Child, FC, PropsWithChildren } from "hono/jsx";

interface AppLayoutProps {
  title: string;
  nav?: Child;
}

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({
  title,
  nav,
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
      <header>
        <a href="/">Tailstory wiki</a>
        {nav && <nav>{nav}</nav>}
      </header>
      <main>{children}</main>
      <footer>
        <p>
          <a href="https://github.com/tailstory-wiki">Source on GitHub</a>
        </p>
      </footer>
    </body>
  </html>
);
