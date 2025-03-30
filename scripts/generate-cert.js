import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Получаем __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certDir = path.join(__dirname, "../cert");

if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

// Генерируем приватный ключ
execSync("openssl genrsa -out cert/localhost-key.pem 2048");

// Генерируем CSR (Certificate Signing Request)
execSync(
  'openssl req -new -key cert/localhost-key.pem -out cert/localhost.csr -subj "/CN=localhost"'
);

// Генерируем самоподписанный сертификат
execSync(
  "openssl x509 -req -days 365 -in cert/localhost.csr -signkey cert/localhost-key.pem -out cert/localhost.pem"
);

console.log("SSL сертификаты успешно сгенерированы!");
