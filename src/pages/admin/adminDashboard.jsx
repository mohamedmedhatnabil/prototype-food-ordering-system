import { useEffect, useState, useContext, useCallback } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  adminGetProducts,
  adminAddProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetStats,
} from "../../services/adminService";
import { AuthContext } from "../../context/AuthContext";

// ─── Global styles (scoped to admin) ─────────────────────────────────────────
const AdminGlobal = createGlobalStyle`
  * { box-sizing: border-box; }
`;

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

// ─── Layout ──────────────────────────────────────────────────────────────────
const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0f0f0f;
  color: #f0ede6;
  font-family: 'DM Sans', system-ui, sans-serif;
`;

const Sidebar = styled.aside`
  width: 220px;
  min-height: 100vh;
  background: #181818;
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
`;

const BrandArea = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BrandIcon = styled.div`
  width: 32px; height: 32px;
  background: #ff7f50;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
`;

const BrandText = styled.div`
  .name { font-size: 15px; font-weight: 600; }
  .sub { font-size: 10px; color: #5e5b54; letter-spacing: 0.5px; text-transform: uppercase; }
`;

const Nav = styled.nav`
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavSection = styled.div`
  font-size: 10px;
  color: #5e5b54;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 10px 10px 6px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: ${p => p.$active ? '#ff7f50' : '#9e9a91'};
  font-size: 13.5px;
  font-weight: ${p => p.$active ? '500' : '400'};
  background: ${p => p.$active ? 'rgba(255,127,80,0.12)' : 'transparent'};
  border: none;
  width: 100%;
  text-align: left;
  transition: all 0.15s;
  font-family: inherit;
  &:hover { background: #222; color: #f0ede6; }
`;

const NavBadge = styled.span`
  margin-left: auto;
  background: #ff7f50;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 99px;
  min-width: 18px;
  text-align: center;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
`;

const Topbar = styled.header`
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #181818;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PageTitle = styled.h1`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #f0ede6;
  margin: 0;
`;

const Content = styled.div`
  padding: 24px 28px;
  flex: 1;
  overflow-y: auto;
  animation: ${fadeIn} 0.2s ease;
`;

// ─── Stats ───────────────────────────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div`
  background: #181818;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
  &:hover { border-color: rgba(255,255,255,0.12); }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #5e5b54;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const StatDelta = styled.div`
  font-size: 12px;
  color: ${p => p.$up ? '#4ade80' : p.$down ? '#f87171' : '#5e5b54'};
  font-weight: 500;
`;

// ─── Panel ───────────────────────────────────────────────────────────────────
const Panel = styled.div`
  background: #181818;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const PanelHead = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const PanelTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f0ede6;
`;

const PanelSub = styled.div`
  font-size: 12px;
  color: #5e5b54;
  margin-top: 2px;
`;

// ─── Buttons ─────────────────────────────────────────────────────────────────
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${p => p.$sm ? '5px 10px' : '8px 14px'};
  border-radius: 8px;
  font-size: ${p => p.$sm ? '12px' : '13px'};
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  font-family: inherit;

  ${p => p.$primary && `
    background: #ff7f50;
    color: white;
    &:hover { background: #ff9a76; }
  `}

  ${p => p.$ghost && `
    background: #222;
    color: #9e9a91;
    border: 1px solid rgba(255,255,255,0.07);
    &:hover { background: #2a2a2a; color: #f0ede6; }
  `}

  ${p => p.$danger && `
    background: rgba(248,113,113,0.1);
    color: #f87171;
    border: 1px solid rgba(248,113,113,0.2);
    &:hover { background: rgba(248,113,113,0.2); }
  `}
`;

// ─── Table ───────────────────────────────────────────────────────────────────
const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 10px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 500;
    color: #5e5b54;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    white-space: nowrap;
    background: #181818;
  }

  td {
    padding: 12px 16px;
    font-size: 13.5px;
    color: #f0ede6;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.1s;
    &:last-child td { border-bottom: none; }
    &:hover td { background: #222; }
  }
`;

// ─── Badges ──────────────────────────────────────────────────────────────────
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;

  ${p => p.$status === 'pending'   && 'background:rgba(251,191,36,0.1);color:#fbbf24;'}
  ${p => p.$status === 'preparing' && 'background:rgba(255,127,80,0.12);color:#ff7f50;'}
  ${p => p.$status === 'delivered' && 'background:rgba(74,222,128,0.1);color:#4ade80;'}
  ${p => p.$status === 'cancelled' && 'background:rgba(248,113,113,0.1);color:#f87171;'}
  ${p => p.$payment === 'cash'     && 'background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.2);'}
  ${p => p.$payment === 'online'   && 'background:rgba(96,165,250,0.1);color:#60a5fa;border:1px solid rgba(96,165,250,0.2);'}
`;

const BadgeDot = styled.span`
  width: 5px; height: 5px;
  border-radius: 50%;
  ${p => p.$status === 'pending'   && 'background:#fbbf24;'}
  ${p => p.$status === 'preparing' && 'background:#ff7f50;'}
  ${p => p.$status === 'delivered' && 'background:#4ade80;'}
  ${p => p.$status === 'cancelled' && 'background:#f87171;'}
`;

// ─── Products grid ────────────────────────────────────────────────────────────
const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  padding: 16px;
`;

const ProductCard = styled.div`
  background: #222;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s, transform 0.15s;
  &:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-1px); }
`;

const ProductThumb = styled.div`
  width: 100%; height: 100px;
  background: #2a2a2a;
  display: flex; align-items: center; justify-content: center;
  font-size: 36px;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ProductInfo = styled.div`
  padding: 12px;
  .name  { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ar    { font-size: 11px; color: #5e5b54; margin: 2px 0 4px; direction: rtl; }
  .price { font-size: 13px; font-weight: 600; color: #ff7f50; font-variant-numeric: tabular-nums; }
`;

const ProductActions = styled.div`
  display: flex; gap: 6px;
  padding: 0 12px 12px;
`;

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const Tabs = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${p => p.$active ? 'rgba(255,127,80,0.2)' : 'transparent'};
  background: ${p => p.$active ? 'rgba(255,127,80,0.12)' : 'none'};
  color: ${p => p.$active ? '#ff7f50' : '#5e5b54'};
  transition: all 0.15s;
  font-family: inherit;
  &:hover { color: #9e9a91; }
`;

// ─── Modal ────────────────────────────────────────────────────────────────────
const Overlay = styled.div`
  display: ${p => p.$open ? 'flex' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 100;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 28px;
  width: 460px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #f0ede6;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 11px;
  color: #5e5b54;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const Input = styled.input`
  background: #222;
  border: 1px solid ${p => p.$error ? '#f87171' : 'rgba(255,255,255,0.07)'};
  border-radius: 8px;
  padding: 10px 13px;
  color: #f0ede6;
  font-size: 13.5px;
  font-family: inherit;
  transition: border-color 0.15s;
  outline: none;
  width: 100%;
  &:focus { border-color: #ff7f50; }
  &::placeholder { color: #5e5b54; }
`;

const Select = styled.select`
  background: #222;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  padding: 10px 13px;
  color: #f0ede6;
  font-size: 13.5px;
  font-family: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
  &:focus { border-color: #ff7f50; }
  option { background: #222; }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

const ErrorMsg = styled.p`
  color: #f87171;
  font-size: 12px;
  margin: 0;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  burgers: '🍔', pizza: '🍕', sides: '🍟',
  drinks: '🥤', desserts: '🧁', salads: '🥗',
};

const STATUS_LABELS = {
  pending: 'Pending', preparing: 'Preparing',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
};

const BLANK_FORM = {
  name_en: '', name_ar: '', price: '', category: 'burgers', image: ''
};

// ─── Component ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [page, setPage]       = useState('dashboard');
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Product modal
  const [productModal, setProductModal] = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [form, setForm]                 = useState(BLANK_FORM);
  const [formError, setFormError]       = useState('');
  const [saving, setSaving]             = useState(false);

  // Order status modal
  const [orderModal, setOrderModal]     = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus]       = useState('');
  const [statusSaving, setStatusSaving] = useState(false);

  // ─── Load data ───────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, o, p] = await Promise.all([
        adminGetStats(),
        adminGetOrders(),
        adminGetProducts(),
      ]);
      setStats(s);
      setOrders(o);
      setProducts(p);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ─── Derived ─────────────────────────────────────────────────────────────
  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  // ─── Product CRUD ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(BLANK_FORM);
    setFormError('');
    setProductModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name_en:  product.name_en  || '',
      name_ar:  product.name_ar  || '',
      price:    product.price    || '',
      category: product.category || 'burgers',
      image:    product.image    || '',
    });
    setFormError('');
    setProductModal(true);
  };

  const saveProduct = async () => {
    if (!form.name_en.trim() || !form.price) {
      setFormError('Name (EN) and price are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name_en:  form.name_en.trim(),
        name_ar:  form.name_ar.trim(),
        price:    parseFloat(form.price),
        category: form.category,
        image:    form.image.trim() || null,
      };
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
      } else {
        await adminAddProduct(payload);
      }
      await loadAll();
      setProductModal(false);
    } catch (err) {
      setFormError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // ─── Order status ─────────────────────────────────────────────────────────
  const openOrderModal = (order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setOrderModal(true);
  };

  const updateStatus = async () => {
    setStatusSaving(true);
    try {
      await adminUpdateOrderStatus(editingOrder.id, newStatus);
      setOrders(prev => prev.map(o =>
        o.id === editingOrder.id ? { ...o, status: newStatus } : o
      ));
      setOrderModal(false);
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setStatusSaving(false);
    }
  };

  // ─── Render helpers ───────────────────────────────────────────────────────
  const StatusBadge = ({ status }) => (
    <Badge $status={status}>
      <BadgeDot $status={status} />
      {STATUS_LABELS[status] || status}
    </Badge>
  );

  const PaymentBadge = ({ method }) => (
    <Badge $payment={method}>
      {method === 'cash' ? '💵 Cash' : '💳 Online'}
    </Badge>
  );

  // ─── Pages ───────────────────────────────────────────────────────────────
  const DashboardPage = () => (
    <>
      <StatsGrid>
        <StatCard>
          <StatLabel>Total Revenue</StatLabel>
          <StatValue>{stats ? `${stats.totalRevenue.toLocaleString()} EGP` : '—'}</StatValue>
          <StatDelta $up>Delivered orders only</StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Orders Today</StatLabel>
          <StatValue>{stats ? stats.ordersToday : '—'}</StatValue>
          <StatDelta $up>Since midnight</StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Active Products</StatLabel>
          <StatValue>{stats ? stats.productCount : '—'}</StatValue>
          <StatDelta>In catalog</StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Pending Orders</StatLabel>
          <StatValue>{stats ? stats.pendingCount : '—'}</StatValue>
          <StatDelta $down={stats?.pendingCount > 0}>Need attention</StatDelta>
        </StatCard>
      </StatsGrid>

      <Panel>
        <PanelHead>
          <div>
            <PanelTitle>Recent Orders</PanelTitle>
            <PanelSub>Latest 10 orders</PanelSub>
          </div>
          <Btn $ghost onClick={() => setPage('orders')}>View all →</Btn>
        </PanelHead>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Total (EGP)</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(o => (
                <tr key={o.id} onClick={() => openOrderModal(o)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#5e5b54' }}>#{String(o.id).slice(0, 8)}</td>
                  <td style={{ fontSize: 12, color: '#9e9a91', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.userId}</td>
                  <td>{o.itemCount}</td>
                  <td style={{ fontWeight: 600 }}>{o.total}</td>
                  <td><PaymentBadge method={o.paymentMethod} /></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ color: '#5e5b54', fontSize: 12 }}>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Panel>
    </>
  );

  const OrdersPage = () => (
    <Panel>
      <PanelHead>
        <div>
          <PanelTitle>All Orders</PanelTitle>
          <PanelSub>{filteredOrders.length} orders</PanelSub>
        </div>
        <Tabs>
          {['all','pending','preparing','delivered','cancelled'].map(f => (
            <Tab key={f} $active={orderFilter === f} onClick={() => setOrderFilter(f)}>
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </Tab>
          ))}
        </Tabs>
      </PanelHead>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Items</th>
              <th>Total (EGP)</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#5e5b54' }}>#{String(o.id).slice(0, 8)}</td>
                <td style={{ fontSize: 11, color: '#9e9a91', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.userId}</td>
                <td>
                  <div title={o.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}>
                    {o.itemCount} item{o.itemCount !== 1 ? 's' : ''}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{o.total}</td>
                <td><PaymentBadge method={o.paymentMethod} /></td>
                <td><StatusBadge status={o.status} /></td>
                <td style={{ color: '#5e5b54', fontSize: 12 }}>{formatDate(o.createdAt)}</td>
                <td>
                  <Btn $ghost $sm onClick={() => openOrderModal(o)}>Update</Btn>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#5e5b54', padding: '2rem' }}>No orders found</td></tr>
            )}
          </tbody>
        </Table>
      </TableWrap>
    </Panel>
  );

  const ProductsPage = () => (
    <Panel>
      <PanelHead>
        <div>
          <PanelTitle>Product Catalog</PanelTitle>
          <PanelSub>{products.length} products</PanelSub>
        </div>
        <Btn $primary onClick={openAdd}>
          <span>+</span> Add Product
        </Btn>
      </PanelHead>
      <ProductsGrid>
        {products.map(p => (
          <ProductCard key={p.id}>
            <ProductThumb>
              {p.image
                ? <img src={p.image} alt={p.name_en} onError={e => { e.target.style.display='none'; e.target.parentNode.textContent = CATEGORY_EMOJI[p.category] || '🍽️'; }} />
                : (CATEGORY_EMOJI[p.category] || '🍽️')
              }
            </ProductThumb>
            <ProductInfo>
              <div className="name">{p.name_en}</div>
              <div className="ar">{p.name_ar}</div>
              <div className="price">{p.price} EGP</div>
            </ProductInfo>
            <ProductActions>
              <Btn $ghost $sm style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(p)}>Edit</Btn>
              <Btn $danger $sm style={{ flex: 1, justifyContent: 'center' }} onClick={() => deleteProduct(p.id)}>Delete</Btn>
            </ProductActions>
          </ProductCard>
        ))}
        {products.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#5e5b54', padding: '2rem' }}>
            No products yet. Add one!
          </div>
        )}
      </ProductsGrid>
    </Panel>
  );

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <>
      <AdminGlobal />
      <Shell>

        {/* SIDEBAR */}
        <Sidebar>
          <BrandArea>
            <BrandIcon>🍔</BrandIcon>
            <BrandText>
              <div className="name">Foodie Hub</div>
              <div className="sub">Admin Panel</div>
            </BrandText>
          </BrandArea>
          <Nav>
            <NavSection>Overview</NavSection>
            <NavItem $active={page === 'dashboard'} onClick={() => setPage('dashboard')}>
              📊 Dashboard
            </NavItem>

            <NavSection>Management</NavSection>
            <NavItem $active={page === 'orders'} onClick={() => setPage('orders')}>
              📋 Orders
              {pendingCount > 0 && <NavBadge>{pendingCount}</NavBadge>}
            </NavItem>
            <NavItem $active={page === 'products'} onClick={() => setPage('products')}>
              🍽️ Products
            </NavItem>

            <NavSection>Account</NavSection>
            <NavItem style={{ opacity: 0.5, cursor: 'default' }}>
              👤 {user?.email?.split('@')[0] || 'Admin'}
            </NavItem>
          </Nav>
        </Sidebar>

        {/* MAIN */}
        <Main>
          <Topbar>
            <PageTitle>
              {page === 'dashboard' ? 'Dashboard' : page === 'orders' ? 'Orders' : 'Products'}
            </PageTitle>
            <Btn $ghost onClick={loadAll}>↻ Refresh</Btn>
          </Topbar>

          <Content>
            {loading && (
              <div style={{ textAlign: 'center', color: '#5e5b54', padding: '3rem' }}>
                Loading…
              </div>
            )}
            {!loading && error && (
              <div style={{ color: '#f87171', textAlign: 'center', padding: '2rem' }}>
                Error: {error}
              </div>
            )}
            {!loading && !error && page === 'dashboard'  && <DashboardPage />}
            {!loading && !error && page === 'orders'     && <OrdersPage />}
            {!loading && !error && page === 'products'   && <ProductsPage />}
          </Content>
        </Main>

      </Shell>

      {/* PRODUCT MODAL */}
      <Overlay $open={productModal} onClick={e => e.target === e.currentTarget && setProductModal(false)}>
        <Modal>
          <ModalTitle>{editingId ? 'Edit Product' : 'Add Product'}</ModalTitle>
          <FormRow>
            <FormGroup>
              <Label>Name (EN) *</Label>
              <Input
                $error={formError && !form.name_en}
                value={form.name_en}
                onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                placeholder="e.g. Cheese Burger"
              />
            </FormGroup>
            <FormGroup>
              <Label>Name (AR)</Label>
              <Input
                value={form.name_ar}
                onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))}
                placeholder="تشيز برجر"
                dir="rtl"
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Price (EGP) *</Label>
              <Input
                $error={formError && !form.price}
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 89"
              />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="burgers">Burgers</option>
                <option value="pizza">Pizza</option>
                <option value="sides">Sides</option>
                <option value="drinks">Drinks</option>
                <option value="desserts">Desserts</option>
                <option value="salads">Salads</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>Image URL</Label>
            <Input
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
            />
          </FormGroup>
          {formError && <ErrorMsg>{formError}</ErrorMsg>}
          <ModalActions>
            <Btn $ghost onClick={() => setProductModal(false)}>Cancel</Btn>
            <Btn $primary onClick={saveProduct} disabled={saving}>
              {saving ? 'Saving…' : 'Save Product'}
            </Btn>
          </ModalActions>
        </Modal>
      </Overlay>

      {/* ORDER STATUS MODAL */}
      <Overlay $open={orderModal} onClick={e => e.target === e.currentTarget && setOrderModal(false)}>
        <Modal>
          <ModalTitle>Update Order Status</ModalTitle>
          {editingOrder && (
            <>
              <div style={{ fontSize: 13, color: '#9e9a91' }}>
                Order <strong style={{ color: '#f0ede6' }}>#{String(editingOrder.id).slice(0, 8)}</strong>
              </div>
              <div style={{ fontSize: 13, color: '#9e9a91' }}>
                Items: {editingOrder.items.map(i => `${i.name} ×${i.quantity}`).join(' · ')}
              </div>
              <div style={{ fontSize: 13, color: '#9e9a91' }}>
                Total: <strong style={{ color: '#ff7f50' }}>{editingOrder.total} EGP</strong>
              </div>
              <FormGroup>
                <Label>New Status</Label>
                <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormGroup>
            </>
          )}
          <ModalActions>
            <Btn $ghost onClick={() => setOrderModal(false)}>Cancel</Btn>
            <Btn $primary onClick={updateStatus} disabled={statusSaving}>
              {statusSaving ? 'Saving…' : 'Update Status'}
            </Btn>
          </ModalActions>
        </Modal>
      </Overlay>
    </>
  );
};

export default AdminDashboard;