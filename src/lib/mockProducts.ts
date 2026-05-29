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
    name: string;
    surname: string;
    email: string;
  };

  images: {
    id: string;
    url: string;
    isPrimary: boolean;
    productId: string;
    createdAt: Date;
  }[];

  categoryId: string;
  category: {
    id: string;
    name: string;
  };

  createdAt: Date;
  updatedAt: Date;
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

import {
  mockSeller,
  mockSeller2,
  mockSeller3,
} from "./mockSellers";

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
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1456680415309-7756f7e8a9f6?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1614315585800-48208f2f2162?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1629196914375-f7e48f4777dd?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1633477189709-6694176d17fb?q=80&w=800&auto=format&fit=crop",
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
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
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
  {
    id: "prod_14",
    title: "El señor de los anillos: La comunidad del anillo",
    author: "J.R.R. Tolkien",
    description: "Tomo I de la saga más épica de la fantasía.",
    price: 21500,
    stock: 9,
    weight: 0.65,
    sellerId: mockSeller3.id,
    seller: mockSeller3,
    images: [
      {
        id: "img_14",
        url: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=800&auto=format&fit=crop",
        isPrimary: true,
        productId: "prod_14",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryFantasia.id,
    category: mockCategoryFantasia,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_15",
    title: "Ficciones",
    author: "Jorge Luis Borges",
    description: "Libro de cuentos que incluye 'La biblioteca de Babel'.",
    price: 13000,
    stock: 1,
    weight: 0.25,
    sellerId: mockSeller2.id,
    seller: mockSeller2,
    images: [
      {
        id: "img_15",
        url: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=800&auto=format&fit=crop",
        isPrimary: true,
        productId: "prod_15",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategoryClasicos.id,
    category: mockCategoryClasicos,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];