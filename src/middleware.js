import session from "../src/app/lib/session"; // Importa a configuração da sessão

export default async function middleware(req, res) {
  await session(req, res);

  // Verifique se a sessão foi corretamente criada
  console.log("Sessão na primeira tentativa:", req.session);

  // Se a sessão não existe, inicialize-a
  if (!req.session) {
    req.session = {};
  }

  // Continue o fluxo sem a necessidade de `next()`
}
