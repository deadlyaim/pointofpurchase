import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    trackingNumber: 'TRK-983710294812',
    customerName: 'Sofía Alarcón',
    customerEmail: 'sofia@example.com',
    customerAddress: 'Calle de Serrano 45, 3º B',
    customerCity: 'Madrid',
    customerPhone: '+34 612 345 678',
    items: [
      {
        productId: 'prod-1',
        productName: "Men's Sweatsuit Set",
        quantity: 1,
        priceAtPurchase: 89.00,
        image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/2fe0229635114b80817b56f95e28ed93~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
      },
      {
        productId: 'prod-5',
        productName: 'Taza de Cerámica Artesanal',
        quantity: 2,
        priceAtPurchase: 24.00,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
      }
    ],
    total: 137.00,
    paymentMethod: 'Tarjeta de Crédito (Visa •••• 4242)',
    createdAt: '2026-07-12T14:30:00Z',
    status: 'shipped',
    carrier: 'DHL Global Express',
    estimatedDelivery: '16 de Julio, 2026',
    statusHistory: [
      {
        status: 'shipped',
        timestamp: '2026-07-13T09:15:00Z',
        description: 'El paquete ha salido del centro de distribución y está en ruta de reparto.'
      },
      {
        status: 'preparing',
        timestamp: '2026-07-12T18:20:00Z',
        description: 'Control de calidad completado. El pedido ha sido embalado y transferido al transportista.'
      },
      {
        status: 'payment_pending',
        timestamp: '2026-07-12T14:30:00Z',
        description: 'Pago recibido y verificado con éxito.'
      }
    ]
  },
  {
    id: 'ord-1002',
    trackingNumber: 'TRK-482019582736',
    customerName: 'Mateo Fernández',
    customerEmail: 'mateo.f@example.com',
    customerAddress: 'Av. del Libertador 1250',
    customerCity: 'Buenos Aires',
    customerPhone: '+54 11 4321-8765',
    items: [
      {
        productId: 'prod-2',
        productName: 'Teclado Mecánico Alum 65',
        quantity: 1,
        priceAtPurchase: 145.00,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
      }
    ],
    total: 145.00,
    paymentMethod: 'Tarjeta de Crédito (Mastercard •••• 9901)',
    createdAt: '2026-07-13T10:05:00Z',
    status: 'preparing',
    carrier: 'FedEx Priority',
    estimatedDelivery: '18 de Julio, 2026',
    statusHistory: [
      {
        status: 'preparing',
        timestamp: '2026-07-13T11:45:00Z',
        description: 'El pedido está siendo procesado por nuestro equipo de bodega para el embalaje.'
      },
      {
        status: 'payment_pending',
        timestamp: '2026-07-13T10:05:00Z',
        description: 'Pago autorizado. El pedido ingresó al sistema de preparación.'
      }
    ]
  },
  {
    id: 'ord-1003',
    trackingNumber: 'TRK-123456789012',
    customerName: 'Lucía Méndez',
    customerEmail: 'lucia.mendez@example.com',
    customerAddress: 'Diagonal San Antonio 1102',
    customerCity: 'Ciudad de México',
    customerPhone: '+52 55 9876 5432',
    items: [
      {
        productId: 'prod-3',
        productName: 'Cartera Slim de Cuero Premium',
        quantity: 1,
        priceAtPurchase: 45.00,
        image: 'https://images.unsplash.com/photo-1627124357470-1241a55f94d3?w=600&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-8',
        productName: 'Botella Térmica Obsidian',
        quantity: 1,
        priceAtPurchase: 29.00,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80'
      }
    ],
    total: 74.00,
    paymentMethod: 'PayPal (lucia***@email.com)',
    createdAt: '2026-07-10T08:12:00Z',
    status: 'delivered',
    carrier: 'Estafeta Courier',
    estimatedDelivery: '12 de Julio, 2026',
    statusHistory: [
      {
        status: 'delivered',
        timestamp: '2026-07-12T13:40:00Z',
        description: 'Entregado con éxito. Recibido por el residente del domicilio.'
      },
      {
        status: 'shipped',
        timestamp: '2026-07-11T09:00:00Z',
        description: 'En tránsito hacia el centro logístico local de entrega.'
      },
      {
        status: 'preparing',
        timestamp: '2026-07-10T14:30:00Z',
        description: 'Empacado y listo para retiro del transportista.'
      },
      {
        status: 'payment_pending',
        timestamp: '2026-07-10T08:12:00Z',
        description: 'Pago recibido.'
      }
    ]
  }
];
