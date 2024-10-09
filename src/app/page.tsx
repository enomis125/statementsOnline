// src/pages/index.js
"use client";
import React, { useState } from "react";

// JSON de exemplo
const data = [
  {
    Reservation: [
      {
        ReservationNumber: 49456,
        BookingNumber: "IVXQBF",
        DateCI: "2024-09-03",
        DateCO: "2024-09-07",
        RoomNumber: "112",
        UserName: "Imported",
      },
    ],
    GuestInfo: [
      {
        Salution: "Mr",
        FirstName: "Ricardo Filipe",
        LastName: "Brito Pereira",
        VatNo: "232853053",
        Country: "Portugal",
        Street: "Teste",
        PostalCode: "4710-411",
        City: "Braga",
      },
    ],
    Items: [
      {
        ID: 408851,
        Date: "2024-09-03",
        Qty: 1,
        Description: "*Alojamento",
        Description2: "03.09.24",
        UnitPrice: 10.0,
        Total: 10.0,
      },
      {
        ID: 408852,
        Date: "2024-09-03",
        Qty: 2,
        Description: "*Rest Comidas 13%",
        Description2: "03.09.24",
        UnitPrice: 32.5,
        Total: 65.0,
      },
    ],
    Taxes: [
      {
        ID: 2,
        Taxes: 6.0,
        TotalWithTaxes: 427.5,
        TotalWithOutTaxes: 403.3,
        TotalTaxes: 24.2,
      },
      {
        ID: 4,
        Taxes: 13.0,
        TotalWithTaxes: 265.5,
        TotalWithOutTaxes: 234.96,
        TotalTaxes: 30.54,
      },
    ],
    DocumentTotals: [
      {
        Total: 693.0,
        Balance: 693.0,
        Payment: 0,
      },
    ],
  },
];

const HomePage = () => {
  // Extraindo dados do JSON
  const reservation = data[0].Reservation[0];
  const guestInfo = data[0].GuestInfo[0];
  const items = data[0].Items;
  const total = data[0].DocumentTotals[0].Total;

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px", // Largura fixa da sidebar
          backgroundColor: "#f0f0f0",
          padding: "20px",
        }}
      >
        <h2>Sidebar</h2>
        <div style={{ marginBottom: "20px" }}>
          <h3>Pendentes</h3>
          <ul>
            <li>Tarefa 1</li>
            <li>Tarefa 2</li>
            <li>Tarefa 3</li>
          </ul>
        </div>
        <div>
          <h3>Visto</h3>
          <ul>
            <li>Tarefa A</li>
            <li>Tarefa B</li>
          </ul>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Bem-vindo à Página Inicial</h1>

        {/* Exibindo informações da reserva */}
        <h2>Informações da Reserva</h2>
        <p>
          <strong>Número da Reserva:</strong> {reservation.ReservationNumber}
        </p>
        <p>
          <strong>Número da Reserva:</strong> {reservation.BookingNumber}
        </p>
        <p>
          <strong>Data de Check-in:</strong> {reservation.DateCI}
        </p>
        <p>
          <strong>Data de Check-out:</strong> {reservation.DateCO}
        </p>
        <p>
          <strong>Número do Quarto:</strong> {reservation.RoomNumber}
        </p>
        <p>
          <strong>Nome do Usuário:</strong> {reservation.UserName}
        </p>

        {/* Exibindo informações do hóspede */}
        <h2>Informações do Hóspede</h2>
        <p>
          <strong>Saudação:</strong> {guestInfo.Salution}
        </p>
        <p>
          <strong>Nome:</strong> {guestInfo.FirstName} {guestInfo.LastName}
        </p>
        <p>
          <strong>NIF:</strong> {guestInfo.VatNo}
        </p>
        <p>
          <strong>País:</strong> {guestInfo.Country}
        </p>
        <p>
          <strong>Endereço:</strong> {guestInfo.Street}, {guestInfo.PostalCode},{" "}
          {guestInfo.City}
        </p>

        {/* Exibindo itens da reserva */}
        <h2>Itens da Reserva</h2>
        <ul>
          {items.map((item) => (
            <li key={item.ID}>
              {item.Description} (Quantidade: {item.Qty}, Total:{" "}
              {item.Total.toFixed(2)}€)
            </li>
          ))}
        </ul>

        {/* Exibindo total */}
        <h2>Total da Reserva</h2>
        <p>
          <strong>Total:</strong> {total.toFixed(2)}€
        </p>
      </div>
    </div>
  );
};

export default HomePage;
