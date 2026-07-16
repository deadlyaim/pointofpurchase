import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ArrowRight, ShieldCheck, Heart, Sparkles, Truck, Package, RotateCcw, HelpCircle, Store,
  Star, Check
} from 'lucide-react';
import { Product, Order, CartItem, OrderStatus, StatusHistoryEntry } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './data/initialProducts';
import { INITIAL_ORDERS } from './data/initialOrders';
import { REVIEWS } from './data/reviews';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackingTimeline from './components/TrackingTimeline';
import ReviewCard from './components/ReviewCard';
import { getDynamicTrackingNumber } from './utils/tracking';
export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracking'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [selectedReviewPhoto, setSelectedReviewPhoto] = useState<string | null>(null);

  // 1. Initialize states from localStorage or use presets
  useEffect(() => {
    const localProducts = localStorage.getItem('nomada_products');
    if (localProducts) {
      const parsed = JSON.parse(localProducts);
      const filtered = parsed.filter((p: any) => ['prod-1', 'prod-2', 'prod-3', 'prod-4'].includes(p.id));
      const updated = filtered.map((p: any) => {
        const baseProduct = { 
          ...p, 
          price: p.id === 'prod-2' ? 19.99 : p.id === 'prod-1' ? 24.99 : p.id === 'prod-3' ? 14.99 : 14.99,
          sizes: (p.id === 'prod-1' || p.id === 'prod-2' || p.id === 'prod-3') ? ['XS', 'S', 'M', 'L', 'XL'] : p.sizes
        };
        if (p.id === 'prod-1') {
          return {
            ...baseProduct,
            name: "Men's Sweatsuit Set",
            description: "Conjunto de buzo deportivo para hombre. Sudadera con capucha y pantalones deportivos confeccionados con materiales suaves y cómodos, ideales para entrenamiento o uso casual.",
            category: "Men's Clothing Sets",
            image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/2fe0229635114b80817b56f95e28ed93~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
          };
        }
        if (p.id === 'prod-2') {
          return {
            ...baseProduct,
            name: "Men's Casual Sports Set",
            description: "Conjunto minimalista y moderno de dos piezas para exteriores, chaqueta con cremallera + shorts, tela de poliéster, ajuste regular delgado, adecuado para primavera, verano y otoño, de secado rápido, transpirable, protector contra el sol, cómodo, ideal para entrenamientos diarios",
            category: "Men's Clothing Sets",
            image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/0d4b6dd0d542468d9b605b6a16920ebe~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839',
            colors: [
              {
                name: 'Caqui',
                value: '#F0E68C',
                image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/0d4b6dd0d542468d9b605b6a16920ebe~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839'
              },
              {
                name: 'Negro',
                value: '#000000',
                image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/456cc8228c454b5cb36ff425fe1b2c60~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839'
              }
            ]
          };
        }
        if (p.id === 'prod-3') {
          return {
            ...baseProduct,
            name: 'Unisex Knitwear',
            description: 'Polo de manga corta de punto de punto de rayas Jacquard unisex',
            category: "Men's Clothing Sets",
            image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/5325772acbc34b42a8aeb7204c1f0933~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839',
            colors: [
              {
                name: 'Multicolor',
                value: '#000000',
                image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/5325772acbc34b42a8aeb7204c1f0933~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839'
              },
              {
                name: 'Rosado',
                value: '#fda4af',
                image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/dc0591ed628c4ce5bedbd370803c7fab~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839'
              }
            ]
          };
        }
        if (p.id === 'prod-4') {
          return {
            ...baseProduct,
            name: 'Unisex Warm Casual Soft Slippers',
            description: 'Zapatos de exterior antideslizantes de piel sintética de alta calidad',
            category: 'Shoes',
            image: 'https://p16-oec-general.ttcdn-us.com/tos-alisg-i-aphluv4xwc-sg/6d7693dd1cd4432db351b1b9406d72d7~tplv-fhlh96nyum-origin-jpeg.jpeg?dr=12178&t=555f072d&ps=933b5bde&shp=a3510d86&shcp=6ce186a1&idc=useast5&from=2739998086',
            sizes: ['US6', 'US6.5', 'US7.5', 'US8', 'US9', 'US9.5', 'US10.5', 'US11', 'US12', 'US12.5']
          };
        }
        return baseProduct;
      });
      setProducts(updated);
      localStorage.setItem('nomada_products', JSON.stringify(updated));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('nomada_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const localOrders = localStorage.getItem('nomada_orders');
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('nomada_orders', JSON.stringify(INITIAL_ORDERS));
    }

    const localCart = localStorage.getItem('nomada_cart');
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  }, []);

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('nomada_cart', JSON.stringify(newCart));
  };

  // Helper to persist products
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('nomada_products', JSON.stringify(updatedProducts));
  };

  // Helper to persist orders
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('nomada_orders', JSON.stringify(updatedOrders));
  };

  // 2. Cart Operations
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    const existing = cart.find(
      (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert(`Disculpa, solo quedan ${product.stock} unidades disponibles de este artículo.`);
        return;
      }
      const updated = cart.map((item) =>
        (item.product.id === product.id && item.selectedSize === size && item.selectedColor === color)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      if (product.stock <= 0) {
        alert('Disculpa, este artículo se encuentra temporalmente agotado.');
        return;
      }
      saveCart([...cart, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
    }
    // Open drawer automatically on add for satisfying feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, selectedSize, selectedColor);
      return;
    }

    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct && quantity > targetProduct.stock) {
      alert(`Lo sentimos, el stock disponible para este producto es de ${targetProduct.stock} unidades.`);
      return;
    }

    const updated = cart.map((item) =>
      (item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
        ? { ...item, quantity }
        : item
    );
    saveCart(updated);
  };

  const handleRemoveCartItem = (productId: string, selectedSize?: string, selectedColor?: string) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    );
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // 3. Purchase Operations
  const handleOrderCreated = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
  };

  const handleDeductProductStock = (productId: string, quantityDeducted: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock - quantityDeducted);
        return { ...p, stock: newStock };
      }
      return p;
    });
    saveProducts(updated);
  };

  // 4. Admin Management Operations
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, description: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const newHistoryEntry: StatusHistoryEntry = {
          status,
          timestamp: new Date().toISOString(),
          description,
        };
        return {
          ...o,
          status,
          statusHistory: [newHistoryEntry, ...o.statusHistory],
        };
      }
      return o;
    });
    saveOrders(updated);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveProducts(updated);
  };

  const handleAddProduct = (newProduct: Product) => {
    const updated = [...products, newProduct];
    saveProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);
    // Also remove from cart if present
    const cleanCart = cart.filter((item) => item.product.id !== productId);
    saveCart(cleanCart);
  };

  // 5. Filter & Search Catalog
  const filteredCatalog = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchCatalogQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchCatalogQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getProcessedOrders = (ordersList: Order[]): Order[] => {
    return ordersList.map(o => {
      // 1. If it is a demo order, apply dynamic tracking number
      let trackingNumber = o.trackingNumber;
      if (o.id === 'ord-1001' || o.id === 'ord-1002' || o.id === 'ord-1003') {
        trackingNumber = getDynamicTrackingNumber(o.id);
      }

      // 2. Compute dynamic progress of the shipment based on elapsed days since createdAt
      const createdDate = isNaN(Date.parse(o.createdAt)) ? new Date() : new Date(o.createdAt);
      const now = new Date();
      const diffTime = now.getTime() - createdDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

      const baseTime = createdDate.getTime();
      const capTime = (offsetMs: number) => {
        return new Date(Math.min(baseTime + offsetMs, now.getTime())).toISOString();
      };

      let status: OrderStatus = 'payment_pending';
      const statusHistory: StatusHistoryEntry[] = [];

      // Always start with payment_pending entry at creation time
      statusHistory.push({
        status: 'payment_pending',
        timestamp: new Date(baseTime).toISOString(),
        description: 'Pago Confirmado. Transacción autorizada y procesada con éxito vía PayPal.'
      });

      // The first day (day 0) always has "en preparación" in the detailed history log
      statusHistory.unshift({
        status: 'preparing',
        timestamp: capTime(5 * 60 * 1000), // 5 minutes later
        description: 'En preparación. El paquete está siendo embalado y preparado en bodega.'
      });

      if (diffDays === 0) {
        status = 'payment_pending'; // Highlights Milestone 1: "Pago Confirmado"
      } else if (diffDays === 1) {
        status = 'preparing'; // Highlights Milestone 2: "En Bodega / Empacado"
        statusHistory.unshift({
          status: 'preparing',
          timestamp: capTime(24 * 60 * 60 * 1000), // 1 day later
          description: 'En Bodega / Empacado. Control de empaque e inventario terminado.'
        });
      } else if (diffDays === 2) {
        status = 'shipped'; // Highlights Milestone 3: "En Ruta de Reparto"
        statusHistory.unshift({
          status: 'preparing',
          timestamp: capTime(24 * 60 * 60 * 1000),
          description: 'En Bodega / Empacado. Control de empaque e inventario terminado.'
        });
        statusHistory.unshift({
          status: 'shipped',
          timestamp: capTime(2 * 24 * 60 * 60 * 1000), // 2 days later
          description: 'En Ruta de Reparto. El paquete ha sido transferido al transportista y se encuentra en camino al destino.'
        });
      } else {
        // diffDays >= 3
        status = 'delivered'; // Highlights Milestone 4: "Entregado"
        statusHistory.unshift({
          status: 'preparing',
          timestamp: capTime(24 * 60 * 60 * 1000),
          description: 'En Bodega / Empacado. Control de empaque e inventario terminado.'
        });
        statusHistory.unshift({
          status: 'shipped',
          timestamp: capTime(2 * 24 * 60 * 60 * 1000),
          description: 'En Ruta de Reparto. El paquete ha sido transferido al transportista y se encuentra en camino al destino.'
        });
        statusHistory.unshift({
          status: 'delivered',
          timestamp: capTime(3 * 24 * 60 * 60 * 1000), // 3 days later
          description: 'Entregado. Paquete recibido satisfactoriamente en el domicilio.'
        });
      }

      return {
        ...o,
        trackingNumber,
        status,
        statusHistory
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 bg-grid-pattern text-slate-800 flex flex-col">
      
      {/* Decorative top promotional bar */}
      <div className="bg-gray-950 py-1.5 text-center text-[10px] font-bold tracking-widest text-white uppercase flex items-center justify-center gap-1.5 px-4">
        <Sparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" />
        <span>Envíos gratuitos a todo el mundo por compras superiores a $50 USD • Satisfacción Garantizada</span>
      </div>

      {/* Responsive Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Main Body Grid */}
      <main className="flex-1">
        
        {/* VIEW 1: PRODUCT CATALOG */}
        {activeTab === 'catalog' && (
          <div className="animate-in fade-in-50 duration-300">


            {/* Catalog Filter Bar */}
            <section className="sticky top-16 z-30 bg-white/70 backdrop-blur-md border-b border-gray-100/60 py-4">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-gray-950 text-white shadow-xs'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-100/30'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Catalog Search */}
                <div className="relative w-full md:max-w-xs">
                  <input
                    type="text"
                    placeholder="Buscar en catálogo..."
                    className="w-full rounded-full border border-gray-200 pl-9 pr-4 py-1.5 font-sans text-xs outline-none focus:border-gray-950 bg-white"
                    value={searchCatalogQuery}
                    onChange={(e) => setSearchCatalogQuery(e.target.value)}
                  />
                  <ShoppingBag className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                </div>

              </div>
            </section>

            {/* Catalog Grid View */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              {filteredCatalog.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 py-20 text-center max-w-md mx-auto bg-white p-8">
                  <Store className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 font-sans text-sm font-bold text-gray-900 uppercase">No hay productos disponibles</h3>
                  <p className="mt-1.5 font-sans text-xs text-gray-500 leading-relaxed">
                    No encontramos ningún artículo en esta categoría que coincida con tu búsqueda. Prueba escribiendo otras palabras.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {filteredCatalog.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Custom Customer Reviews Gallery Section */}
            <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 border-t border-gray-100 pt-16">
              <div className="text-center md:text-left md:flex md:items-end md:justify-between mb-12">
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Opiniones de Clientes
                  </h2>
                  <p className="mt-2 font-sans text-xs text-gray-500 max-w-md">
                    Descubre fotos reales de compras verificadas y la experiencia de nuestra comunidad con los productos de PoP.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-start gap-1 bg-white border border-gray-100 px-4 py-2.5 rounded-full shadow-xs">
                  <div className="flex text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-900 ml-1.5">4.9 / 5.0</span>
                  <span className="font-sans text-xs text-gray-400 ml-1">(+140 reseñas)</span>
                </div>
              </div>

              {/* Grid of Reviews */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {REVIEWS.map((review, idx) => (
                  <ReviewCard 
                    key={idx} 
                    review={review} 
                    onPhotoClick={setSelectedReviewPhoto} 
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ORDER TRACKING PAGE */}
        {activeTab === 'tracking' && (
          <TrackingTimeline orders={getProcessedOrders(orders)} />
        )}

      </main>

      {/* Sliding Sidebar Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Gateway Secure Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        clearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
        onUpdateProductStock={handleDeductProductStock}
      />

      {/* Absolute Masterpiece Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 ${activeTab === 'tracking' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 text-center md:text-left`}>
          
          {/* About Column */}
          {activeTab !== 'tracking' && (
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="font-serif text-lg font-bold tracking-tight text-gray-900">Point of Purchase</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-gray-600">
                  PoP
                </span>
              </div>
            </div>
          )}

          {/* Secure Badging Column */}
          <div className="space-y-3 md:border-x md:border-gray-50 md:px-8">
            <h4 className="font-sans text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              Envíos & Logística
            </h4>
            <div className="flex flex-col items-center md:items-start gap-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck className="h-4 w-4 text-gray-400 shrink-0" />
                <span>Despacho express a domicilio con cobertura total.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Pagos auditados bajo estándar PCI-DSS v4.0</span>
              </div>
            </div>
          </div>

          {/* Quick Help Column */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              ¿Necesitas ayuda?
            </h4>
            <p className="font-sans text-xs text-gray-500">
              Nuestro equipo de atención al cliente está disponible para asistirte de Lunes a Viernes de 9:00 a 18:00 hrs.
            </p>
            <span className="block font-mono text-xs font-bold text-gray-900">
              soporte@pointofpurchase.com
            </span>
          </div>

        </div>

        {/* Copywrite legal */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <span className="font-sans text-[11px] text-gray-400">
            © 2026 Point of Purchase S.A. Todos los derechos reservados.
          </span>
          <div className="flex gap-4 text-[11px] text-gray-400">
            <a href="#" className="hover:text-gray-900 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Políticas de Envío</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>

      {/* Photo Lightbox Modal */}
      {selectedReviewPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedReviewPhoto(null)}
        >
          <div 
            className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedReviewPhoto(null)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10 font-sans text-xs"
            >
              ✕
            </button>
            <img 
              src={selectedReviewPhoto} 
              alt="Review Photo Zoomed" 
              className="w-full h-auto object-contain max-h-[80vh] block"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </div>
  );
}
