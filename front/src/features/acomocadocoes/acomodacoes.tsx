import { useState, useEffect } from "react";
import Card from "../../shared/components/ui/card";
import { getAcomodacoes } from "../../shared/api";

function Acomodacoes() {
  const [acomodacoes, setAcomodacoes] = useState<any[]>([]);

  const fetchAcomodacoes = () => {
    getAcomodacoes().then(data => {
      const mapped = data.map((a: any) => ({
        nome: a.nomeAcomadacao,
        solteiro: a.camaSolteiro,
        casal: a.camaCasal,
        suite: a.suite,
        clima: a.climatizacao ? "Sim" : "Não",
        garagem: a.garagem
      }));
      setAcomodacoes(mapped);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchAcomodacoes();
  }, []);

  return (
    <div className="p-8">
      <Card title="Acomodações" rows={acomodacoes} />
    </div>
  );
}

export default Acomodacoes;
