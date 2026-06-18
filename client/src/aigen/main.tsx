import { createRoot } from "react-dom/client";
import AigenApp from "./AigenApp";
import "@/index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(<AigenApp />);
