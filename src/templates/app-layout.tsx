import { raw } from "hono/html";
import type { Child, FC, PropsWithChildren } from "hono/jsx";

interface AppLayoutProps {
  title: string;
  nav?: Child;
}

const themeBootScript = `(()=>{try{var t=localStorage.getItem("theme");var p=(t==="light"||t==="dark")?t:"system";var r=document.documentElement;r.setAttribute("data-theme-pref",p);if(p!=="system")r.setAttribute("data-theme",p);}catch(e){document.documentElement.setAttribute("data-theme-pref","system");}})();`;

const SystemIcon: FC = () => (
  <svg
    data-icon="system"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const SunIcon: FC = () => (
  <svg
    data-icon="light"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
    <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
  </svg>
);

const MoonIcon: FC = () => (
  <svg
    data-icon="dark"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeSwitcher: FC = () => (
  <details class="theme-switcher">
    <summary aria-label="Change color theme" title="Change color theme">
      <SystemIcon />
      <SunIcon />
      <MoonIcon />
    </summary>
    <ul class="theme-menu" aria-label="Color theme">
      <li>
        <button
          type="button"
          data-theme-choice="system"
          aria-pressed="true"
          aria-label="Match system"
          title="Match system"
        >
          <SystemIcon />
        </button>
      </li>
      <li>
        <button
          type="button"
          data-theme-choice="light"
          aria-pressed="false"
          aria-label="Light"
          title="Light"
        >
          <SunIcon />
        </button>
      </li>
      <li>
        <button
          type="button"
          data-theme-choice="dark"
          aria-pressed="false"
          aria-label="Dark"
          title="Dark"
        >
          <MoonIcon />
        </button>
      </li>
    </ul>
  </details>
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
