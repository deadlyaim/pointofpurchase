export interface Review {
  productId: string;
  productName: string;
  author: string;
  rating: number;
  comment: string;
  photo: string;
  photos?: string[];
}

export const REVIEWS: Review[] = [
  {
    productId: 'prod-4',
    productName: 'Unisex Warm Casual Soft Slippers',
    author: '𝐭**ꨄ',
    rating: 5,
    comment: 'Sencillo, originalmente soy 6.5, así que pedí una 39 y vino perfecta, talla perfecta, fiel a la talla y el material es DEMASIADO BUENO. Estoy deseando ponérmelos, se sienten tan cómodos',
    photo: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/6d6ea355e8fa4db39fc166d0a2a5a02e~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
    photos: [
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/6d6ea355e8fa4db39fc166d0a2a5a02e~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/549a8935311a47f986ae9613363b9125~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/20a0363d20dc4ed5b1aa70fc9d0f01d2~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
    ]
  },
  {
    productId: 'prod-4',
    productName: 'Unisex Warm Casual Soft Slippers',
    author: '𝔍**𝔫',
    rating: 5,
    comment: 'Muy cómodos y con mucho estilo, los recomiendo mucho',
    photo: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/d7ab8139b48340d2a185e3def8f525d5~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
    photos: [
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/d7ab8139b48340d2a185e3def8f525d5~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/c4b32836086848a3bbcdad0d8f3242d8~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
    ]
  },
  {
    productId: 'prod-1',
    productName: "Men's Sweatsuit Set",
    author: 'W**n C**o',
    rating: 5,
    comment: 'Perfect 🤩',
    photo: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/f772f5fd854a4dc89191477d334c7e97~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
  },
  {
    productId: 'prod-3',
    productName: 'Unisex Knitwear',
    author: 'I**l',
    rating: 5,
    comment: 'super nice',
    photo: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/c913614764ba4220a1995e4e2c44dbdb~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
  },
  {
    productId: 'prod-3',
    productName: 'Unisex Knitwear',
    author: 'j**️',
    rating: 5,
    comment: 'Llegó más rápido de lo esperado',
    photo: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/8bbca8af1fd7491e9fc1ec99aa6cdf87~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
  },
  {
    productId: 'prod-5',
    productName: 'Stars Pattern Casual Set',
    author: 's**b',
    rating: 5,
    comment: 'La ropa no está nada mal',
    photo: 'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/81c6827a68994fd1826379a7b863d45e~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
    photos: [
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/81c6827a68994fd1826379a7b863d45e~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/32fb6b3535194e6c999dd03005c348cc~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/9bb33624be56426e98dc57dbdd1d50ad~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839',
      'https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/0e34358025d14fc2bf9e96d26989c7f4~tplv-fhlh96nyum-crop-webp:300:300.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=607f11de&idc=useast8&from=2378011839'
    ]
  }
];
