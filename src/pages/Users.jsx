import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dashboard from '../components/Dashboard';
import UsersTable from '../components/UsersTable';


const CreateUserForm = ({ onCreate, editingProduct: editingUser, onCancelEdit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
}

useEffect (() => {
  if(editingProduct) {
    setName(editingProduct.name);
    setAddress(editingProduct.address);
    setRole(editingProduct.role);
  }
}, [editingProduct]);

const Users = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Por favor, selecciona un rol válido");
      return;
    }

    console.log('Datos enviados:', { name, address, password, role }); 

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, address: address, password: password, role: role }),
      });

      if (response.ok) {
        alert('Usuario registrado con éxito');
      } else {
        alert('Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default SignUp;
