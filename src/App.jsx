import { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SignIn from "../frontend/design/login/SignInView.jsx";
// import SignIn from "./components/SignInView.jsx";
import Home from "../frontend/design/principal/Home.jsx";
//import Products from "./pages/Products.jsx";
//import Providers from "./pages/Providers.jsx";
//import Sales from "./pages/Sales.jsx";
import ClientsPage from "../frontend/views/clientfront/ClientsPage.jsx"
//import Users from "./pages/Users.jsx";
import { AuthProvider, useAuth } from "../frontend/design/login/AuthContext.jsx";



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || "Credenciales incorrectas");
        return;
      }
  
      // Actualizar el estado global
      setIsAuthenticated(true); // Indicar que el usuario está autenticado
      setUserRole(data.role); // Asignar el rol del usuario devuelto por el backend
  
      alert("Inicio de sesión exitoso");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema al iniciar sesión");
    }
  };

  return (
    <AuthProvider>
    <Router>
      <Route exact path="/">
        {isAuthenticated ? (
          <Redirect to="/home" />
        ) : (
          <SignIn onLogin={handleLogin} />
        )}
      </Route>
      <Route path="/home">
        {isAuthenticated ? <Home /> : <Redirect to="/" />}
      </Route>
      <Route path="/products">
        {/*isAuthenticated ? <Products /> : <Redirect to="/" />*/}
      </Route>
      <Route path="/providers">
        {/*isAuthenticated ? <Providers /> : <Redirect to="/" />*/}
      </Route>
      <Route path="/sells">
        {/*isAuthenticated ? <Sales /> : <Redirect to="/" />*/}
      </Route>
      <Route path="/clients">
        {isAuthenticated ? <ClientsPage /> : <Redirect to="/" />}
      </Route>
      <Route path="/users">
        {/*isAuthenticated ? <Users /> : <Redirect to="/" />*/}
      </Route>
    </Router>
    </AuthProvider>
  );
};

export default App;
