let reservationData; // Armazena os dados da reserva em memória

export default function handler(req, res) {
  if (req.method === "POST") {
    reservationData = req.body; // Armazena os dados recebidos na variável
    console.log("Dados recebidos:", reservationData);

    res
      .status(200)
      .json({ message: "Dados recebidos com sucesso", data: reservationData });
  } else if (req.method === "GET") {
    // Retorna os dados armazenados na variável de memória
    if (reservationData) {
      res.status(200).json({ data: reservationData });
    } else {
      res.status(404).json({ message: "Nenhum dado encontrado." });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}