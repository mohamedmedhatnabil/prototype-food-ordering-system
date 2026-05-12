import { useState, useEffect } from "react";
import styled from "styled-components";

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

const Brand = styled.a`
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
  background: ${props => (props.active ? "rgba(255, 255, 255, 0.95)" : "transparent")};
  color: ${props => (props.active ? "#ff6b6b" : "white")};
  font-weight: 600;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.85);
    color: #ff6b6b;
  }
`;

const LoginButton = styled.a`
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

function Header() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <NavBar>
      <Container>
        <Brand href="/">Foodie Hub</Brand>
        <Actions>
          <LanguageSwitcher>
            <LangButton active={language === "en"} type="button" onClick={() => setLanguage("en")}>
              EN
            </LangButton>
            <LangButton active={language === "ar"} type="button" onClick={() => setLanguage("ar")}>
              AR
            </LangButton>
          </LanguageSwitcher>
          <LoginButton href="#login">Login</LoginButton>
        </Actions>
      </Container>
    </NavBar>
  );
}

export default Header;
