import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  if (req.method === "OPTIONS") return res.sendStatus(200);

  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload has id, maybe email; don't rely on email here
    req.user = { id: payload.id, email: payload.email ?? null, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
