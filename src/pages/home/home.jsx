import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import FoodCard from "../../components/foodcard/FoodCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No products found</p>;
  return (
    <div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {products.map((product) => (
          <FoodCard key={product.id} item={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;