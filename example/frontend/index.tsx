import { App } from "./app";
import { createRoot } from "react-dom/client";

const root = document.getElementById("app");

if (root) {
  const app = createRoot(root);
  app.render(<App />);
}
