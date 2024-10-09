// pages/api/submitReservation.js
export default function handler(req, res) {
    // Verifica se a requisição é do tipo POST
    if (req.method === 'POST') {
      const reservationData = req.body; // Captura o JSON enviado
  
      // Aqui você pode processar os dados como quiser (armazenar no banco de dados, etc.)
      console.log("Dados recebidos:", reservationData);
  
      // Retorna uma resposta de sucesso
      res.status(200).json({ message: "Dados recebidos com sucesso", data: reservationData });
    } else {
      // Retorna erro 405 se o método não for permitido
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  