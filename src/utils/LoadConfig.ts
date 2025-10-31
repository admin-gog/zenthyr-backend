import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path to root config.json
const configPath = path.resolve(__dirname, "../../config.json");

// Read and parse config only once
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
export default config;
