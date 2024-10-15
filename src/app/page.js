"use client";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento

  const fetchData = async () => {
    try {
      const response = await fetch("/api/submitReservation", {
        method: "GET", // Mudamos para 'GET' para buscar os dados
      });
      if (!response.ok) {
        throw new Error("Erro ao carregar os dados");
      }
      const result = await response.json();
      setData(result.data); // Armazena apenas os dados
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData(); // Carrega os dados ao montar a página
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); // Atualiza os dados a cada 5 segundos
    }, 5000); // 5000 milissegundos = 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  useEffect(() => {
    if (data) {
      console.log("Dados carregados:", data);
    }
  }, [data]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="text-blue-600 hover:underline">
              Pendentes
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-blue-600 hover:underline">
              Vistos
            </a>
          </li>
        </ul>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 font-sans">
        <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>

        {data &&
        data.Reservation.length === 0 &&
        data.GuestInfo.length === 0 ? (
          <p className="text-gray-500">Nenhum dado disponível.</p>
        ) : (
          <>
            <h2 className="text-xl mt-4">Dados Recebidos:</h2>

            <div className="flex gap-4 mb-4">
              {/* Caixinha de Reservas */}
              <div className="flex-1 border border-gray-300 p-4 rounded-md shadow">
                <h3 className="font-semibold text-lg">Reservas:</h3>
                {data &&
                  data.Reservation.map((reservation, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-2 mb-2 rounded-md"
                    >
                      <p>
                        <strong>Número da Reserva:</strong>{" "}
                        {reservation.ReservationNumber}
                      </p>
                      <p>
                        <strong>Número da Reserva de Booking:</strong>{" "}
                        {reservation.BookingNumber}
                      </p>
                      <p>
                        <strong>Data de Check-In:</strong> {reservation.DateCI}
                      </p>
                      <p>
                        <strong>Data de Check-Out:</strong> {reservation.DateCO}
                      </p>
                      <p>
                        <strong>Número do Quarto:</strong>{" "}
                        {reservation.RoomNumber}
                      </p>
                      <p>
                        <strong>Nome do Usuário:</strong> {reservation.UserName}
                      </p>
                    </div>
                  ))}

                {/* Se não houver reservas, exibe tabela vazia */}
                {data && data.Reservation.length === 0 && (
                  <div className="border border-gray-300 p-2 mb-2 rounded-md">
                    <p className="text-gray-500">Nenhuma reserva encontrada.</p>
                  </div>
                )}
              </div>

              {/* Caixinha de Informações do Hóspede */}
              <div className="flex-1 border border-gray-300 p-4 rounded-md shadow">
                <h3 className="font-semibold text-lg">
                  Informações do Hóspede:
                </h3>
                {data &&
                  data.GuestInfo.map((guest, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-2 mb-2 rounded-md"
                    >
                      <p>
                        <strong>Saudação:</strong> {guest.Salution}
                      </p>
                      <p>
                        <strong>Nome:</strong> {guest.FirstName}
                      </p>
                      <p>
                        <strong>Sobrenome:</strong> {guest.LastName}
                      </p>
                      <p>
                        <strong>NIF:</strong> {guest.VatNo}
                      </p>
                      <p>
                        <strong>País:</strong> {guest.Country}
                      </p>
                      <p>
                        <strong>Endereço:</strong> {guest.Street}
                      </p>
                      <p>
                        <strong>Código Postal:</strong> {guest.PostalCode}
                      </p>
                      <p>
                        <strong>Cidade:</strong> {guest.City}
                      </p>
                    </div>
                  ))}

                {/* Se não houver hóspedes, exibe tabela vazia */}
                {data && data.GuestInfo.length === 0 && (
                  <div className="border border-gray-300 p-2 mb-2 rounded-md">
                    <p className="text-gray-500">Nenhum hóspede encontrado.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg">Itens:</h3>
              <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Descrição</th>
                    <th className="border border-gray-300 p-2">Quantidade</th>
                    <th className="border border-gray-300 p-2">
                      Preço Unitário
                    </th>
                    <th className="border border-gray-300 p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.Items && data.Items.length === 0 ? ( // Verificação adicional para evitar erro
                    <tr>
                      <td colSpan="4" className="text-center p-2 text-gray-500">
                        Nenhum item disponível.
                      </td>
                    </tr>
                  ) : (
                    data &&
                    data.Items.map(
                      (
                        item // Acesso seguro a data.Items
                      ) => (
                        <tr key={item.ID}>
                          <td className="border border-gray-300 p-2">
                            {item.Description}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.Qty}
                          </td>
                          <td className="border border-gray-300 p-2">
                            €{item.UnitPrice.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 p-2">
                            €{item.Total.toFixed(2)}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg">Impostos:</h3>
              <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">
                      Tipo de Imposto
                    </th>
                    <th className="border border-gray-300 p-2">
                      Total com Impostos
                    </th>
                    <th className="border border-gray-300 p-2">
                      Total sem Impostos
                    </th>
                    <th className="border border-gray-300 p-2">
                      Total de Impostos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.Taxes && data.Taxes.length === 0 ? ( // Verificação adicional para evitar erro
                    <tr>
                      <td colSpan="4" className="text-center p-2 text-gray-500">
                        Nenhum imposto disponível.
                      </td>
                    </tr>
                  ) : (
                    data &&
                    data.Taxes.map((tax) => (
                      <tr key={tax.ID}>
                        <td className="border border-gray-300 p-2">
                          {tax.Taxes}%
                        </td>
                        <td className="border border-gray-300 p-2">
                          €{tax.TotalWithTaxes.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          €{tax.TotalWithOutTaxes.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          €{tax.TotalTaxes.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg">Totais do Documento:</h3>
              <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Total</th>
                    <th className="border border-gray-300 p-2">Saldo</th>
                    <th className="border border-gray-300 p-2">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                  data.DocumentTotals &&
                  data.DocumentTotals.length === 0 ? ( // Verificação adicional para evitar erro
                    <tr>
                      <td colSpan="3" className="text-center p-2 text-gray-500">
                        Nenhum total disponível.
                      </td>
                    </tr>
                  ) : (
                    data &&
                    data.DocumentTotals.map((total) => (
                      <tr key={total.Total}>
                        <td className="border border-gray-300 p-2">
                          €{total.Total.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          €{total.Balance.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          €{total.Payment.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Page;