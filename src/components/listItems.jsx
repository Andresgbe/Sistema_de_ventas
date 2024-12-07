import * as React from "react";
import { styled } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

const ButtonLink = styled("a")(() => ({
  textDecoration: "none",
  color: "inherit",
}));

export const mainListItems = (
  <React.Fragment>
    <ButtonLink href="/products">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Productos" />
      </ListItemButton>
    </ButtonLink>
    <ButtonLink href="/providers">
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Proveedores" />
      </ListItemButton>
    </ButtonLink>
    <ButtonLink href="/sells">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Ventas" />
      </ListItemButton>
    </ButtonLink>
    <ButtonLink href="/purchases">
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Compras" />
      </ListItemButton>
    </ButtonLink>
    <ButtonLink href="/users">
      <ListItemButton>
        <ListItemText primary="Usuarios" />
      </ListItemButton>
    </ButtonLink>
  </React.Fragment>
);
