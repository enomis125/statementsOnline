"use client";
import React, {useEffect} from "react";

const Page = () => {

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
