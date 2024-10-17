import nextSession from "next-session";

const sessionOptions = {
  name: "session",
  secret: "your_super_secret_key", // Troque por uma chave secreta forte
  cookie: {
    secure: process.env.NODE_ENV === "production", // Usa cookies seguros em produção
    maxAge: 24 * 60 * 60 * 1000, // 1 dia
  },
};

export default nextSession(sessionOptions);
