import { getSession } from "next-session";
import session from "../../app/lib/session"; // Importa a configuração da sessão

export default async function handler(req, res) {
  await session(req, res); // Aplica a sessão

  try {
    const sessionData = req.session; // Acessa a sessão

    if (!sessionData) {
      return res.status(400).json({ message: "Nenhuma sessão ativa" });
    }

    // Destroi a sessão
    await req.session.destroy();

    return res.status(200).json({ message: "Logout bem-sucedido" });
  } catch (error) {
    console.error("Erro ao destruir a sessão:", error);
    return res.status(500).json({ message: "Erro ao fazer logout", error });
  }
}
