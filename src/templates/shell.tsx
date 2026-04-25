import type { FC, PropsWithChildren } from "hono/jsx";

interface ShellProps {
  title: string;
}

export const Shell: FC<PropsWithChildren<ShellProps>> = ({ title, children }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </head>
    <body>{children}</body>
  </html>
);
