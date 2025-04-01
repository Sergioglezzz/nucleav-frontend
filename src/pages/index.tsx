import React from "react";
import UserTable from "../components/UserTable";
import { CssVarsProvider } from "@mui/joy/styles";

export default function Home() {
  return (
    <CssVarsProvider>
      <div style={{ padding: "2rem" }}>
        <h1>Lista de Usuarios</h1>
        <UserTable />
      </div>
    </CssVarsProvider>
  );
}
