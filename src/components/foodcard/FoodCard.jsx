import {
  Card,
  Image,
  Title,
  Price
} from "../foodcard/styles";

const FoodCard = ({ item }) => {
  return (
    <Card>
      <Image src={item.image} alt={item.name_en} />

      <Title>{item.name_en}</Title>

      <Price>{item.price} EGP</Price>
    </Card>
  );
};

export default FoodCard;