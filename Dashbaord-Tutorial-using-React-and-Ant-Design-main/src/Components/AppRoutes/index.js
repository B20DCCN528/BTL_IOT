import {Route, Routes } from "react-router-dom";
import Information from "../../Pages/Information";
import Dashboard from "../../Pages/Dashboard";
import Inventory from "../../Pages/Inventory";
import Orders from "../../Pages/Orders";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/inventory" element={<Inventory />}></Route>
      <Route path="/orders" element={<Orders />}></Route>
      <Route path="/information" element={<Information />}></Route>
    </Routes>
  );
}
export default AppRoutes;
