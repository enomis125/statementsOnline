"use client";
import React, {useState, useEffect} from "react";

const Page = () => {
  const [getJsons, setGetJsons] = useState([]);
  const [propertyID, setPropertyID] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/get_user_name"); // Fetch user name from API
        const userPropertyID = response.data.propertyID;

        if (!userPropertyID) {
          // If no propertyID is found, redirect to login
          window.location.href = "/login";
        } else {
          setPropertyID(userPropertyID); // Save the entityID
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        // On error, also redirect to login
        window.location.href = "/login";
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

  // Filtragem baseada no tipo de página
  const isPendentesPage = true; // Defina isso com base no nome da sua página
  const filteredJsons = getJsons.filter(
    (json) =>
      json.propertyID === propertyID &&
      (isPendentesPage ? !json.seen : json.seen) // Lógica de filtragem
  );

  return (
    <div className="min-h-screen flex">
      <main
        className="flex-1 min-h-screen p-8 overflow-y-auto"
        style={{ backgroundColor: "#EBEBEB" }}
      >
        <h2 className="font-semibold text-2xl mb-4">Statements</h2>

        <div>
          <p>dashboard de pendentes e vistos</p>
        </div>
      </main>
    </div>
  );
};

export default Page;
