// src/app/page.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation'; // Importa o hook useRouter

const Page = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || "pendentes";
  const [getJsons, setGetJsons] = useState([]);
  const [propertyID, setPropertyID] = useState("");
  const router = useRouter(); // Hook para navegação

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/get_user_name");
        setPropertyID(response.data.propertyID);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  const getDataJsons = async () => {
    try {
      const response = await axios.get("/api/get_jsons");
      setGetJsons(response.data.response);
    } catch (error) {
      console.error("Erro ao buscar os dados da API", error);
    }
  };

  useEffect(() => {
    getDataJsons();
    const interval = setInterval(getDataJsons, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredJsons = getJsons.filter(
    (json) =>
      json.propertyID === propertyID &&
      (filter === "vistos" ? json.seen : !json.seen)
  );

  const handleCardClick = (json) => {
    localStorage.setItem("recordID", json.requestID);
    // Muda aqui: use router.push para navegar
    router.push("/homepages/jsonView"); 
  };

  return (
    <div className="min-h-screen flex">
      <main
        className="flex-1 min-h-screen p-8 overflow-y-auto"
        style={{ backgroundColor: "#EBEBEB" }}
      >
        <h2 className="font-semibold text-2xl mb-4">
          Statements - {filter === "pendentes" ? "Pendentes" : "Vistos"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredJsons.length > 0 ? (
            filteredJsons
              .sort(
                (a, b) => new Date(b.requestDateTime) - new Date(a.requestDateTime)
              )
              .map((json, index) => {
                const reservation = JSON.parse(json.requestBody).Reservation[0];
                const guestInfo = JSON.parse(json.requestBody).GuestInfo[0];

                return (
                  <div
                    key={index}
                    className="relative bg-white p-4 rounded-lg shadow-md flex items-center justify-center h-64"
                  >
                    <div className="flex flex-row">
                      <div className="absolute top-0 left-0 p-2 rounded-lg mt-2 ml-2">
                        <p className="text-sm font-bold text-gray-700">Nome do Hotel</p>
                      </div>

                      <div className="absolute top-0 right-0 mr-1 mt-1">
                        <p className="flex flex-col">
                          <span className="text-5xl font-semibold text-center text-white bg-[#BAE9E4] rounded-lg">
                            <span className="text-4xl">#</span>
                            {reservation.RoomNumber}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col absolute top-12 left-4">
                      <p className="text-sm text-gray-500">
                        <span className="text-lg text-gray-900 font-semibold">
                          {guestInfo.Salutation}. {guestInfo.LastName}
                        </span>
                      </p>
                    </div>

                    <div className="bg-gray-200 h-[1%] w-full -mt-[20%]"></div>

                    <div className="absolute left-4 mt-20 w-full pr-4">
                      <div className="flex flex-col space-y-2 pr-4">
                        <div className="flex justify-between mt-10">
                          <p className="text-sm font-bold">Reservation Number</p>
                          <span>{reservation.ReservationNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm font-bold">Check-In</p>
                          <span>{reservation.DateCI}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm font-bold">Check-Out</p>
                          <span>{reservation.DateCO}</span>
                        </div>
                      </div>
                      <div className="flex justify-center mt-5 pr-4 pb-4">
                        <button
                          className="w-full pt-1 pb-1 text-sm rounded-lg border-2 flex items-center justify-center gap-2 border-gray-300 bg-[#BAE9E4] hover:bg-[#2E615C] hover:text-white transition-colors"
                          onClick={() => handleCardClick(json)}
                        >
                          View Statement
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
      </main>
    </div>
  );
};

export default Page;
