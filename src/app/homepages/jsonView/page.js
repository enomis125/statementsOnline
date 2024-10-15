'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const JsonViewPage = () => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const recordID = localStorage.getItem('recordID');
    if (recordID) {
      const fetchReservation = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/get_jsons/${recordID}`);
          setReservationData(response.data.response[0]);
        } catch (error) {
          setError("Erro ao carregar os dados.");
        } finally {
          setLoading(false);
        }
      };
      fetchReservation();
    }
  }, []);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold text-gray-800">Detalhes da Reserva</h1>

      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reservationData ? (
        <>
          <div className="flex gap-4 mb-4">
            {/* Seção de Reservas */}
            <div className="flex-1 border border-gray-300 p-4 rounded-md shadow">
              <h3 className="font-semibold text-lg">Reservas:</h3>
              {JSON.parse(reservationData.requestBody).Reservation.map((reservation, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-2 mb-2 rounded-md"
                >
                  <p><strong>Número da Reserva:</strong> {reservation.ReservationNumber}</p>
                  <p><strong>Data de Check-In:</strong> {new Date(reservation.DateCI).toLocaleDateString()}</p>
                  <p><strong>Data de Check-Out:</strong> {new Date(reservation.DateCO).toLocaleDateString()}</p>
                  <p><strong>Número do Quarto:</strong> {reservation.RoomNumber}</p>
                  <p><strong>Nome do Usuário:</strong> {reservation.UserName}</p>
                </div>
              ))}
            </div>

            {/* Seção de Informações do Hóspede */}
            <div className="flex-1 border border-gray-300 p-4 rounded-md shadow">
              <h3 className="font-semibold text-lg">Informações do Hóspede:</h3>
              {JSON.parse(reservationData.requestBody).GuestInfo.map((guest, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-2 mb-2 rounded-md"
                >
                  <p><strong>Nome:</strong> {guest.FirstName} {guest.LastName}</p>
                  <p><strong>País:</strong> {guest.Country}</p>
                  <p><strong>Cidade:</strong> {guest.City}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg">Itens:</h3>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Descrição</th>
                  <th className="border border-gray-300 p-2">Quantidade</th>
                  <th className="border border-gray-300 p-2">Preço Unitário</th>
                  <th className="border border-gray-300 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(reservationData.requestBody).Items.map((item) => (
                  <tr key={item.ID}>
                    <td className="border border-gray-300 p-2">{item.Description}</td>
                    <td className="border border-gray-300 p-2">{item.Qty}</td>
                    <td className="border border-gray-300 p-2">€{item.UnitPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">€{item.Total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg">Impostos:</h3>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Tipo de Imposto</th>
                  <th className="border border-gray-300 p-2">Total com Impostos</th>
                  <th className="border border-gray-300 p-2">Total sem Impostos</th>
                  <th className="border border-gray-300 p-2">Total de Impostos</th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(reservationData.requestBody).Taxes.map((tax) => (
                  <tr key={tax.ID}>
                    <td className="border border-gray-300 p-2">{tax.Taxes}%</td>
                    <td className="border border-gray-300 p-2">€{tax.TotalWithTaxes.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">€{tax.TotalWithOutTaxes.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">€{tax.TotalTaxes.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-gray-300 p-4 rounded-md">
            <h3 className="font-semibold text-lg">Totais do Documento:</h3>
            {JSON.parse(reservationData.requestBody).DocumentTotals.map((total, index) => (
              <div key={index}>
                <p><strong>Total:</strong> €{total.Total.toFixed(2)}</p>
                <p><strong>Saldo:</strong> €{total.Balance.toFixed(2)}</p>
                <p><strong>Pagamento:</strong> €{total.Payment.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </div>
  );
};

export default JsonViewPage;
