import React from 'react';
import { ShoppingBag, Package, Settings, Store } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'tracking';
  setActiveTab: (tab: 'catalog' | 'tracking') => void;
  cartCount: number;
  toggleCart: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, toggleCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Brand */}
        <div 
          onClick={() => setActiveTab('catalog')} 
          className="flex cursor-pointer items-center space-x-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-gray-900">
              PoP
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`relative rounded-lg px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
              activeTab === 'catalog'
                ? 'text-gray-950 bg-gray-50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`relative rounded-lg px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
              activeTab === 'tracking'
                ? 'text-gray-950 bg-gray-50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              Rastrear Envío
            </span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            id="cart-toggle-button"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-700 shadow-xs transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-105" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-950 font-mono text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="flex sm:hidden border-t border-gray-50 bg-white px-4 py-2 justify-around">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium py-1 ${
            activeTab === 'catalog' ? 'text-gray-950 font-bold' : 'text-gray-400'
          }`}
        >
          <Store className="h-4 w-4" />
          <span>Catálogo</span>
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium py-1 ${
            activeTab === 'tracking' ? 'text-gray-950 font-bold' : 'text-gray-400'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Rastrear</span>
        </button>
      </div>
    </header>
  );
}
