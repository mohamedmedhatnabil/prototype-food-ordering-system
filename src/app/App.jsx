// App.jsx
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageProvider";

// Separate component so useLocation works inside BrowserRouter
function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;