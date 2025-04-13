'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ColumnLayout from '@/components/ColumnLayout';
import { api } from '@/utils/api'; // Asegúrate que api tiene baseURL correcto
import { Typography, Card, List, ListItem, ListItemButton, ListItemContent, CircularProgress, Alert } from '@mui/joy';

interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<User[]>('/v1/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users', error);
        setError('Error al cargar los usuarios.');
      } finally {
        setLoading(false);
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

        {loading ? (
          <CircularProgress size="lg" />
        ) : error ? (
          <Alert color="danger">{error}</Alert>
        ) : (
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
        )}
      </ColumnLayout>
    </>
  );
}
