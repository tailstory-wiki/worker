import { raw } from "hono/html";
import type { Child, FC, PropsWithChildren } from "hono/jsx";

interface AppLayoutProps {
  title: string;
  nav?: Child;
}

const themeBootScript = `(()=>{try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

const ThemeSwitcher: FC = () => (
  <div class="theme-switcher" role="group" aria-label="Color theme">
    <button type="button" data-theme-choice="system" aria-pressed="true">
      System
    </button>
    <button type="button" data-theme-choice="light" aria-pressed="false">
      Light
    </button>
    <button type="button" data-theme-choice="dark" aria-pressed="false">
      Dark
    </button>
  </div>
);

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
      <script>{raw(themeBootScript)}</script>
    </head>
    <body>
      <header>
        <a href="/">Tailstory wiki</a>
        {nav && <nav>{nav}</nav>}
        <ThemeSwitcher />
      </header>
      <main>{children}</main>
      <footer>
        <p>
          <a href="https://github.com/tailstory-wiki">Source on GitHub</a>
        </p>
      </footer>
      <script src="/theme.js" defer />
    </body>
  </html>
);
