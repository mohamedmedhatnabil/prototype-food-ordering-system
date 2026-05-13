import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Image,
  ImageWrapper,
  Title,
  Price,
  AddButton
} from "../foodcard/styles";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const FoodCard = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const productName = language === "ar" ? item.name_ar : item.name_en;

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = await addToCart(item);
      if (!saved) {
        setError(t("error", "Unable to add item. Please try again."));
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      setError(err?.message || t("error", "Unable to add item. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <ImageWrapper>
        <Image src={item.image} alt={productName} />
      </ImageWrapper>
      <Title>{productName}</Title>
      <Price>{item.price} EGP</Price>
      <AddButton type="button" onClick={handleAddToCart} disabled={loading}>
        {loading
          ? t("adding", "Adding...")
          : user
          ? t("button", "Add to cart")
          : t("loginToAdd", "Login to add")}
      </AddButton>
      {error && <p style={{ color: "#d32f2f", marginTop: "0.75rem" }}>{t("error", error || "Unable to add item. Please try again.")}</p>}
    </Card>
  );
};

export default FoodCard;