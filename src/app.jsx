import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Login from './auth/Login';
import './styles/App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    // Aquí deberías agregar la lógica para autenticar al usuario.
    // Por ahora, simplemente aceptamos cualquier combinación de usuario y contraseña.
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <Header />
            <Sidebar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;