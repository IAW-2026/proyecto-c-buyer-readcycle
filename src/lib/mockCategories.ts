export type Category = {
  id: string;
  name: string;
};

// Mock de categorías
export const mockCategoryFiccion = { id: "cat_ficcion", name: "Ficcion" };
export const mockCategoryClasicos = { id: "cat_accion", name: "Accion" };
export const mockCategoryEnsayo = { id: "cat_historia", name: "Historia" };
export const mockCategoryPoesia = { id: "cat_poesia", name: "Poesia" };
export const mockCategoryCienciaFiccion = { id: "cat_scifi", name: "Ciencia Ficcion" };
export const mockCategoryFantasia = { id: "cat_fantasia", name: "Fantasia" };
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
