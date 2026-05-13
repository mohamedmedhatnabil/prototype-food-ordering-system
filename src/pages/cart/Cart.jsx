import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { placeOrder } from "../../services/orderService";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product_price,
    0
  );

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      await placeOrder(user.id, paymentMethod);
      setOrderSuccess(true);
      if (clearCart) clearCart();
    } catch (err) {
      console.error("Checkout failed:", err);
      setCheckoutError(err.message || "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={styles.successWrapper}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>🎉</div>
          <h2 style={styles.successTitle}>
            {t("orderSuccess", "Order Placed Successfully!")}
          </h2>
          <p style={styles.successSub}>
            {paymentMethod === "cash"
              ? t("cashNote", "You selected Cash on Delivery. Pay when your order arrives.")
              : t("onlineNote", "You selected Online Payment. Our team will contact you shortly.")}
          </p>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            {t("backToMenu", "Back to Menu")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>{t("cartTitle", "My Cart")}</h1>

      {cartItems.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🛒</div>
          <p style={styles.emptyText}>
            {t("cartEmpty", "Your cart is empty. Add some items!")}
          </p>
          <button style={styles.browseBtn} onClick={() => navigate("/")}>
            {t("browseMenu", "Browse Menu")}
          </button>
        </div>
      ) : (
        <div style={styles.layout}>
          {/* Items List */}
          <div style={styles.itemsList}>
            {cartItems.map((item) => {
              const name = language === "ar" ? item.product_name_ar : item.product_name;
              return (
                <div key={item.id} style={styles.itemCard}>
                  <img
                    src={item.image}
                    alt={name}
                    style={styles.itemImage}
                  />
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{name || item.product_name}</h3>
                    <p style={styles.itemQty}>
                      {t("quantity", "Qty:")} {item.quantity}
                    </p>
                  </div>
                  <div style={styles.itemPrice}>
                    {(item.product_price * item.quantity).toFixed(2)}{" "}
                    {t("currency", "EGP")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>{t("orderSummary", "Order Summary")}</h2>

            <div style={styles.summaryRow}>
              <span>{t("subtotal", "Subtotal")}</span>
              <span>{total.toFixed(2)} {t("currency", "EGP")}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>{t("delivery", "Delivery")}</span>
              <span style={{ color: "#4caf50" }}>{t("free", "Free")}</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>{t("total", "Total")}</span>
              <span>{total.toFixed(2)} {t("currency", "EGP")}</span>
            </div>

            {/* Payment Method */}
            <div style={styles.paymentSection}>
              <h3 style={styles.paymentTitle}>{t("paymentMethod", "Payment Method")}</h3>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  style={styles.radio}
                />
                <span style={styles.radioIcon}>💵</span>
                <div>
                  <div style={styles.radioText}>{t("cashOnDelivery", "Cash on Delivery")}</div>
                  <div style={styles.radioSub}>{t("cashSub", "Pay when your order arrives")}</div>
                </div>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  style={styles.radio}
                />
                <span style={styles.radioIcon}>💳</span>
                <div>
                  <div style={styles.radioText}>{t("onlinePayment", "Online Payment")}</div>
                  <div style={styles.radioSub}>{t("onlineSub", "Credit / Debit card")}</div>
                </div>
              </label>
            </div>

            {checkoutError && (
              <p style={styles.errorText}>{checkoutError}</p>
            )}

            <button
              style={{
                ...styles.checkoutBtn,
                opacity: checkoutLoading ? 0.7 : 1,
                cursor: checkoutLoading ? "not-allowed" : "pointer",
              }}
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading
                ? t("placingOrder", "Placing Order...")
                : t("placeOrder", "Place Order")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 1100,
    margin: "2rem auto",
    padding: "0 1.5rem",
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#1a1a1a",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "2rem",
    alignItems: "start",
  },
  itemsList: {
    display: "grid",
    gap: "1rem",
  },
  itemCard: {
    display: "grid",
    gridTemplateColumns: "100px 1fr auto",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  itemImage: {
    width: "100px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  itemName: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  itemQty: {
    margin: 0,
    color: "#888",
    fontSize: "0.9rem",
  },
  itemPrice: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#ff7f50",
    whiteSpace: "nowrap",
  },
  summary: {
    background: "#fff",
    borderRadius: "20px",
    padding: "1.5rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    position: "sticky",
    top: "1rem",
  },
  summaryTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#1a1a1a",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f5f5f5",
    fontSize: "0.95rem",
    color: "#555",
  },
  totalRow: {
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "#1a1a1a",
    borderBottom: "none",
    marginTop: "0.25rem",
  },
  paymentSection: {
    marginTop: "1.25rem",
  },
  paymentTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "#1a1a1a",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.9rem",
    borderRadius: "12px",
    border: "2px solid #f0f0f0",
    cursor: "pointer",
    marginBottom: "0.6rem",
    transition: "border-color 0.2s",
  },
  radio: {
    accentColor: "#ff7f50",
    width: "16px",
    height: "16px",
  },
  radioIcon: {
    fontSize: "1.3rem",
  },
  radioText: {
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "#1a1a1a",
  },
  radioSub: {
    fontSize: "0.78rem",
    color: "#999",
    marginTop: "2px",
  },
  checkoutBtn: {
    width: "100%",
    marginTop: "1.25rem",
    background: "linear-gradient(135deg, #ff7f50, #ff9a76)",
    color: "white",
    border: "none",
    padding: "1rem",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "1rem",
    boxShadow: "0 8px 24px rgba(255,127,80,0.3)",
    transition: "transform 0.2s",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "0.9rem",
    marginTop: "0.75rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  emptyText: {
    color: "#888",
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  },
  browseBtn: {
    background: "linear-gradient(135deg, #ff7f50, #ff9a76)",
    color: "white",
    border: "none",
    padding: "0.9rem 2rem",
    borderRadius: "999px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "1rem",
  },
  successWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "2rem",
  },
  successCard: {
    textAlign: "center",
    background: "#fff",
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    maxWidth: 480,
    width: "100%",
  },
  successIcon: {
    fontSize: "3.5rem",
    marginBottom: "1rem",
  },
  successTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "0.75rem",
  },
  successSub: {
    color: "#777",
    fontSize: "0.95rem",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },
  backBtn: {
    background: "linear-gradient(135deg, #ff7f50, #ff9a76)",
    color: "white",
    border: "none",
    padding: "0.9rem 2.5rem",
    borderRadius: "999px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Cart;