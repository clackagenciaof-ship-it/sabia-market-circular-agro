import { useEffect, useState } from "react";

export type Product = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  produtor: string;
  estoque: number;
};

export type Surplus = {
  id: string;
  produto: string;
  produtor: string;
  quantidadeKg: number;
  desconto: number;
  tipo: "desconto" | "social" | "doacao";
};

export type Order = {
  id: string;
  produtoId: string;
  produto: string;
  produtor: string;
  quantidade: number;
  total: number;
  data: string;
};

export type WaterLog = {
  id: string;
  canteiro: string;
  litros: number;
  umidade: number;
  data: string;
};

export type WasteLog = {
  id: string;
  origem: string;
  pesoKg: number;
  tipo: "compostagem" | "alimentacao_animal";
  data: string;
};

const CATEGORIAS = ["Frutas", "Hortaliças", "Legumes", "Grãos", "Tubérculos", "Laticínios"];

const seedProducts: Product[] = [
  { id: "p1", nome: "Alface Crespa", categoria: "Hortaliças", preco: 3.5, produtor: "Sítio Boa Vista", estoque: 40 },
  { id: "p2", nome: "Tomate Caqui", categoria: "Legumes", preco: 6.0, produtor: "Família Teles", estoque: 25 },
  { id: "p3", nome: "Banana Prata", categoria: "Frutas", preco: 4.2, produtor: "Roça do Zé", estoque: 60 },
  { id: "p4", nome: "Mandioca", categoria: "Tubérculos", preco: 3.8, produtor: "Sítio Boa Vista", estoque: 80 },
  { id: "p5", nome: "Feijão Verde", categoria: "Grãos", preco: 8.5, produtor: "Família Costa", estoque: 30 },
  { id: "p6", nome: "Queijo Coalho", categoria: "Laticínios", preco: 22.0, produtor: "Laticínio Sabiá", estoque: 15 },
  { id: "p7", nome: "Couve Manteiga", categoria: "Hortaliças", preco: 3.0, produtor: "Horta Escolar", estoque: 50 },
  { id: "p8", nome: "Manga Espada", categoria: "Frutas", preco: 2.5, produtor: "Roça do Zé", estoque: 100 },
];

const seedSurplus: Surplus[] = [
  { id: "s1", produto: "Alface Crespa", produtor: "Sítio Boa Vista", quantidadeKg: 5, desconto: 50, tipo: "desconto" },
  { id: "s2", produto: "Banana madura", produtor: "Roça do Zé", quantidadeKg: 8, desconto: 70, tipo: "social" },
  { id: "s3", produto: "Couve", produtor: "Horta Escolar", quantidadeKg: 3, desconto: 100, tipo: "doacao" },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export const useProducts = () => useLocalStorage<Product[]>("sabia.products", seedProducts);
export const useSurplus = () => useLocalStorage<Surplus[]>("sabia.surplus", seedSurplus);
export const useOrders = () => useLocalStorage<Order[]>("sabia.orders", []);
export const useWater = () => useLocalStorage<WaterLog[]>("sabia.water", []);
export const useWaste = () => useLocalStorage<WasteLog[]>("sabia.waste", []);

export { CATEGORIAS };

export const uid = () => Math.random().toString(36).slice(2, 10);
