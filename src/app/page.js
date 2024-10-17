"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrView } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import nextSession from "next-session";

const Page = () => {
  const [getJsons, setGetJsons] = useState([]); // Estado para armazenar os dados da API
  const [filter, setFilter] = useState("pendentes"); // Estado para gerenciar o filtro
  const [propertyID, setPropertyID] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/get_user_name"); // Fetch user name from API
        setPropertyID(response.data.propertyID); // Salva o entityID do usuário
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  // Função para buscar os dados da API
  const getDataJsons = async () => {
    try {
      const response = await axios.get("/api/get_jsons");
      setGetJsons(response.data.response); // Aqui você salva os dados da API
    } catch (error) {
      console.error("Erro ao buscar os dados da API", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout"); // Faz uma requisição para a rota de logout

      if (response.status === 200) {
        // Se o logout for bem-sucedido, redireciona para a página de login ou home
        window.location.href = "/login"; // Redireciona para a página de login
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Usando useEffect para buscar os dados ao montar o componente
  useEffect(() => {
    getDataJsons(); // Chama a função uma vez ao montar

    // Define o intervalo para atualizar a lista a cada 5 segundos
    const interval = setInterval(getDataJsons, 5000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  // Filtra os dados com base no filtro selecionado e no entityID do usuário
  const filteredJsons = getJsons.filter(
    (json) =>
      json.propertyID === propertyID &&
      (filter === "vistos" ? json.seen : !json.seen)
  );

  // Função para marcar como "seen" e abrir a nova página
  const handleCardClick = (json) => {
    localStorage.setItem("recordID", json.requestID);
    window.location.href = "/homepages/jsonView";
  };

  return (
    <div className="min-h-screen flex w-full">
      <div className="w-1/6 h-screen fixed bg-white shadow-md flex flex-col">
        <div className="flex-1">
          {/* Aqui você pode adicionar outros botões ou conteúdo no topo da sidebar */}
        </div>

        {/* Botão de Logout na parte inferior */}
        <button
          className="flex items-center gap-2 text-lg mb-4 pl-8"
          onClick={handleLogout}
        >
          <FiLogOut size={20} color="gray-900" /> Logout
        </button>
      </div>

      {/* Conteúdo principal com os registros de reservas */}
      <div
        className="flex-1 min-h-screen ml-[16%] p-8 overflow-y-auto"
        style={{ backgroundColor: "#F0F1EC" }}
      >
        <h2 className="font-semibold text-2xl mb-4">Statements</h2>

        <button
          className={`mb-4 p-2 text-left font-bold rounded-lg ${
            filter === "pendentes" ? "text-white" : "bg-white border"
          }`}
          style={{
            backgroundColor: filter === "pendentes" ? "#2E615C" : "",
            borderColor: filter !== "pendentes" ? "lightgray" : "", // Aplica a borda ao botão não pressionado
            borderWidth: filter !== "pendentes" ? "2px" : "0px", // Ajusta a espessura da borda
          }}
          onClick={() => setFilter("pendentes")}
        >
          Pendentes
        </button>

        <button
          className={`mb-4 ml-4 p-2 text-left font-bold rounded-lg ${
            filter === "vistos" ? "text-white" : "bg-white border"
          }`}
          style={{
            backgroundColor: filter === "vistos" ? "#2E615C" : "",
            borderColor: filter !== "vistos" ? "lightgray" : "",
            borderWidth: filter !== "vistos" ? "2px" : "0px",
          }}
          onClick={() => setFilter("vistos")}
        >
          Vistos
        </button>

        {/* Exibe os registros de reservas filtrados e ordenados do mais recente para o mais antigo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredJsons.length > 0 ? (
            filteredJsons
              .sort(
                (a, b) =>
                  new Date(b.requestDateTime) - new Date(a.requestDateTime)
              ) // Ordena do mais recente para o mais antigo
              .map((json, index) => {
                const reservation = JSON.parse(json.requestBody).Reservation[0]; // Pega a primeira reserva de cada `requestBody`
                const reservationtotal = JSON.parse(json.requestBody)
                  .DocumentTotals[0]; // Pega a primeira reserva de cada `requestBody`

                return (
                  <div
                    key={index}
                    className="relative bg-white p-4 rounded-lg shadow-md flex items-center justify-center h-72"
                  >
                    {/* Nome do hotel no canto superior esquerdo */}
                    <div className="absolute top-0 left-0 bg-green-200 p-2 rounded-lg mt-2 ml-2">
                      <p className="text-sm font-bold text-gray-700">
                        Nome do Hotel
                      </p>
                    </div>

                    {/* Conteúdo do card */}
                    <div className="flex flex-col absolute top-14 left-4">
                      <p className="text-sm text-gray-500">
                        Reservation{" "}
                        <span className="text-xl text-gray-900 font-semibold">
                          {reservation.ReservationNumber}
                        </span>{" "}
                        / Room{" "}
                        <span className="text-xl text-gray-900 font-semibold">
                          {reservation.RoomNumber}
                        </span>
                      </p>
                    </div>

                    <div className="bg-gray-200 h-[1%] w-full -mt-[30%]"></div>

                    <div className="absolute left-4 mt-20 w-full pr-4">
                      {/* Flex container com justify-between para alinhar as datas à direita */}
                      <div className="flex flex-col space-y-2 pr-4">
                        <div className="flex justify-between">
                          <p className="text-sm font-bold">Check-In</p>
                          <span>{reservation.DateCI}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm font-bold">Check-Out</p>
                          <span>{reservation.DateCO}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm font-bold">Balance</p>
                          <span>€{reservationtotal.Total}</span>
                        </div>
                      </div>
                      {/* {botao} */}
                      <div className="flex justify-center mt-5 pr-4">
                        <button
                          className="w-full pt-3 pb-3 text-sm rounded-lg border-2 flex items-center justify-center gap-2 border-[#2E615C] bg-[#BAE9E4] hover:bg-[#2E615C] hover:text-white transition-colors"
                          onClick={() => handleCardClick(json)}
                        >
                          View Statement{" "}
                          <GrView size={15} color="currentColor" />{" "}
                          {/* Usar currentColor */}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500">Nenhuma reserva disponível</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
