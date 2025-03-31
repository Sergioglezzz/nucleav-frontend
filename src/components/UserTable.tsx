import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemContent, Card } from "@mui/joy";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error en la petición:", err));
  }, []);
  

  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemContent>
              {`ID: ${user.id} - Nombre: ${user.name}, Email: ${user.email}`}
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
