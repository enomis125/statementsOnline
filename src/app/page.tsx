"use client";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState(null); // Dados de reservas e hóspedes
  const [selectedReservation, setSelectedReservation] = useState(null); // Reserva selecionada
  const [viewedReservations, setViewedReservations] = useState([]); // Armazena reservas vistas

  // Função para salvar os dados no localStorage
  const saveToLocalStorage = (reservations, guests) => {
    const storedData = {
      Reservation: reservations,
      GuestInfo: guests,
      viewedReservations: viewedReservations,
    };
    localStorage.setItem("reservationData", JSON.stringify(storedData));
  };

  // Função para carregar os dados do localStorage
  const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem("reservationData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData({
        Reservation: parsedData.Reservation || [],
        GuestInfo: parsedData.GuestInfo || [],
      });
      setViewedReservations(parsedData.viewedReservations || []);
    }
  };

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/submitReservation", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Erro ao carregar os dados");
      }
      const result = await response.json();

      if (result.data) {
        const currentReservations = data?.Reservation || [];
        const newReservations = result.data.Reservation;

        // Concatenar as novas reservas com as atuais, garantindo o limite de 10
        const updatedReservations = [
          ...newReservations,
          ...currentReservations,
        ].slice(0, 10);

        // Atualizar o estado e salvar no localStorage
        saveToLocalStorage(updatedReservations, result.data.GuestInfo);
        setData({
          Reservation: updatedReservations,
          GuestInfo: result.data.GuestInfo,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFromLocalStorage(); // Carrega os dados do localStorage ao montar a página

    const interval = setInterval(() => {
      fetchData(); // Atualiza os dados a cada 5 segundos
    }, 5000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  // Função para marcar uma reserva como vista e exibi-la na grelha
  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);

    // Marca a reserva como vista se ainda não estiver marcada
    if (!viewedReservations.includes(reservation.ReservationNumber)) {
      const updatedViewed = [
        ...viewedReservations,
        reservation.ReservationNumber,
      ];
      setViewedReservations(updatedViewed);

      // Atualiza o localStorage com as reservas vistas
      const storedData = localStorage.getItem("reservationData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        parsedData.viewedReservations = updatedViewed;
        localStorage.setItem("reservationData", JSON.stringify(parsedData));
      }
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">Reservas</h2>

        {/* Pendentes */}
        <h3 className="font-semibold text-lg">Pendentes</h3>
        <ul>
          {data &&
            data.Reservation &&
            data.Reservation.filter(
              (reservation) =>
                !viewedReservations.includes(reservation.ReservationNumber)
            )
              .slice(0, 10) // Exibe apenas os 10 últimos
              .map((reservation, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleSelectReservation(reservation)}
                >
                  {reservation.UserName} - {reservation.ReservationNumber}
                </li>
              ))}

          {/* Caso não tenha reservas pendentes */}
          {data &&
            data.Reservation &&
            data.Reservation.filter(
              (reservation) =>
                !viewedReservations.includes(reservation.ReservationNumber)
            ).length === 0 && (
              <li className="text-gray-500">Nenhuma reserva pendente.</li>
            )}
        </ul>

        {/* Vistos */}
        <h3 className="font-semibold text-lg mt-4">Vistos</h3>
        <ul>
          {data &&
            data.Reservation &&
            data.Reservation.filter((reservation) =>
              viewedReservations.includes(reservation.ReservationNumber)
            )
              .slice(0, 10) // Exibe apenas os 10 últimos
              .map((reservation, index) => (
                <li
                  key={index}
                  className="mb-2 text-green-600 hover:underline"
                  onClick={() => handleSelectReservation(reservation)}
                >
                  {reservation.UserName} - {reservation.ReservationNumber}
                </li>
              ))}

          {/* Caso não tenha reservas vistas */}
          {data &&
            data.Reservation &&
            data.Reservation.filter((reservation) =>
              viewedReservations.includes(reservation.ReservationNumber)
            ).length === 0 && (
              <li className="text-gray-500">Nenhuma reserva vista.</li>
            )}
        </ul>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 font-sans">
        <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>

        {selectedReservation ? (
          <>
            <h2 className="text-xl mt-4">Detalhes da Reserva:</h2>

            <div className="flex gap-4 mb-4">
              {/* Caixinha de Reservas */}
              <div className="flex-1 border border-gray-300 p-4 rounded-md shadow">
                <h3 className="font-semibold text-lg">Reservas:</h3>
                <div className="border border-gray-300 p-2 mb-2 rounded-md">
                  <p>
                    <strong>Número da Reserva:</strong>{" "}
                    {selectedReservation.ReservationNumber}
                  </p>
                  <p>
                    <strong>Número da Reserva de Booking:</strong>{" "}
                    {selectedReservation.BookingNumber}
                  </p>
                  <p>
                    <strong>Data de Check-In:</strong>{" "}
                    {selectedReservation.DateCI}
                  </p>
                  <p>
                    <strong>Data de Check-Out:</strong>{" "}
                    {selectedReservation.DateCO}
                  </p>
                  <p>
                    <strong>Número do Quarto:</strong>{" "}
                    {selectedReservation.RoomNumber}
                  </p>
                  <p>
                    <strong>Nome do Usuário:</strong>{" "}
                    {selectedReservation.UserName}
                  </p>
                </div>
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
              </div>
            </div>

            {/* Outros detalhes, como Itens, Impostos, Totais */}
            {/* Similar à parte já existente no seu código */}
          </>
        ) : (
          <p className="text-gray-500">
            Selecione uma reserva na sidebar para visualizar os detalhes.
          </p>
        )}
      </main>
    </div>
  );
};

export default Page;
