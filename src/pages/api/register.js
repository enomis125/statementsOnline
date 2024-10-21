import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const API_KEY =
  process.env.API_KEY || "vn2or398yvuh39fv9yf32faso987f987oihsao8789780hvw08f"; // Chave da API

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Verificar a API Key
    const apiKey = req.headers["x-api-key"]; // Esperamos a chave no cabeçalho 'x-api-key'

    if (!apiKey || apiKey !== API_KEY) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    try {
      const { firstName, secondName, email, password, propertyIds } = req.body;

      // Validar os campos obrigatórios
      if (!firstName || !secondName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Verificando a existência do usuário
      const userExists = await prisma.users.findUnique({
        where: { email: email },
      });

      if (userExists) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // Criptografando a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Verificando se os IDs das propriedades existem
      const properties = await prisma.properties.findMany({
        where: {
          propertyID: { in: propertyIds }, // Verifica se os propertyIds estão no banco de dados
        },
      });

      if (properties.length !== propertyIds.length) {
        return res
          .status(400)
          .json({ message: "Some property IDs are invalid or do not exist." });
      }

      // Criando o usuário e associando as propriedades existentes
      const user = await prisma.users.create({
        data: {
          firstName: firstName,
          secondName: secondName,
          email: email,
          password: hashedPassword,
          properties: {
            create: propertyIds.map((propertyID) => ({
              propertyID,
            })),
          },
        },
        include: {
          properties: true, // Incluir as propriedades na resposta
        },
      });

      return res.status(201).json({
        message: "User and properties associated successfully.",
        user,
      });
    } catch (error) {
      console.error("Database error:", error);
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
