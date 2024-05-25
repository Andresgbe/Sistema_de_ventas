import { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home.jsx";
import "./App.css";

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
      {isAuthenticated && <div>aaaaaaaaaaa</div>}
      <div className="App">
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
      </div>
    </Router>
  );
};

export default App;
