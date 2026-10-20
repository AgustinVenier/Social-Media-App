import { validateEnvironment } from "../config/environment.js";
import { initDatabase } from "./init.js";
validateEnvironment();
await initDatabase();
console.log("Esquema inicializado");
