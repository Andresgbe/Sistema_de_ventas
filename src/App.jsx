import { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home.jsx";
import "./App.css";
import Products from "./pages/Products.jsx";
import Providers from "./pages/Providers.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = ({ email, password }) => {
    if (email === "admin@admin.com" && password === "123") {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
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
        {isAuthenticated ? <Products /> : <Redirect to="/" />}
      </Route>
      <Route path="/providers">
        {isAuthenticated ? <Providers /> : <Redirect to="/" />}
      </Route>
    </Router>
  );
};

export default App;

/*      <Route path="/products">
        {isAuthenticated ? <Products /> : <Redirect to="/" />}
      </Route>*/
