import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ProductsTable from "../components/ProductsTable";
import Dashboard from "../components/Dashboard";

const Products = () => (
  <div>
    <Dashboard>
      <Grid container spacing={12}>
        {/* Products table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <ProductsTable />
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  </div>
);

export default Products;
