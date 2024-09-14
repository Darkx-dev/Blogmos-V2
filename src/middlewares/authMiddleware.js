import { getSession } from "next-auth/react";

export const requireAuth = async (req, res, next) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = session.user; // Attach user to request
  next();
};