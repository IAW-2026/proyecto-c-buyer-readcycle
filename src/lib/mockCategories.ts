export type Category = {
  id: string;
  name: string;
};

// Mock de categorías
export const mockCategoryFiccion = { id: "cat_ficcion", name: "Ficción" };
export const mockCategoryClasicos = { id: "cat_clasicos", name: "Clásicos" };
export const mockCategoryEnsayo = { id: "cat_ensayo", name: "Ensayo" };
export const mockCategoryPoesia = { id: "cat_poesia", name: "Poesía" };
export const mockCategoryCienciaFiccion = { id: "cat_scifi", name: "Ciencia Ficción" };
export const mockCategoryFantasia = { id: "cat_fantasia", name: "Fantasía" };
export const mockCategoryTerror = { id: "cat_terror", name: "Terror" };

export const mockCategories: Category[] = [
  mockCategoryFiccion,
  mockCategoryClasicos,
  mockCategoryEnsayo,
  mockCategoryPoesia,
  mockCategoryCienciaFiccion,
  mockCategoryFantasia,
  mockCategoryTerror,
];
