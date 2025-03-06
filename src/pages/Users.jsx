import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dashboard from '../components/Dashboard';
import UsersTable from '../components/UsersTable';


const CreateUserForm = ({ onCreate, editingUser, onCancelEdit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState('');


  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setAddress(editingUser.address);
      setRole(editingUser.role);
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación de campos obligatorios
    if (!name || !address || !role || !password) {
      alert("Todos los campos son obligatorios.");
      return;
    }
  
    if (editingUser) {
      // Si se está editando un usuario
      onCreate({ id: editingUser.id, name, password, address, role });
    } else {
      // Si se está creando un nuevo usuario
      onCreate({ name, address, password, role });
    }
  
    // Restablecer campos del formulario
    setName('');
    setAddress('');
    setRole('');
    setPassword(''); // Asegúrate de llamar a setPassword aquí
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Correo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rol"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
          {/*Botón de cancelar*/}
          <Button
            type="button"
            variant="text"
            color="primary"
            onClick={onCancelEdit}
            style={{ marginLeft: "10px" }} // Separación entre botones
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const Users = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (newUser) => {
    if (newUser.id) {
      // Actualización de usuario existente
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${newUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }
        );
  
        if (!response.ok) {
          throw new Error("Error al actualizar el usuario");
        }
  
        console.log("Usuario actualizado exitosamente");
        fetchUsers();
        setEditingUser(null);
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
    } else {
      // Creación de nuevo usuario
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser), // Asegúrate de incluir role_id si es necesario
        });
  
        if (!response.ok) {
          throw new Error("Error al agregar el usuario al backend");
        }
  
        console.log("Usuario creado exitosamente");
        fetchUsers();
      } catch (error) {
        console.error("Error al agregar usuario:", error);
      }
    }
  
    setShowForm(false);
  };
  
  

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  return (
    <div>
      <Dashboard>
        <Grid container spacing={2}>
          {/* Botón para crear un nuevo producto */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            {!showForm && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingUser(null);
                }}
              >
                Crear nuevo usuario
              </Button>
            )}
          </Grid>

          {/* Mostrar formulario si showForm es true */}
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateUserForm
                  onCreate={handleCreateUser}
                  editingUser={editingUser}
                  onCancelEdit={() => {
                    setEditingUser(null);
                    setShowForm(false);
                  }}
                />
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <div>Cargando usuarios...</div>
              ) : (
                <UsersTable users={users} onEdit={handleEditUser} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Users;