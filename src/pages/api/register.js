import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { firstName, secondName, email, password } = req.body;

      if (!firstName || !secondName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Verificando a existência do usuário
      const userExists = await prisma.users.findUnique({
        // Alterado de prisma.user para prisma.users
        where: { Email: email }, // Alterado de email para Email
      });

      if (userExists) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // Criptografando a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criando o usuário
      await prisma.users.create({
        // Alterado de prisma.user para prisma.users
        data: {
          FirstName: firstName, // Alterado de firstName para FirstName
          SecondName: secondName, // Alterado de secondName para SecondName
          Email: email, // Alterado de email para Email
          Password: hashedPassword, // Alterado de password para Password
        },
      });

      return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Database error:", error); // Log detalhado do erro
      return res
        .status(500)
        .json({ message: "Database error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}

// Fechando a conexão do Prisma ao encerrar a aplicação
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
