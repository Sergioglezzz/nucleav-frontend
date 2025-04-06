'use client';

import Navbar from '@/components/Navbar';
import ColumnLayout from '@/components/ColumnLayout';
import { List, ListItem, ListItemButton, ListItemContent, Typography, Card } from '@mui/joy';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api'; // Asegúrate de tener este cliente axios configurado

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulamos una petición de usuarios
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users'); // API real
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users', error);
        // Carga unos usuarios dummy de ejemplo:
        setUsers([
          { id: 1, username: 'john', email: 'john@example.com', role: 'admin' },
          { id: 2, username: 'sara', email: 'sara@example.com', role: 'user' },
          { id: 3, username: 'mike', email: 'mike@example.com', role: 'user' },
        ]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <ColumnLayout>
        <Typography level="h2" mb={2}>
          Usuarios registrados
        </Typography>

        <Card variant="outlined" sx={{ p: 2 }}>
          <List>
            {users.map((user) => (
              <ListItem key={user.id}>
                <ListItemButton>
                  <ListItemContent>
                    <Typography level="body-md">
                      <b>ID:</b> {user.id} - <b>Username:</b> {user.username} - <b>Email:</b> {user.email} - <b>Rol:</b> {user.role}
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Card>
      </ColumnLayout>
    </>
  );
}
