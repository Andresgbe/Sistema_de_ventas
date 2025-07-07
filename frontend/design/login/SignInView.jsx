import { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
//import { useAuth } from "../components/AuthContext";

// Estilos personalizados
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = () => {
  const classes = useStyles(); // Inicializar `classes`
  const [correo, setCorreo] = useState(""); 
  const [contraseña, setContraseña] = useState(""); 
  const [error, setError] = useState(""); 
  /*const { setIsAuthenticated, setUserRole } = useAuth();*/

  // Manejadores de cambio de input
  const handleEmailChange = (e) => setCorreo(e.target.value);
  const handlePasswordChange = (e) => setContraseña(e.target.value);

  // Función para manejar el inicio de sesión
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

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);

      // Actualizar el estado global con la autenticación y el rol
      /*setIsAuthenticated(true);
      setUserRole(data.role); */

      alert("Inicio de sesión exitoso");
      // redirigir a otra página o actualizar estado global
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema al iniciar sesión");
    }
  };

  // Renderizado del formulario de inicio de sesión
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {/* Icono de usuario */}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          {/* Título del formulario */}
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          {/* Formulario de inicio de sesión */}
          <form className={classes.form} noValidate>
            {/* Campo para el correo electrónico */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange}
            />
            {/* Campo para la contraseña */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePasswordChange}
            />
            {/* Checkbox para recordar usuario */}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
            />
            {/* Mensaje de error si las credenciales son incorrectas */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            {/* Botón para enviar el formulario */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
            {/* Enlaces para recuperar contraseña o registrarse */}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"No posees cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}></Box>
      </Container>
    </div>
  );
};

export default SignIn;
