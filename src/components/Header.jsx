import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

import { signOut } from "../services/supabaseAuth";

const NavBar = styled.header`
  width: 100%;
  background: linear-gradient(135deg, #ff7f50, #ff9a76);
  padding: 1rem 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

const Brand = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
    margin-top: 0.75rem;
  }
`;

const LanguageSwitcher = styled.div`
  display: inline-flex;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
`;

const LangButton = styled.button`
  border: none;
  background: ${(props) =>
    props.$active ? "rgba(255, 255, 255, 0.95)" : "transparent"};
  color: ${(props) => (props.$active ? "#ff6b6b" : "white")};
  font-weight: 600;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.85);
    color: #ff6b6b;
  }
`;

const LoginButton = styled(Link)`
  color: #ff6b6b;
  background: white;
  text-decoration: none;
  padding: 0.75rem 1.4rem;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(255, 127, 80, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 34px rgba(255, 127, 80, 0.32);
  }
`;

const CartButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.28);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffeb3b;
  color: #333;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  color: white;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

function Header() {


  
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
const { language, setLanguage, t, isLoading } = useLanguage();
console.log("isLoading:", isLoading, "t('brand'):", t("brand"));
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <NavBar>
      <Container>
        <Brand to="/">
          {t("brand")}
        </Brand>

        <Actions>
          <LanguageSwitcher>
            <LangButton
              type="button"
              $active={language === "en"}
              onClick={() => setLanguage("en")}
            >
              EN
            </LangButton>

            <LangButton
              type="button"
              $active={language === "ar"}
              onClick={() => setLanguage("ar")}
            >
              AR
            </LangButton>
          </LanguageSwitcher>

          <CartButton
            type="button"
            aria-label={t("cartAria") || "Cart"}
            onClick={() => navigate("/cart")}
          >
            🛒

            {cartCount > 0 && (
              <CartBadge>{cartCount}</CartBadge>
            )}
          </CartButton>

          {user ? (
            <UserInfo>
              <span>
                {user.user_metadata?.name || user.email}
              </span>

              <LogoutButton onClick={handleLogout}>
                {t("logout") || "Logout"}
              </LogoutButton>
            </UserInfo>
          ) : (
            <LoginButton to="/login">
              {t("login") || "Login"}
            </LoginButton>
          )}
        </Actions>
      </Container>
    </NavBar>
  );
}

export default Header;