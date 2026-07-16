import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onRemoveItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal < 50 ? 3.00 : 0.00;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-xs transition-opacity animate-in fade-in-20"
      ></div>

      {/* Slide-over Content Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-gray-100 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-gray-950" />
            <h2 className="font-serif text-lg font-bold text-gray-900">Tu Carrito</h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-gray-600">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body (Items list or empty) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-gray-900 uppercase">El carrito está vacío</h3>
                <p className="mt-1 font-sans text-xs text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                  Explora nuestro catálogo de artículos y añade tus favoritos para iniciar una orden de compra.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-sans text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Volver al catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemImage = item.product.colors?.find(c => c.name === item.selectedColor)?.image || item.product.image;
                return (
                  <div 
                    key={`${item.product.id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`}
                    className="flex items-start gap-4 rounded-xl border border-gray-100 p-3 bg-white transition-all hover:border-gray-200 hover:shadow-xs"
                  >
                    {/* Thumbnail */}
                    <img
                      src={itemImage}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                    />

                    {/* Info details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate font-sans text-sm font-semibold text-gray-900 leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                          title="Quitar del carrito"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="font-sans text-[11px] text-gray-400 uppercase tracking-wide">
                          {item.product.category}
                        </span>
                        {item.selectedSize && (
                          <>
                            <span className="text-gray-300 text-[10px]">•</span>
                            <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-700 font-mono">
                              TALLA: {item.selectedSize}
                            </span>
                          </>
                        )}
                        {item.selectedColor && (
                          <>
                            <span className="text-gray-300 text-[10px]">•</span>
                            <span className="inline-flex items-center rounded bg-gray-100 border border-gray-200 px-1.5 py-0.5 text-[9px] font-bold text-gray-700 uppercase tracking-wide">
                              COLOR: {item.selectedColor}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Counter selectors */}
                        <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 p-1 bg-gray-50/50">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-gray-500 shadow-xs border border-gray-100 hover:bg-gray-50 hover:text-gray-900 active:scale-90 transition-all"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            disabled={item.quantity >= item.product.stock}
                            className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-gray-500 shadow-xs border border-gray-100 hover:bg-gray-50 hover:text-gray-900 active:scale-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>

                        {/* Total price for line-item */}
                        <span className="font-mono text-xs font-bold text-gray-950">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Checkout Panel */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/70 p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between font-sans text-xs text-gray-500">
                <span>Subtotal:</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans text-xs text-gray-500">
                <span>Envío:</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-semibold uppercase text-[10px] tracking-wider">Gratis</span>
                ) : (
                  <span className="font-mono text-gray-700">${shippingFee.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between font-serif text-base font-bold text-gray-950 pt-2 border-t border-dashed border-gray-200">
                <span>Total Estimado:</span>
                <span className="font-mono text-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={onCheckout}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 active:scale-98 transition-all"
              >
                Proceder al Pago
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-mono">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                PASARELA CON CIFRADO SEGURO
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
