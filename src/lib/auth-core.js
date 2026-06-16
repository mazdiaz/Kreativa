const DEMO_USERS = [
  { id: "u-admin", name: "Admin Program", email: "admin@inklusikarya.test", password: "password123", role: "ADMIN" },
  { id: "u-participant", name: "Siti Rahma", email: "peserta@inklusikarya.test", password: "password123", role: "PARTICIPANT" },
  { id: "u-mentor", name: "Budi Mentor", email: "mentor@inklusikarya.test", password: "password123", role: "MENTOR" },
  { id: "u-partner", name: "Mitra Nusantara", email: "mitra@inklusikarya.test", password: "password123", role: "PARTNER" },
];

export const SESSION_COOKIE = "inklusikarya_session";

export function publicSession(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function authenticateDemoUser(email, password) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const user = DEMO_USERS.find((item) => item.email === normalizedEmail && item.password === password);
  return publicSession(user);
}

export function encodeSession(session) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

export function safeSessionFromCookie(value) {
  try {
    const json = Buffer.from(String(value), "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (!parsed?.id || !parsed?.email || !parsed?.role) return null;
    return publicSession(parsed);
  } catch {
    return null;
  }
}
