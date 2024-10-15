// src/pages/api/login.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Verificando a existência do usuário
    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    // Verificando a senha
    if (!user || !(await bcrypt.compare(password, user.Password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Sucesso no login
    return res.status(200).json({ message: "Login successful." }); // Pode retornar informações adicionais se necessário
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}

// Fechando a conexão do Prisma ao encerrar a aplicação
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
