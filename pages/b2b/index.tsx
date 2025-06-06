import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import B2BMain from "./b2bMain";
import CustomersManager from "./components/CustomersManager";
import OrderManager from "./components/OrderManager";
import PriceStockManager from "./components/PriceStockManager";
import ProductManager from "./components/ProductManager";
import WalletPanel from "./components/WalletPanel";

const B2BPanelRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<B2BMain />}>
      <Route index element={<Navigate to="products" replace />} />
      <Route path="products" element={<ProductManager />} />
      <Route path="orders" element={<OrderManager />} />
      <Route path="pricing" element={<PriceStockManager />} />
      <Route path="customers" element={<CustomersManager />} />
      <Route path="wallet" element={<WalletPanel />} />
    </Route>
  </Routes>
);

export default B2BPanelRoutes;
