export type Documento = {
  tipo: "CPF" | "RG" | "Passaporte";
  numero: string;
  dataExpedicao: string;
};

export type Endereco = {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
};

export type ClienteTitular = {
  id?: number;
  nome: string;
  nomeSocial?: string;
  dataNascimento: string;
  endereco?: Endereco;
  telefones: string[];
  documentos: Documento[];
  titular_id?: number;
};

export type ClienteDependente = {
  id?: number;
  titular_id?: number;
  titular: string;
  nome: string;
  nomeSocial?: string;
  dataNascimento: string;
  endereco?: Endereco;
  cpf: string;
  telefone: string;
};

export const clientesTitulares: ClienteTitular[] = [];

export const clientesDependentes: ClienteDependente[] = [];
