// src/lib/mockProducts.ts

export type Product = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  sellerId: string;
  seller: {
    id: string;
    name?: string;
    surname?: string;
    email?: string;
  };

  images: {
    id: string;
    url: string;
    isPrimary: boolean;
    productId: string;
    createdAt: Date | string;
  }[];

  categoryId: string;
  category: {
    id: string;
    name: string;
  };

  createdAt: Date | string;
  updatedAt: Date | string;
};

import {
  mockCategoryFiccion,
  mockCategoryClasicos,
  mockCategoryEnsayo,
  mockCategoryPoesia,
  mockCategoryCienciaFiccion,
  mockCategoryFantasia,
  mockCategoryTerror,
} from "./mockCategories";

const mockSeller = {
  id: "user_1",
  name: "Juan",
  surname: "Pérez",
  email: "juan@example.com",
};

const mockSeller2 = {
  id: "user_2",
  name: "María",
  surname: "Gómez",
  email: "maria@example.com",
};

const mockSeller3 = {
  id: "user_3",
  name: "Carlos",
  surname: "Ruiz",
  email: "carlos.r@example.com",
};

export const mockProducts: Product[] = [
  {
    id: "prod_1",
    title: "El Aleph",
    author: "Jorge Luis Borges",
    description: "Excelente estado. Clásico de la literatura universal con sus mejores cuentos.",
    price: 18500,
    stock: 5,
    weight: 0.3,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_1",
        url: "https://lenguajeclaro.com/wp-content/uploads/El-Aleph.webp",
        isPrimary: true,
        productId: "prod_1",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryClasicos.id,
    category: mockCategoryClasicos,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_2",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    description: "Buen estado. Edición conmemorativa de la RAE.",
    price: 15200,
    stock: 2,
    weight: 0.4,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_2",
        url: "https://imgv2-1-f.scribdassets.com/img/word_document/843446828/original/bdf392138f/1?v=1",
        isPrimary: true,
        productId: "prod_2",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryFiccion.id,
    category: mockCategoryFiccion,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_3",
    title: "Rayuela",
    author: "Julio Cortázar",
    description: "Primera Edición (Colección). Excelente estado, incluye apéndice.",
    price: 21000,
    stock: 0,
    weight: 0.5,
    sellerId: mockSeller2.id,
    seller: mockSeller2,
    images: [
      {
        id: "img_3",
        url: "https://caroferrara.com/wp-content/uploads/2020/09/Rayuela-1.jpg",
        isPrimary: true,
        productId: "prod_3",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryFiccion.id,
    category: mockCategoryFiccion,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_4",
    title: "1984",
    author: "George Orwell",
    description: "Libro nuevo. La distopía más famosa del siglo XX.",
    price: 13500,
    stock: 12,
    weight: 0.35,
    sellerId: mockSeller3.id,
    seller: mockSeller3,
    images: [
      {
        id: "img_4",
        url: "https://cdn.livriz.com/media/mediaspace/F9AFB48D-741D-4834-B760-F59344EEFF34/45/d5d6f19f-fbd6-4a4b-8423-912ce2ebaec0/mediamodifier99ba31c279c.webp",
        isPrimary: true,
        productId: "prod_4",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryCienciaFiccion.id,
    category: mockCategoryCienciaFiccion,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_5",
    title: "Sapiens: De animales a dioses",
    author: "Yuval Noah Harari",
    description: "Ensayo histórico y antropológico. Tapa blanda.",
    price: 22000,
    stock: 8,
    weight: 0.6,
    sellerId: mockSeller2.id,
    seller: mockSeller2,
    images: [
      {
        id: "img_5",
        url: "https://www.edicontinente.com.ar/image/titulos/9788466347518.jpg",
        isPrimary: true,
        productId: "prod_5",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryEnsayo.id,
    category: mockCategoryEnsayo,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_6",
    title: "Dune",
    author: "Frank Herbert",
    description: "El clásico de la ciencia ficción que inspiró la película.",
    price: 19800,
    stock: 4,
    weight: 0.7,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_6",
        url: "https://caroferrara.com/wp-content/uploads/2025/09/Dune-1.jpg",
        isPrimary: true,
        productId: "prod_6",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryCienciaFiccion.id,
    category: mockCategoryCienciaFiccion,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_7",
    title: "El Hobbit",
    author: "J.R.R. Tolkien",
    description: "Edición ilustrada por Alan Lee. Ideal para coleccionistas.",
    price: 25000,
    stock: 3,
    weight: 0.45,
    sellerId: mockSeller3.id,
    seller: mockSeller3,
    images: [
      {
        id: "img_7",
        url: "https://cdn.kobo.com/book-images/a821b502-0d07-4921-ac14-e431625d04e7/1200/1200/False/the-hobbit-illustrated-by-alan-lee.jpg",
        isPrimary: true,
        productId: "prod_7",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryFantasia.id,
    category: mockCategoryFantasia,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_8",
    title: "Veinte poemas de amor y una canción desesperada",
    author: "Pablo Neruda",
    description: "Clásico de la poesía latinoamericana. Tapa dura pequeña.",
    price: 9500,
    stock: 15,
    weight: 0.15,
    sellerId: mockSeller2.id,
    seller: mockSeller2,
    images: [
      {
        id: "img_8",
        url: "https://m.media-amazon.com/images/I/71mP5hPPyZL.jpg",
        isPrimary: true,
        productId: "prod_8",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryPoesia.id,
    category: mockCategoryPoesia,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_9",
    title: "Drácula",
    author: "Bram Stoker",
    description: "La novela epistolar original que dio origen al mito del vampiro.",
    price: 14000,
    stock: 6,
    weight: 0.4,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_9",
        url: "https://acdn-us.mitiendanube.com/stores/004/008/965/products/img_7160-d5a3657644fe8e662817376613316272-1024-1024.webp",
        isPrimary: true,
        productId: "prod_9",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryTerror.id,
    category: mockCategoryTerror,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_10",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description: "Buen estado. Páginas ligeramente amarillentas por el tiempo.",
    price: 12400,
    stock: 10,
    weight: 0.3,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_10",
        url: "https://www.mentesliberadas.com/wp-content/uploads/2012/11/fahrenheit-451-web.webp",
        isPrimary: true,
        productId: "prod_10",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryCienciaFiccion.id,
    category: mockCategoryCienciaFiccion,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_11",
    title: "El nombre de la rosa",
    author: "Umberto Eco",
    description: "Misterio medieval magistralmente escrito.",
    price: 16500,
    stock: 7,
    weight: 0.55,
    sellerId: mockSeller3.id,
    seller: mockSeller3,
    images: [
      {
        id: "img_11",
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC65LB8xzskAjPNeX55ieVJypqqGdfPkoiMw&s",
        isPrimary: true,
        productId: "prod_11",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryFiccion.id,
    category: mockCategoryFiccion,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_12",
    title: "Frankenstein",
    author: "Mary Shelley",
    description: "El moderno Prometeo. Edición bilingüe.",
    price: 11000,
    stock: 5,
    weight: 0.35,
    sellerId: mockSeller2.id,
    seller: mockSeller2,
    images: [
      {
        id: "img_12",
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9A9Y12EIRrBDvzebRWd0ELcAWTemjbOxWjw&s",
        isPrimary: true,
        productId: "prod_12",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryTerror.id,
    category: mockCategoryTerror,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_13",
    title: "Breve historia del tiempo",
    author: "Stephen Hawking",
    description: "Física y cosmología explicada para todo público.",
    price: 17300,
    stock: 4,
    weight: 0.4,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_13",
        url: "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/9786079377373.jpg",
        isPrimary: true,
        productId: "prod_13",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryEnsayo.id,
    category: mockCategoryEnsayo,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];