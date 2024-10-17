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

  const updateSeenStatus = async () => {
    const recordID = localStorage.getItem('recordID');
    try {
      await axios.patch(`/api/get_jsons/${recordID}`);
      // Redireciona após a atualização do status
      window.location.href = 'http://localhost:3000'; // Redireciona para o localhost
    } catch (error) {
      console.error('Erro ao marcar como visto:', error);
    }
  };

  // Função para redirecionar para o localhost
  const handleCancel = () => {
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="p-20 font-sans">
      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reservationData ? (
        <>
          <div className="flex gap-4 mb-4">
            {/* Seção de Reservas */}
            <div className="flex-1 p-4">
              <h2 className='font-bold text-3xl text-[#2E615C]'>Nome do Hotel</h2>
              <p>Nome da rua do hotel</p>
              <p>codigo postal e localidade da morada do hotel</p>

              {JSON.parse(reservationData.requestBody).GuestInfo.map((guest, index) => (
                <div key={index} className="mb-2 mt-10">
                  <p>{guest.Salutation}. {guest.FirstName} {guest.LastName}</p>
                  <p>{guest.Street}</p>
                  <p>{guest.PostalCode}, {guest.City}, {guest.Country}</p>
                  <p>NIF: {guest.VatNo}</p>
                </div>
              ))}

              <h4 className="mb-2 mt-10 font-bold text-[#2E615C]">RESERVATION DETAILS</h4>
              {JSON.parse(reservationData.requestBody).Reservation.map((reservation, index) => (
                <div key={index}>
                  <p>Room Number: <span className='font-bold'>{reservation.RoomNumber}</span></p>
                  <p>Reservation Number: <span className='font-bold'>{reservation.ReservationNumber}</span></p>
                  <p>Check-In Date: <span className='font-bold'>{new Date(reservation.DateCI).toLocaleDateString()}</span></p>
                  <p>Check-Out Date: <span className='font-bold'>{new Date(reservation.DateCO).toLocaleDateString()}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="mb-4">
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="text-white" style={{ backgroundColor: '#2E615C' }}>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">Unit Price</th>
                  <th className="border border-gray-300 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(reservationData.requestBody).Items.map((item, index) => (
                  <tr key={item.ID} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#D4F1EE' }}>
                    <td className="border border-gray-300 p-2 text-center">{item.Date}</td>
                    <td className="border border-gray-300 p-2 text-right w-20">{item.Qty}</td>
                    <td className="border border-gray-300 p-2">{item.Description}</td>
                    <td className="border border-gray-300 p-2 text-right">€{item.UnitPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">€{item.Total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#2E615C' }}>
                  <td colSpan={4} className="border border-gray-300 p-2 text-right text-white"><strong>Total:</strong></td>
                  <td className="border border-gray-300 p-2 text-right text-white text-xl font-semibold">
                    €{JSON.parse(reservationData.requestBody).Items.reduce((acc, item) => acc + item.Total, 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Tabela de Impostos */}
          <div className="mb-4 mt-20">
            <table className="min-w-full border-collapse border border-gray-300 mb-4 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Type of Tax</th>
                  <th className="border border-gray-300 p-2">Total with Taxes</th>
                  <th className="border border-gray-300 p-2">Total without Taxes</th>
                  <th className="border border-gray-300 p-2">Total Taxes</th>
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

          {/* Botões de Ação */}
          <div className='flex gap-4 justify-end mt-4 p-4'>
            <button 
              className='bg-gray-300 font-semibold p-2 rounded-lg' 
              onClick={handleCancel}>
              Cancel
            </button>
            <button 
              className='bg-[#2E615C] text-white font-semibold p-2 rounded-lg' 
              onClick={updateSeenStatus}>
              Ok
            </button>
          </div>
        </>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </div>
  );
};

export default JsonViewPage;
