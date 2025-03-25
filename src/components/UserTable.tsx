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
    // La URL se configura mediante la variable de entorno NEXT_PUBLIC_API_URL
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemContent />
            {`ID: ${user.id}`}
            {`Nombre: ${user.name}, Email: ${user.email}`}
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
