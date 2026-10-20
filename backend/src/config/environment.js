import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)), quiet: true });
export function validateEnvironment() {
  for (const name of ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"]) {
    if (!process.env[name]) throw new Error(name + " es requerida");
  }
  if (process.env.NODE_ENV === "production") {
    if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET debe tener al menos 32 caracteres");
    if (process.env.DB_SSL !== "true") throw new Error("Produccion requiere DB_SSL=true");
    if (!process.env.DB_PASSWORD) throw new Error("DB_PASSWORD es requerida en produccion");
  }
}
