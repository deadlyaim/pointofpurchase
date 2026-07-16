import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Box, CreditCard, ArrowRight, Clipboard, AlertCircle, RefreshCw, Landmark, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface TrackingTimelineProps {
  orders: Order[];
}

export default function TrackingTimeline({ orders }: TrackingTimelineProps) {
  const [trackingInput, setTrackingInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanedInput = trackingInput.trim().toUpperCase();
    
    // Find matching order by exact tracking number
    const found = orders.find(
      o => o.trackingNumber.replace(/\s/g, '').toUpperCase() === cleanedInput.replace(/\s/g, '').toUpperCase()
    );
    
    setSearchedOrder(found || null);
    setSearchAttempted(true);
  };

  // Quick fill helper
  const fillTrackingCode = (code: string) => {
    setTrackingInput(code);
    const found = orders.find(o => o.trackingNumber === code);
    setSearchedOrder(found || null);
    setSearchAttempted(true);
  };

  // Get current state level (0-4) for progress bars
  const getStatusLevel = (status: OrderStatus): number => {
    switch (status) {
      case 'payment_pending': return 1;
      case 'preparing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const activeLevel = searchedOrder ? getStatusLevel(searchedOrder.status) : 0;

  // Get readable status labels
  const getStatusMeta = (status: OrderStatus) => {
    switch (status) {
      case 'payment_pending':
        return { label: 'Pago Confirmado', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'preparing':
        return { label: 'En Preparación', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'shipped':
        return { label: 'En Camino', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
      case 'delivered':
        return { label: 'Entregado', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'text-red-600 bg-red-50 border-red-200' };
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Seguimiento de Envíos
        </h1>
        <p className="mt-3 font-sans text-sm text-gray-500 leading-relaxed">
          Ingresa el número de seguimiento de 10 dígitos provisto en tu recibo para verificar la ubicación de tu pedido y su estado logístico actual.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="mt-8 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-3 font-mono text-sm uppercase tracking-wide outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950/20"
              placeholder="10 dígitos (ej. 1234567890)"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-gray-950 px-5 py-3 font-sans text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* Test Suggestion Links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
          <span>Prueba estos códigos de ejemplo:</span>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => fillTrackingCode(o.trackingNumber)}
              className="rounded-full bg-gray-100 px-3 py-1 font-mono font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {o.trackingNumber}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {searchAttempted && searchedOrder && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          
          {/* Order Header Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  NÚMERO DE SEGUIMIENTO
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusMeta(searchedOrder.status).color}`}>
                  {getStatusMeta(searchedOrder.status).label}
                </span>
              </div>
              <h2 className="mt-1 font-mono text-xl font-bold tracking-wider text-gray-950">
                {searchedOrder.trackingNumber}
              </h2>
              <p className="mt-1 font-sans text-xs text-gray-500">
                Empresa transportista: <span className="font-semibold text-gray-700">{searchedOrder.carrier}</span>
              </p>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
              <span className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                FECHA ESTIMADA DE ENTREGA
              </span>
              <span className="font-sans text-base font-bold text-emerald-600 block mt-0.5">
                {searchedOrder.estimatedDelivery}
              </span>
              <span className="font-sans text-[11px] text-gray-400">
                Sujeto a cambios del transportista
              </span>
            </div>
          </div>

          {/* Visual Milestone Progress Tracker */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
              Progreso del Envío
            </h3>

            <div className="relative">
              {/* Desktop Progress Bar Line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-gray-100 max-md:hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${((activeLevel - 1) / 3) * 100}%` }}
                ></div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {/* Milestone 1: Payment */}
                <div className="flex md:flex-col items-center gap-3 md:text-center">
                  <div 
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      activeLevel >= 1 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className={`font-sans text-xs font-bold ${activeLevel >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Pago Confirmado
                    </h4>
                    <p className="font-sans text-[11px] text-gray-400 mt-0.5 max-md:hidden">
                      Transacción autorizada y procesada con éxito.
                    </p>
                  </div>
                </div>

                {/* Milestone 2: Preparing */}
                <div className="flex md:flex-col items-center gap-3 md:text-center">
                  <div 
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      activeLevel >= 2 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <Box className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className={`font-sans text-xs font-bold ${activeLevel >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                      En Bodega / Empacado
                    </h4>
                    <p className="font-sans text-[11px] text-gray-400 mt-0.5 max-md:hidden">
                      Control de empaque e inventario terminado.
                    </p>
                  </div>
                </div>

                {/* Milestone 3: Shipped */}
                <div className="flex md:flex-col items-center gap-3 md:text-center">
                  <div 
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      activeLevel >= 3 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className={`font-sans text-xs font-bold ${activeLevel >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                      En Ruta de Reparto
                    </h4>
                    <p className="font-sans text-[11px] text-gray-400 mt-0.5 max-md:hidden">
                      Transferido al transportista y en camino al destino.
                    </p>
                  </div>
                </div>

                {/* Milestone 4: Delivered */}
                <div className="flex md:flex-col items-center gap-3 md:text-center">
                  <div 
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      activeLevel >= 4 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className={`font-sans text-xs font-bold ${activeLevel >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Entregado
                    </h4>
                    <p className="font-sans text-[11px] text-gray-400 mt-0.5 max-md:hidden">
                      Paquete recibido satisfactoriamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Routing Map Simulation & Log Entries */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Timeline Log (Left Column) */}
            <div className="md:col-span-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">
                Historial Detallado de Eventos
              </h3>

              <div className="relative pl-6 border-l border-gray-100 space-y-6">
                {searchedOrder.statusHistory.map((history, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle marker */}
                    <span className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full ${idx === 0 ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-gray-300'}`}></span>
                    
                    <div>
                      <span className="font-mono text-[10px] font-bold text-gray-400 block uppercase">
                        {new Date(history.timestamp).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <h4 className={`font-sans text-xs font-bold mt-0.5 ${idx === 0 ? 'text-gray-950' : 'text-gray-700'}`}>
                        {getStatusMeta(history.status).label}
                      </h4>
                      <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                        {history.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Logistics Transit Card (Right Column) */}
            <div className="md:col-span-2 rounded-3xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                  Logística & Destino
                </h3>
                
                {/* Simulated Visual Route Vector */}
                <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100/60 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-white font-mono text-xs font-bold shrink-0">
                      CD
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider font-bold">Origen</span>
                      <p className="font-sans text-xs font-semibold text-gray-800">Centro Logístico Point of Purchase</p>
                    </div>
                  </div>

                  {/* Connecting Dotted Line Animation */}
                  <div className="h-10 w-px border-l-2 border-dashed border-gray-300 ml-4 relative">
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-mono text-xs font-bold shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-emerald-600 uppercase tracking-wider font-bold">Destino</span>
                      <p className="font-sans text-xs font-semibold text-gray-800 truncate">{searchedOrder.customerCity}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 space-y-2 border-t border-gray-50 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-gray-400 shrink-0">Destinatario:</span>
                    <span className="font-semibold text-gray-800 text-right">{searchedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-gray-400 shrink-0">Ciudad de entrega:</span>
                    <span className="font-semibold text-gray-800 text-right">{searchedOrder.customerCity}</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-gray-400 shrink-0">Teléfono:</span>
                    <span className="font-mono text-gray-600 text-right">{searchedOrder.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-emerald-800 leading-relaxed">
                  Para reclamos o modificaciones de entrega, contáctanos indicando tu código de seguimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH ATTEMPTED BUT NOT FOUND */}
      {searchAttempted && !searchedOrder && (
        <div className="rounded-3xl border border-red-100 bg-red-50/20 p-8 text-center max-w-md mx-auto animate-in zoom-in-95">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">Código de Seguimiento No Registrado</h3>
          <p className="mt-2 font-sans text-sm text-gray-500 leading-relaxed">
            El código ingresado <span className="font-mono font-bold text-red-600">"{trackingInput}"</span> no coincide con ninguna orden activa en nuestro sistema.
          </p>
          <p className="mt-1 font-sans text-xs text-gray-400">
            Asegúrate de copiar el código completo incluyendo los guiones, o utiliza uno de los códigos de demostración sugeridos arriba.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setTrackingInput('');
                setSearchAttempted(false);
              }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-sans text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Intentar Nuevamente
            </button>
          </div>
        </div>
      )}

      {/* INITIAL IDLE SEARCH INSTRUCTION */}
      {!searchAttempted && (
        <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center max-w-md mx-auto">
          <Package className="mx-auto h-12 w-12 text-gray-300 animate-bounce" />
          <h3 className="mt-4 font-sans text-sm font-bold text-gray-900 uppercase">Consultar Estado de Envío</h3>
          <p className="mt-1.5 font-sans text-xs text-gray-500 leading-relaxed">
            Ingresa tu código en la barra superior o haz clic en alguno de los códigos de demostración sugeridos para visualizar el sistema de rastreo interactivo.
          </p>
        </div>
      )}
    </div>
  );
}
