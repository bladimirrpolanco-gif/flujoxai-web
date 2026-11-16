import "server-only";
import { promises as dns } from "node:dns";

// Verifica que el dominio del correo exista y tenga servidor de correo (registros MX).
// Si el DNS falla por timeout u otro error raro, se deja pasar para no perder leads reales.
export async function emailDomainAcceptsMail(email: string, timeoutMs = 3000): Promise<boolean> {
  const domain = email.split("@")[1];
  if (!domain) return false;

  const lookup = dns.resolveMx(domain).then(
    (records) => records.some((r) => r.exchange && r.exchange !== "."),
    (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOTFOUND" || err.code === "ENODATA") return false;
      return true;
    }
  );
  const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(true), timeoutMs));
  return Promise.race([lookup, timeout]);
}
