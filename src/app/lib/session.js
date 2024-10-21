import nextSession from "next-session";

const sessionOptions = {
  name: "session",
  secret: "your_super_secret_key",
  cookie: {
    secure: process.env.NODE_ENV === "production", // secure in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/", // make the cookie available site-wide
  },
};

export default nextSession(sessionOptions);
