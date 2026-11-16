// Validación compartida (cliente + servidor) para datos de contacto de leads.
// Objetivo: rechazar teléfonos inventados (666666666, 1234567890…) y correos inválidos o desechables.

export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

// ───────────────────────── Teléfono ─────────────────────────

function isRepeatedOrSequential(d: string): boolean {
  if (/^(\d)\1+$/.test(d)) return true; // 6666666
  const asc = "01234567890123456789";
  const desc = "98765432109876543210";
  if (d.length >= 6 && (asc.includes(d) || desc.includes(d))) return true; // 1234567 / 7654321
  if (/^(\d{2})\1{2,}$/.test(d) || /^(\d{3})\1{2,}$/.test(d)) return true; // 1212121 / 123123123
  if (new Set(d).size <= 2 && d.length >= 7) return true; // 6660666, 1100110
  return false;
}

export function validatePhone(raw: string): ValidationResult {
  const input = String(raw || "").trim();
  if (!input) return { ok: false, error: "Ingresa tu número de WhatsApp." };
  if (/[^\d\s()+\-.]/.test(input)) return { ok: false, error: "El teléfono solo puede tener números." };

  const hasPlus = input.startsWith("+");
  let digits = input.replace(/\D/g, "");

  // Normalizar a formato internacional
  let nanp = false;
  if (!hasPlus) {
    if (digits.length === 10) { digits = "1" + digits; nanp = true; } // 8095551234 → RD/EE.UU.
    else if (digits.length === 11 && digits.startsWith("1")) nanp = true;
    else return { ok: false, error: "Número inválido. Usa 10 dígitos (ej. 809 555 1234) o incluye el código de país con +." };
  } else {
    nanp = digits.startsWith("1");
  }

  if (digits.length < 8 || digits.length > 15) {
    return { ok: false, error: "El número no tiene una longitud válida." };
  }

  if (nanp) {
    if (digits.length !== 11) return { ok: false, error: "Los números de RD/EE.UU. tienen 10 dígitos (ej. 809 555 1234)." };
    const area = digits.slice(1, 4);
    const exchange = digits.slice(4, 7);
    const line = digits.slice(7);
    if (!/^[2-9]\d\d$/.test(area) || /^[2-9]11$/.test(area)) return { ok: false, error: "El código de área no es válido." };
    if (!/^[2-9]\d\d$/.test(exchange) || /^[2-9]11$/.test(exchange)) return { ok: false, error: "El número no es válido." };
    if (exchange === "555" && /^01\d\d$/.test(line)) return { ok: false, error: "Ese número es ficticio." };
    if (isRepeatedOrSequential(exchange + line)) {
      return { ok: false, error: "Ese número parece inventado. Ingresa tu WhatsApp real." };
    }
  } else {
    // Sin el código de país (1–3 dígitos) comprobamos el número local
    const local = digits.slice(-Math.min(digits.length - 1, 10));
    if (isRepeatedOrSequential(local) || isRepeatedOrSequential(digits)) {
      return { ok: false, error: "Ese número parece inventado. Ingresa tu WhatsApp real." };
    }
  }

  return { ok: true, value: "+" + digits };
}

// ───────────────────────── Email ─────────────────────────

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com",
  "10minutemail.net", "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmail.net", "tempmailo.com",
  "yopmail.com", "yopmail.net", "trashmail.com", "getnada.com", "nada.email", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "throwawaymail.com", "fakeinbox.com", "mintemail.com", "mohmal.com",
  "emailondeck.com", "spamgourmet.com", "mailcatch.com", "moakt.com", "tmail.ws", "tmpmail.org",
  "burnermail.io", "inboxkitten.com", "mail.tm", "mailpoof.com", "33mail.com", "discard.email",
  "spambox.us", "trbvm.com", "byom.de", "emailfake.com", "fakemail.net", "luxusmail.org", "1secmail.com",
]);

// Dominios reservados / de ejemplo que nunca reciben correo real
const FAKE_DOMAINS = new Set([
  "example.com", "example.org", "example.net", "test.com", "test.net", "prueba.com", "fake.com",
  "correo.com", "asdf.com", "qwerty.com", "noemail.com", "nomail.com", "sincorreo.com",
  "miempresa.com", "empresa.com", "dominio.com",
]);

// Errores de tipeo frecuentes → sugerencia
const TYPO_DOMAINS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmal.com": "gmail.com", "gmaill.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.om": "gmail.com",
  "gnail.com": "gmail.com", "gamil.com": "gmail.com", "gmail.es": "gmail.com", "gmail.com.do": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com", "hotamil.com": "hotmail.com", "homail.com": "hotmail.com",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com", "outlook.co": "outlook.com", "outlook.con": "outlook.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com",
  "icloud.co": "icloud.com", "iclod.com": "icloud.com",
};

const JUNK_LOCAL = /^(test|testing|prueba|pruebas|asdf+|qwerty|fake|falso|noreply|no-reply|nada|ninguno|xxx+|abc|abcd|1234\d*)$/i;

const EMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

export function validateEmail(raw: string): ValidationResult {
  const email = String(raw || "").trim().toLowerCase();
  if (!email) return { ok: false, error: "Ingresa tu correo." };
  if (email.length > 254 || !EMAIL_RE.test(email) || email.includes("..")) {
    return { ok: false, error: "El correo no es válido." };
  }
  const [local, domain] = email.split("@");

  if (TYPO_DOMAINS[domain]) return { ok: false, error: `¿Quisiste decir ${local}@${TYPO_DOMAINS[domain]}?` };
  if (DISPOSABLE_DOMAINS.has(domain)) return { ok: false, error: "No se permiten correos temporales. Usa tu correo real." };
  if (FAKE_DOMAINS.has(domain)) return { ok: false, error: "Ese correo no es real. Usa tu correo de trabajo o personal." };
  if (JUNK_LOCAL.test(local) || /^(.)\1+$/.test(local)) {
    return { ok: false, error: "Ese correo parece inventado. Usa tu correo real." };
  }

  return { ok: true, value: email };
}
