import { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = ({ email, password }) => {
    if (email === "admin@admin.com" && password === "123") {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <main>
              <Route path="/" element={<SignIn onLogin={handleLogin} />} />
            </main>
          </>
        ) : (
          <SignIn onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;
