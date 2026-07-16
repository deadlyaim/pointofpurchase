import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: "Men's Sweatsuit Set",
    description: "Conjunto de buzo deportivo para hombre. Sudadera con capucha y pantalones deportivos confeccionados con materiales suaves y cómodos, ideales para entrenamiento o uso casual.",
    price: 24.99,
    category: "Men's Clothing Sets",
    stock: 12,
    image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/2fe0229635114b80817b56f95e28ed93~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
    rating: 4.8,
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'prod-2',
    name: "Men's Casual Sports Set",
    description: "Conjunto minimalista y moderno de dos piezas para exteriores, chaqueta con cremallera + shorts, tela de poliéster, ajuste regular delgado, adecuado para primavera, verano y otoño, de secado rápido, transpirable, protector contra el sol, cómodo, ideal para entrenamientos diarios",
    price: 19.99,
    category: "Men's Clothing Sets",
    stock: 8,
    image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/0d4b6dd0d542468d9b605b6a16920ebe~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839',
    rating: 4.9,
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
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
  },
  {
    id: 'prod-3',
    name: 'Unisex Knitwear',
    description: 'Polo de manga corta de punto de punto de rayas Jacquard unisex',
    price: 14.99,
    category: "Men's Clothing Sets",
    stock: 25,
    image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/5325772acbc34b42a8aeb7204c1f0933~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839',
    rating: 4.6,
    featured: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      {
        name: 'Negro',
        value: '#000000',
        image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/5325772acbc34b42a8aeb7204c1f0933~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839'
      },
      {
        name: 'Rosado',
        value: '#fda4af',
        image: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/dc0591ed628c4ce5bedbd370803c7fab~tplv-fhlh96nyum-resize-webp:800:800.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast5&from=2378011839'
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Unisex Warm Casual Soft Slippers',
    description: 'Zapatos de exterior antideslizantes de piel sintética de alta calidad',
    price: 14.99,
    category: 'Shoes',
    stock: 15,
    image: 'https://p16-oec-general.ttcdn-us.com/tos-alisg-i-aphluv4xwc-sg/6d7693dd1cd4432db351b1b9406d72d7~tplv-fhlh96nyum-origin-jpeg.jpeg?dr=12178&t=555f072d&ps=933b5bde&shp=a3510d86&shcp=6ce186a1&idc=useast5&from=2739998086',
    rating: 4.7,
    featured: true,
    sizes: ['US6', 'US6.5', 'US7.5', 'US8', 'US9', 'US9.5', 'US10.5', 'US11', 'US12', 'US12.5']
  }
];

export const CATEGORIES = ['Todos', "Men's Clothing Sets", 'Shoes'];
