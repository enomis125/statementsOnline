'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
  const [getJsons, setGetJsons] = useState([]); // Estado para armazenar os dados da API
  const [filter, setFilter] = useState('pendentes'); // Estado para gerenciar o filtro

  // Função para buscar os dados da API
  const getDataJsons = async () => {
    try {
      const response = await axios.get("/api/get_jsons");
      setGetJsons(response.data.response); // Aqui você salva os dados da API
    } catch (error) {
      console.error("Erro ao buscar os dados da API", error);
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

  // Filtra os dados com base no filtro selecionado
  const filteredJsons = getJsons.filter(json =>
    filter === 'vistos' ? json.seen : !json.seen
  );

  // Função para marcar como "seen" e abrir a nova página
  const handleCardClick = async (json) => {
    try {
      // Chama a API PATCH para atualizar o campo `seen`
      await axios.patch(`/api/get_jsons/${json.requestID}`);

      // Armazena apenas o ID no localStorage
      localStorage.setItem('recordID', json.requestID);

      // Navega para a nova página
      window.location.href = '/homepages/jsonView';
    } catch (error) {
      console.error('Erro ao marcar como visto:', error);
    }
  };

  return (
    <div className="flex p-6">
      {/* Sidebar com os botões de filtro */}
      <div className="w-1/6 mr-4">
  <button
    className={`block w-full h-[15%] mb-2 p-5 text-left font-bold rounded-lg ${filter === 'pendentes' ? 'text-white' : 'bg-white border'}`}
    style={{
      backgroundColor: filter === 'pendentes' ? '#003366' : '',
      borderColor: filter !== 'pendentes' ? 'lighgray' : '', // Aplica a borda ao botão não pressionado
      borderWidth: filter !== 'pendentes' ? '2px' : '0px' // Ajusta a espessura da borda
    }}
    onClick={() => setFilter('pendentes')}
  >
    Pendentes
  </button>

  <button
    className={`block w-full h-[15%] mb-2 p-5 text-left font-bold rounded-lg ${filter === 'vistos' ? 'text-white' : 'bg-white border'}`}
    style={{
      backgroundColor: filter === 'vistos' ? '#003366' : '',
      borderColor: filter !== 'vistos' ? 'lighgray' : '',
      borderWidth: filter !== 'vistos' ? '2px' : '0px'
    }}
    onClick={() => setFilter('vistos')}
  >
    Vistos
  </button>
</div>
      {/* Conteúdo principal com os registros de reservas */}
      <div className="w-5/6">
        {/* <h1 className="text-2xl font-bold mb-6">Lista de Reservas</h1> */}
        {/* Exibe os registros de reservas filtrados e ordenados do mais recente para o mais antigo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Ajustando a grade para ser responsiva */}
          {filteredJsons.length > 0 ? (
            filteredJsons
              .sort((a, b) => new Date(b.requestDateTime) - new Date(a.requestDateTime)) // Ordena do mais recente para o mais antigo
              .map((json, index) => {
                const reservation = JSON.parse(json.requestBody).Reservation[0]; // Pega a primeira reserva de cada `requestBody`
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer h-48" // Altura fixa para manter os cards quadrados
                    onClick={() => handleCardClick(json)} // Chama a função ao clicar no card
                  >
                    <div className="flex flex-col justify-center text-center">
                      <p className="text-sm text-gray-500 mb-2">Reservation Number</p>
                      <p className="text-3xl text-gray-600 font-semibold">
                        {reservation.ReservationNumber}
                      </p>
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
