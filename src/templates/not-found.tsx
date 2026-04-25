import type { FC } from "hono/jsx";
import { AppLayout } from "./app-layout";

interface NotFoundProps {
  message: string;
  version?: string;
}

export const NotFound: FC<NotFoundProps> = ({ message, version }) => (
  <AppLayout title="Not found — Tailstory wiki" version={version}>
    <h1>404</h1>
    <p>{message}</p>
  </AppLayout>
);
