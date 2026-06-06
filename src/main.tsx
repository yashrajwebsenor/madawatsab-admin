import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import TenstackProvider from "./components/layouts/TenstackProvider";

createRoot(document.getElementById("root")!).render(
  <HeroUIProvider>
    <TenstackProvider>
      <ToastProvider placement="top-right" />
      <App />
    </TenstackProvider>
  </HeroUIProvider>,
);
