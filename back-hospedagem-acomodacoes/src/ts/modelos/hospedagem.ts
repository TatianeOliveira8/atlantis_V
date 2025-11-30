import Cliente from "./cliente";
import Acomodacao from "./acomodacao";

export default class Hospedagem {
  constructor(
    public cliente: Cliente,
    public acomodacao: Acomodacao,
    public dataEntrada: Date,
    public dataSaida?: Date
  ) {}
}
