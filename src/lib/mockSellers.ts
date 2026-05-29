export type Seller = {
  id: string;
  name: string;
  surname: string;
  email: string;
};

// Mock de vendedores
export const mockSeller = {
  id: "user_1",
  name: "Juan",
  surname: "Pérez",
  email: "juan@example.com",
};

export const mockSeller2 = {
  id: "user_2",
  name: "María",
  surname: "Gómez",
  email: "maria@example.com",
};

export const mockSeller3 = {
  id: "user_3",
  name: "Carlos",
  surname: "Ruiz",
  email: "carlos.r@example.com",
};

export const mockSellers: Seller[] = [
  mockSeller,
  mockSeller2,
  mockSeller3,
];
