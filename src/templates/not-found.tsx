import type { FC } from "hono/jsx";
import { Shell } from "./shell";

interface NotFoundProps {
  message: string;
}

export const NotFound: FC<NotFoundProps> = ({ message }) => (
  <Shell title="Not found — tailstory wiki">
    <header>
      <a href="/">tailstory wiki</a>
    </header>
    <main>
      <h1>404</h1>
      <p>{message}</p>
    </main>
  </Shell>
);
