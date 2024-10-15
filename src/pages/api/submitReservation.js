import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Inicializa a instância do Prisma Client

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Desestruture os dados da requisição
      const {
        PropertyID,
        Reservation,
        GuestInfo,
        Items,
        Taxes,
        DocumentTotals,
      } = req.body;

      // Para simplificação, vamos armazenar o primeiro item de cada array.
      const reservation =
        Reservation && Reservation.length > 0 ? Reservation[0] : null;
      const guestInfo = GuestInfo && GuestInfo.length > 0 ? GuestInfo[0] : null;

      // Criar o objeto que vamos salvar
      const newRequest = await prisma.requestRecords.create({
        data: {
          requestBody: JSON.stringify(req.body), // Armazena o corpo completo como JSON
          requestType: "Reservation", // Você pode ajustar isso conforme necessário
          requestDateTime: new Date(), // Armazena a data e hora atual
          responseStatus: "201", // Ajuste conforme necessário
          responseBody: "falta adicionar", // Ajuste conforme necessário
          propertyID: req.body.propertyID, // Assume que PropertyID é um número
          seen: 0,
        },
      });

      res.status(201).json({
        message: "Dados armazenados com sucesso",
        data: newRequest,
      });
    } catch (error) {
      // Log detalhado do erro
      console.error("Erro ao gravar os dados:", error.message);
      console.error("Detalhes do erro:", error);
      res
        .status(500)
        .json({ message: "Erro ao gravar os dados", error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const allRequests = await prisma.requestRecords.findMany();
      res.status(200).json({ data: allRequests });
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      res.status(500).json({ message: "Erro ao buscar os dados" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
