import type { FC } from "hono/jsx";
import { AppLayout } from "./app-layout";

interface NotFoundProps {
  message: string;
}

export const NotFound: FC<NotFoundProps> = ({ message }) => (
  <AppLayout title="Not found — Tailstory wiki">
    <h1>404</h1>
    <p>{message}</p>
  </AppLayout>
);
