import { useEffect, useState } from "react";

export type Role = "produtor" | "escola" | "comprador" | "admin";

export type TipoAnunciante = "Produtor" | "Escola" | "Associação" | "Cooperativa";

export type DisponibilidadeEspecial = "normal" | "excedente" | "desconto" | "doacao" | "urgente";

export type Product = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  produtor: string;
  tipoAnunciante: TipoAnunciante;
  estoque: number;
  cidade: string;
  estado: string;
  localComercializacao: string;
  pontoEntrega?: string;
  ultimaColheita?: boolean;
  disponibilidadeEspecial?: DisponibilidadeEspecial;
  descricao?: string;
  foto?: string;
};

export type Surplus = {
  id: string;
  produto: string;
  produtor: string;
  cidade: string;
  estado: string;
  quantidadeKg: number;
  desconto: number;
  tipo: "desconto" | "social" | "doacao" | "urgente";
  foto?: string;
};

export type Order = {
  id: string;
  produtoId: string;
  produto: string;
  produtor: string;
  comprador: string;
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
  tipo: "compostagem" | "alimentacao_animal" | "reaproveitamento";
  data: string;
};

const CATEGORIAS = [
  "Verduras",
  "Legumes",
  "Frutas",
  "Temperos",
  "Raízes e tubérculos",
  "Grãos",
  "Laticínios",
];

const TIPOS_ANUNCIANTE: TipoAnunciante[] = ["Produtor", "Escola", "Associação", "Cooperativa"];

const seedProducts: Product[] = [
  {
    id: "p1", nome: "Alface crespa", categoria: "Verduras", preco: 3.0, unidade: "unidade",
    produtor: "Dona Maria Hortaliças", tipoAnunciante: "Produtor", estoque: 20,
    cidade: "Floriano", estado: "PI",
    localComercializacao: "Feira local / entrega combinada",
    pontoEntrega: "Feira do bairro Sambaíba",
    foto: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=600&q=70",
  },
  {
    id: "p2", nome: "Tomate", categoria: "Legumes", preco: 7.0, unidade: "kg",
    produtor: "Sítio Boa Esperança", tipoAnunciante: "Produtor", estoque: 15,
    cidade: "Nazaré do Piauí", estado: "PI",
    localComercializacao: "Venda direta / entrega na comunidade",
    foto: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=70",
  },
  {
    id: "p3", nome: "Banana prata", categoria: "Frutas", preco: 5.0, unidade: "kg",
    produtor: "Seu João da Feira", tipoAnunciante: "Produtor", estoque: 25,
    cidade: "Floriano", estado: "PI",
    localComercializacao: "Feira do mercado municipal",
    pontoEntrega: "Mercado Municipal — banca 12",
    foto: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=70",
  },
  {
    id: "p4", nome: "Abacaxi", categoria: "Frutas", preco: 6.0, unidade: "unidade",
    produtor: "Horta Escolar Osvaldo", tipoAnunciante: "Escola", estoque: 25,
    cidade: "Floriano", estado: "PI",
    localComercializacao: "Escola / horta escolar",
    pontoEntrega: "Retirada na escola",
    ultimaColheita: true, disponibilidadeEspecial: "excedente",
    descricao: "Abacaxi maduro colhido na horta escolar.",
    foto: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=70",
  },
  {
    id: "p5", nome: "Cenoura", categoria: "Legumes", preco: 4.0, unidade: "kg",
    produtor: "Associação Raízes do Piauí", tipoAnunciante: "Associação", estoque: 40,
    cidade: "Itaueira", estado: "PI",
    localComercializacao: "Associação / entrega programada",
    descricao: "Cenoura fresca, colhida na semana.",
    foto: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=70",
  },
];

const seedSurplus: Surplus[] = [
  { id: "s1", produto: "Alface crespa", produtor: "Dona Maria Hortaliças", cidade: "Floriano", estado: "PI", quantidadeKg: 5, desconto: 50, tipo: "desconto", foto: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=600&q=70" },
  { id: "s2", produto: "Banana prata madura", produtor: "Seu João da Feira", cidade: "Floriano", estado: "PI", quantidadeKg: 8, desconto: 70, tipo: "urgente", foto: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=70" },
  { id: "s3", produto: "Abacaxi", produtor: "Horta Escolar Osvaldo", cidade: "Floriano", estado: "PI", quantidadeKg: 4, desconto: 100, tipo: "doacao", foto: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=70" },
];

const now = new Date();
const dt = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

const seedOrders: Order[] = [
  { id: "o1", produtoId: "p1", produto: "Alface crespa", produtor: "Dona Maria Hortaliças", comprador: "Ana Clara", quantidade: 3, total: 9.0, data: dt(0) },
  { id: "o2", produtoId: "p2", produto: "Tomate", produtor: "Sítio Boa Esperança", comprador: "Luiz Gustavo", quantidade: 2, total: 14.0, data: dt(1) },
  { id: "o3", produtoId: "p3", produto: "Banana prata", produtor: "Seu João da Feira", comprador: "Maria Clara", quantidade: 4, total: 20.0, data: dt(1) },
  { id: "o4", produtoId: "p4", produto: "Abacaxi", produtor: "Horta Escolar Osvaldo", comprador: "Joiza Carvalho", quantidade: 2, total: 12.0, data: dt(2) },
  { id: "o5", produtoId: "p5", produto: "Cenoura", produtor: "Associação Raízes do Piauí", comprador: "Jhonnathas", quantidade: 3, total: 12.0, data: dt(3) },
];

const seedWater: WaterLog[] = [
  { id: "w1", canteiro: "Canteiro A - Hortaliças", litros: 18, umidade: 65, data: dt(0) },
  { id: "w2", canteiro: "Canteiro B - Temperos", litros: 12, umidade: 58, data: dt(1) },
  { id: "w3", canteiro: "Horta Escolar", litros: 25, umidade: 72, data: dt(2) },
];

const seedWaste: WasteLog[] = [
  { id: "r1", origem: "Cozinha escolar", pesoKg: 6.5, tipo: "compostagem", data: dt(0) },
  { id: "r2", origem: "Cantina", pesoKg: 4.0, tipo: "compostagem", data: dt(1) },
  { id: "r3", origem: "Sala 4 - Lanche", pesoKg: 2.8, tipo: "alimentacao_animal", data: dt(2) },
  { id: "r4", origem: "Cozinha escolar", pesoKg: 5.2, tipo: "compostagem", data: dt(3) },
  { id: "r5", origem: "Recebido Última Colheita", pesoKg: 3.0, tipo: "reaproveitamento", data: dt(2) },
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

export const useProducts = () => useLocalStorage<Product[]>("sabia.products.v5", seedProducts);
export const useSurplus = () => useLocalStorage<Surplus[]>("sabia.surplus.v5", seedSurplus);
export const useOrders = () => useLocalStorage<Order[]>("sabia.orders.v5", seedOrders);
export const useWater = () => useLocalStorage<WaterLog[]>("sabia.water.v5", seedWater);
export const useWaste = () => useLocalStorage<WasteLog[]>("sabia.waste.v5", seedWaste);
export const useRole = () => useLocalStorage<Role>("sabia.role.v1", "comprador");

export { CATEGORIAS, TIPOS_ANUNCIANTE };

export const ROLE_LABEL: Record<Role, string> = {
  produtor: "Produtor / Vendedor",
  escola: "Escola",
  comprador: "Comprador",
  admin: "Administrador",
};

export const uid = () => Math.random().toString(36).slice(2, 10);
