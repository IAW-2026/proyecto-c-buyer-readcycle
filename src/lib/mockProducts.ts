// src/lib/mockProducts.ts

export type Product = {
  id: string;
  title: string;
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

// Mock de categorías
const mockCategory = {
  id: "cat_1",
  name: "Literatura",
};

// Mock de vendedor
const mockSeller = {
  id: "user_1",
  name: "Juan",
  surname: "Pérez",
  email: "juan@example.com",
};

export const mockProducts: Product[] = [
  {
    id: "prod_1",
    title: "El Aleph",
    description: "Excelente estado. Clásico de la literatura universal.",
    price: 18500,
    stock: 5,
    weight: 0.3,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_1",
        url: "/images/book-1.jpg",
        isPrimary: true,
        productId: "prod_1",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategory.id,
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_2",
    title: "Cien años de soledad",
    description: "Buen estado. Edición especial con ilustraciones.",
    price: 15200,
    stock: 2,
    weight: 0.4,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_2",
        url: "/images/book-2.jpg",
        isPrimary: true,
        productId: "prod_2",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategory.id,
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_3",
    title: "Rayuela",
    description: "Primera Edición (Colección). Excelente estado.",
    price: 21000,
    stock: 0,
    weight: 0.5,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_3",
        url: "/images/book-3.jpg",
        isPrimary: true,
        productId: "prod_3",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategory.id,
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_4",
    title: "Ficciones",
    description: "Buen estado. Páginas ligeramente amarillentas por el tiempo.",
    price: 12400,
    stock: 10,
    weight: 0.3,
    sellerId: mockSeller.id,
    seller: mockSeller,
    images: [
      {
        id: "img_4",
        url: "/images/book-4.jpg",
        isPrimary: true,
        productId: "prod_4",
        createdAt: new Date(),
      },
    ],
    categoryId: mockCategory.id,
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
