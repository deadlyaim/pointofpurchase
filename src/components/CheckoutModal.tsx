import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, Copy, Check, Lock, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { CartItem, Product, Order, OrderItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  clearCart: () => void;
  onOrderCreated: (order: Order) => void;
  onUpdateProductStock: (productId: string, quantityDeducted: number) => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'success';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  clearCart,
  onOrderCreated,
  onUpdateProductStock,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  const [paypalEmail, setPaypalEmail] = useState('');
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal < 50 ? 3.00 : 0.00;
  const total = subtotal + shippingFee;

  // Form validation
  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shippingForm.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!shippingForm.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(shippingForm.email)) {
      errs.email = 'Correo electrónico inválido';
    }
    if (!shippingForm.address.trim()) errs.address = 'La dirección es obligatoria';
    if (!shippingForm.city.trim()) errs.city = 'La ciudad es obligatoria';
    if (!shippingForm.phone.trim()) errs.phone = 'El teléfono es obligatorio';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePaypal = () => {
    const errs: Record<string, string> = {};
    if (!paypalEmail.trim()) {
      errs.paypalEmail = 'El correo electrónico de PayPal es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(paypalEmail)) {
      errs.paypalEmail = 'El correo de PayPal no tiene un formato válido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Dynamically load PayPal JS SDK script when checkout modal is open and on payment step
  useEffect(() => {
    if (!isOpen || step !== 'payment') return;

    if ((window as any).paypal) {
      setIsSdkLoaded(true);
      return;
    }

    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      // Inject Client ID requested by user
      script.src = `https://www.paypal.com/sdk/js?client-id=BAA8K1TXZ5sTnj1UjkxiPoklwAayRuO5YpTn3iJrF89vhD3z_c0z_V5zLSY0Bx_pBgJVHNSYGDRhMN2m78&currency=USD`;
      script.async = true;
      script.onload = () => {
        setIsSdkLoaded(true);
      };
      script.onerror = () => {
        setSdkError('Error al cargar la pasarela de PayPal. Por favor, reintenta.');
      };
      document.body.appendChild(script);
    } else {
      setIsSdkLoaded(true);
    }
  }, [isOpen, step]);

  // Render PayPal buttons once the SDK is loaded and container is mounted
  useEffect(() => {
    if (!isSdkLoaded || step !== 'payment' || !isOpen) return;

    const renderPaypalButtons = () => {
      const paypal = (window as any).paypal;
      if (paypal && paypalButtonRef.current) {
        // Clear previous button content to avoid duplicates on re-render
        paypalButtonRef.current.innerHTML = '';
        
        try {
          paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            },
            createOrder: (data: any, actions: any) => {
              // Ensure we pass the original cart/store total (the real amount of products)
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: 'USD',
                      value: total.toFixed(2),
                    },
                    description: `Compra en Point of Purchase (PoP) - ${cartItems.map(item => `${item.product.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} x${item.quantity}`).join(', ')}`,
                  },
                ],
              });
            },
            onApprove: async (data: any, actions: any) => {
              setIsProcessing(true);
              setProcessingMessage('Autorizando pago seguro con PayPal...');
              
              try {
                const details = await actions.order.capture();
                const buyerEmail = details.payer?.email_address || paypalEmail || 'usuario@paypal.com';
                
                setProcessingMessage('Confirmando orden e inventario con Point of Purchase...');
                await new Promise((resolve) => setTimeout(resolve, 800));

                // Generate random 10-digit Tracking Number
                const trackingNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
                const newOrderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;

                const orderItems: OrderItem[] = cartItems.map((item) => ({
                  productId: item.product.id,
                  productName: item.product.name,
                  quantity: item.quantity,
                  priceAtPurchase: item.product.price,
                  image: item.product.image,
                  selectedSize: item.selectedSize,
                }));

                const newOrder: Order = {
                  id: newOrderId,
                  trackingNumber: trackingNo,
                  customerName: shippingForm.name,
                  customerEmail: shippingForm.email,
                  customerAddress: shippingForm.address,
                  customerCity: shippingForm.city,
                  customerPhone: shippingForm.phone,
                  items: orderItems,
                  total: total,
                  paymentMethod: `PayPal (${buyerEmail})`,
                  createdAt: new Date().toISOString(),
                  status: 'payment_pending',
                  carrier: 'Envío Express Point of Purchase',
                  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                  statusHistory: [
                    {
                      status: 'preparing',
                      timestamp: new Date().toISOString(),
                      description: `Pago recibido mediante PayPal ID: ${details.id}. El paquete está siendo embalado y preparado en bodega.`,
                    },
                    {
                      status: 'payment_pending',
                      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
                      description: 'Orden de pago completada por el cliente vía PayPal.',
                    },
                  ],
                };

                // Deduct stock for each item purchased
                cartItems.forEach((item) => {
                  onUpdateProductStock(item.product.id, item.quantity);
                });

                onOrderCreated(newOrder);
                setCreatedOrder(newOrder);
                setIsProcessing(false);
                setStep('success');
              } catch (err) {
                console.error('Error al capturar la orden de PayPal:', err);
                setErrors({ paypal: 'Hubo un error al procesar el cobro con PayPal. Intenta de nuevo.' });
                setIsProcessing(false);
              }
            },
            onError: (err: any) => {
              console.error('PayPal Smart Buttons Error:', err);
              setErrors({ paypal: 'Ocurrió un error con el widget de PayPal. Por favor, reintenta la operación.' });
            }
          }).render(paypalButtonRef.current);
        } catch (err) {
          console.error('Error al instanciar los Smart Buttons:', err);
        }
      }
    };

    // Render buttons immediately or retry in short delays if container is loading
    const timer = setTimeout(renderPaypalButtons, 150);
    return () => clearTimeout(timer);
  }, [isSdkLoaded, step, isOpen, total, cartItems]);

  // Prevent background body scroll when checkout modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingForm({ ...shippingForm, phone: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 'shipping' && validateShipping()) {
      setStep('payment');
      setPaypalEmail(shippingForm.email);
      setErrors({});
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePaypal()) return;

    setIsProcessing(true);
    setErrors({});

    // Beautiful simulated checkout stages for PayPal
    const messages = [
      'Redirigiendo de forma segura a la pasarela de PayPal...',
      'Autenticando transacción con la cuenta del comprador...',
      'Validando saldo y fondos disponibles en PayPal...',
      'Procesando transferencia segura a sofiasanzshop@outlook.com...',
      'Confirmando orden e inventario con Point of Purchase...',
    ];

    for (let i = 0; i < messages.length; i++) {
      setProcessingMessage(messages[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Generate random 10-digit Tracking Number
    const trackingNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const newOrderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
      image: item.product.image,
      selectedSize: item.selectedSize,
    }));

    const newOrder: Order = {
      id: newOrderId,
      trackingNumber: trackingNo,
      customerName: shippingForm.name,
      customerEmail: shippingForm.email,
      customerAddress: shippingForm.address,
      customerCity: shippingForm.city,
      customerPhone: shippingForm.phone,
      items: orderItems,
      total: total,
      paymentMethod: `PayPal (${paypalEmail})`,
      createdAt: new Date().toISOString(),
      status: 'payment_pending',
      carrier: 'Envío Express Point of Purchase',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      statusHistory: [
        {
          status: 'preparing',
          timestamp: new Date().toISOString(),
          description: 'Pago recibido por PayPal y verificado con éxito. El paquete está siendo embalado y preparado en bodega.',
        },
        {
          status: 'payment_pending',
          timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
          description: 'Orden de pago iniciada por el cliente vía PayPal.',
        },
      ],
    };

    // Deduct stock for each item purchased
    cartItems.forEach((item) => {
      onUpdateProductStock(item.product.id, item.quantity);
    });

    onOrderCreated(newOrder);
    setCreatedOrder(newOrder);
    setIsProcessing(false);
    setStep('success');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    clearCart();
    onClose();
    // Reset modal state
    setStep('shipping');
    setShippingForm({ name: '', email: '', address: '', city: '', phone: '' });
    setPaypalEmail('');
    setCreatedOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/60 backdrop-blur-xs animate-in fade-in-20 flex items-start sm:items-center justify-center p-4 md:p-6">
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 duration-200 my-auto"
      >
        {/* Header (Hidden on success to keep it clean) */}
        {step !== 'success' && (
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Pasarela de Pago Segura</h2>
              <p className="font-sans text-xs text-gray-500">
                Tu compra está encriptada con cifrado SSL de 256 bits.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Processing State Loader Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 px-6 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-gray-950 opacity-10"></span>
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-950"></span>
            </div>
            <h3 className="mt-6 font-sans text-base font-bold text-gray-900">Procesando Transacción</h3>
            <p className="mt-2 h-8 font-mono text-xs text-gray-500 max-w-sm animate-pulse">
              {processingMessage}
            </p>
            <div className="mt-4 flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 font-mono text-[10px] font-semibold text-gray-600">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              CONEXIÓN CIFRADA CON BANCO
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="flex border-b border-gray-50 bg-gray-50/50 px-6 py-3">
            <div className="flex items-center space-x-2">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === 'shipping' ? 'bg-gray-950 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {step === 'shipping' ? '1' : '✓'}
              </span>
              <span
                className={`font-sans text-xs font-semibold ${
                  step === 'shipping' ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                Información de Envío
              </span>
            </div>
            <div className="mx-4 h-px w-8 bg-gray-200 self-center"></div>
            <div className="flex items-center space-x-2">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === 'payment' ? 'bg-gray-950 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </span>
              <span
                className={`font-sans text-xs font-semibold ${
                  step === 'payment' ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                Pago Seguro
              </span>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6">
          
          {/* STEP 1: SHIPPING INFORMATION */}
          {step === 'shipping' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Form Column */}
              <div className="md:col-span-3 space-y-4">
                <h3 className="font-sans text-sm font-bold tracking-tight text-gray-900 uppercase">
                  Datos del Destinatario
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-gray-600 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-xl border px-3 py-2.5 font-sans text-sm outline-none transition-all ${
                        errors.name ? 'border-red-300 bg-red-50/10' : 'border-gray-200 focus:border-gray-950'
                      }`}
                      placeholder="Sofía Alarcón"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    />
                    {errors.name && (
                      <span className="mt-1 block text-[10px] font-medium text-red-500">{errors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-gray-600 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className={`w-full rounded-xl border px-3 py-2.5 font-sans text-sm outline-none transition-all ${
                        errors.email ? 'border-red-300 bg-red-50/10' : 'border-gray-200 focus:border-gray-950'
                      }`}
                      placeholder="sofia@example.com"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    />
                    {errors.email && (
                      <span className="mt-1 block text-[10px] font-medium text-red-500">{errors.email}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-xs font-semibold text-gray-600 mb-1">
                        Número de Teléfono
                      </label>
                      <input
                        type="tel"
                        className={`w-full rounded-xl border px-3 py-2.5 font-sans text-sm outline-none transition-all ${
                          errors.phone ? 'border-red-300 bg-red-50/10' : 'border-gray-200 focus:border-gray-950'
                        }`}
                        placeholder="+34 612 345 678"
                        value={shippingForm.phone}
                        onChange={handlePhoneChange}
                      />
                      {errors.phone && (
                        <span className="mt-1 block text-[10px] font-medium text-red-500">{errors.phone}</span>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-semibold text-gray-600 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded-xl border px-3 py-2.5 font-sans text-sm outline-none transition-all ${
                          errors.city ? 'border-red-300 bg-red-50/10' : 'border-gray-200 focus:border-gray-950'
                        }`}
                        placeholder="Madrid"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      />
                      {errors.city && (
                        <span className="mt-1 block text-[10px] font-medium text-red-500">{errors.city}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-gray-600 mb-1">
                      Dirección Completa (Calle, número, departamento)
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-xl border px-3 py-2.5 font-sans text-sm outline-none transition-all ${
                        errors.address ? 'border-red-300 bg-red-50/10' : 'border-gray-200 focus:border-gray-950'
                      }`}
                      placeholder="Calle de Serrano 45, 3º B"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    />
                    {errors.address && (
                      <span className="mt-1 block text-[10px] font-medium text-red-500">{errors.address}</span>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleNextStep}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
                  >
                    Continuar al Pago
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Order Summary Column */}
              <div className="md:col-span-2 rounded-2xl bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans text-xs font-bold tracking-tight text-gray-900 uppercase mb-3 flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4" />
                    Resumen de Compra
                  </h3>
                  <div className="max-h-[180px] overflow-y-auto space-y-2.5 pr-1">
                    {cartItems.map((item) => {
                      const itemImage = item.product.colors?.find(c => c.name === item.selectedColor)?.image || item.product.image;
                      return (
                        <div key={`${item.product.id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`} className="flex gap-2.5 border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                          <img
                            src={itemImage}
                            alt={item.product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-sans text-xs font-semibold text-gray-900">
                              {item.product.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <p className="font-sans text-[11px] text-gray-500">
                                {item.quantity} x ${item.product.price.toFixed(2)}
                              </p>
                              {item.selectedSize && (
                                <span className="inline-flex items-center rounded bg-gray-200/80 px-1.5 py-0.5 text-[9px] font-bold text-gray-700 font-mono">
                                  Talla: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="inline-flex items-center rounded bg-gray-200/80 px-1.5 py-0.5 text-[9px] font-bold text-gray-700 font-mono uppercase">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between font-sans text-xs text-gray-500 mb-1.5">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-sans text-xs text-gray-500 mb-2">
                    <span>Envío:</span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase text-[10px] tracking-wider">Gratis</span>
                    ) : (
                      <span className="font-mono text-gray-700">${shippingFee.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-mono text-sm font-bold text-gray-950 pt-1.5 border-t border-dashed border-gray-200">
                    <span>Total a Pagar:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SECURE PAYPAL GATEWAY */}
          {step === 'payment' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Form Input Column */}
              <div className="md:col-span-3 space-y-5">
                <h3 className="font-sans text-sm font-bold tracking-tight text-gray-900 uppercase flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs">
                    P
                  </span>
                  Pago Seguro con PayPal
                </h3>

                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  Para completar tu compra en <span className="font-bold text-gray-900">Point of Purchase (PoP)</span>, utiliza la pasarela oficial segura de PayPal abajo para autorizar el cobro.
                </p>

                <div className="space-y-4">
                  {/* PayPal Branding Box */}
                  <div className="rounded-2xl border border-[#0070ba]/20 bg-[#0070ba]/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[11px] font-bold text-[#003087] uppercase tracking-wide">
                        Destinatario Autorizado
                      </span>
                      <span className="font-sans font-extrabold italic text-[#003087]">
                        Pay<span className="text-[#0070ba]">Pal</span>
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-slate-700 font-sans">
                      <div className="flex justify-between">
                        <span>Comercio:</span>
                        <span className="font-semibold text-slate-900">Point of Purchase S.A.</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cuenta PayPal:</span>
                        <span className="font-mono font-medium text-blue-700">sofiasanzshop@outlook.com</span>
                      </div>
                      <div className="flex justify-between border-t border-[#0070ba]/10 pt-1.5 mt-1.5 font-bold text-slate-900">
                        <span>Monto del Pago:</span>
                        <span className="text-base text-[#003087]">${total.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Real PayPal smart buttons container */}
                  <div className="relative min-h-[150px] w-full pt-1">
                    {!isSdkLoaded && !sdkError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#0070ba] mb-2" />
                        <span className="font-sans text-xs text-slate-500 font-medium">Cargando pasarela oficial de PayPal...</span>
                      </div>
                    )}

                    {sdkError && (
                      <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center">
                        <p className="font-sans text-xs font-semibold text-red-600">{sdkError}</p>
                      </div>
                    )}

                    {errors.paypal && (
                      <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center mb-3">
                        <p className="font-sans text-xs font-semibold text-red-600">{errors.paypal}</p>
                      </div>
                    )}

                    {/* Container where the PayPal JS SDK will render the buttons */}
                    <div 
                      ref={paypalButtonRef} 
                      id="paypal-button-container"
                      className="w-full z-10 relative"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Atrás
                  </button>
                </div>
              </div>

              {/* PayPal Trust and Security Information Column */}
              <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                <div className="rounded-2xl border border-[#0070ba]/10 bg-slate-50 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0070ba]" />
                    <h4 className="font-sans text-xs font-bold text-[#003087] uppercase tracking-wide">
                      Protección al Comprador
                    </h4>
                  </div>
                  
                  <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
                    Si tu artículo elegible no llega o no coincide con la descripción del vendedor, la <span className="font-semibold text-gray-800">Protección al Comprador de PayPal</span> te puede reembolsar el importe total de la compra.
                  </p>

                  <div className="space-y-2 border-t border-gray-200/60 pt-3 text-[10px] text-gray-400 font-sans leading-relaxed">
                    <p>✓ Cifrado de extremo a extremo de alta seguridad.</p>
                    <p>✓ Sin compartir información financiera confidencial con el comercio.</p>
                    <p>✓ Monitoreo de fraudes las 24 horas del día, los 7 días de la semana.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans text-xs font-bold text-gray-900">Pasarela Homologada</h4>
                      <p className="font-sans text-[11px] text-gray-500 leading-relaxed mt-0.5">
                        Tus transacciones están respaldadas por la infraestructura encriptada de PayPal. Point of Purchase nunca guardará ni tendrá acceso a tus claves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION SUCCESS & RECEIPT */}
          {step === 'success' && createdOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">¡Pago Procesado con Éxito!</h2>
                <p className="mt-1.5 font-sans text-sm text-gray-500 max-w-md mx-auto">
                  Gracias por tu compra, <span className="font-semibold text-gray-800">{createdOrder.customerName}</span>. Tu pedido ha sido registrado correctamente en nuestro sistema y está siendo preparado.
                </p>
              </div>

              {/* Dynamic Tracking Code Area with High Visibility Message */}
              <div className="mx-auto max-w-md rounded-2xl bg-amber-55/10 border border-amber-200 p-5 space-y-4">
                <div className="flex items-start gap-2.5 text-left">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans text-xs font-bold text-amber-950 uppercase tracking-wide">
                      ¡IMPORTANTE! Guarda tu número de seguimiento
                    </h4>
                    <p className="font-sans text-[11px] text-amber-800 leading-relaxed mt-0.5">
                      Por favor, <span className="font-bold text-amber-950">guarda y conserva este código</span>. Lo necesitarás para consultar el estado y avance de tu paquete ingresando en la sección <span className="font-bold text-amber-950">"Rastrear Envío"</span> en el menú superior.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-200/50 bg-white px-4 py-3 shadow-xs">
                  <span className="font-mono text-sm sm:text-base font-bold text-gray-950 tracking-wider">
                    {createdOrder.trackingNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(createdOrder.trackingNumber)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    title="Copiar código"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {copied && (
                  <span className="mt-1 block text-center text-[10px] font-bold text-emerald-600">
                    ¡Código copiado al portapapeles! Guárdalo en un lugar seguro.
                  </span>
                )}
              </div>

              {/* Detailed Invoice / Receipt */}
              <div className="mx-auto max-w-md border-t border-gray-100 pt-5 text-left text-xs text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>ID de Pedido:</span>
                  <span className="font-mono font-medium text-gray-800">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destino de Envío:</span>
                  <span className="font-sans font-medium text-gray-800">{createdOrder.customerAddress}, {createdOrder.customerCity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Método de Envío:</span>
                  <span className="font-sans font-medium text-gray-800">{createdOrder.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega Estimada:</span>
                  <span className="font-sans font-semibold text-emerald-600">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-100 pt-2 font-mono text-sm font-bold text-gray-950">
                  <span>Monto Total Cobrado:</span>
                  <span>${createdOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 max-w-sm mx-auto">
                <button
                  onClick={handleFinish}
                  className="w-full rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-colors"
                >
                  Entendido & Volver a la Tienda
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
