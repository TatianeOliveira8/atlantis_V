import { useState, useEffect } from "react";
import Card from "../../shared/components/ui/card";
import Button from "../../shared/components/ui/button";
import Adicionar from "./components/adicionar";
import ConfirmPopup from "../../shared/components/ui/popupConfirm";
import { getHospedagens, getClientes, getAcomodacoes, addHospedagem, deleteHospedagem } from "../../shared/api";

type Hospedagem = {
  id?: number;
  nome: string;
  solteiro: number;
  casal: number;
  suite: number;
  clima: string;
  garagem: number;
  entrada: string;
  saida: string;
};

function Hospedagem() {
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [excluirIndex, setExcluirIndex] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [hospData, cliData, acomData] = await Promise.all([
        getHospedagens(),
        getClientes(),
        getAcomodacoes()
      ]);

      const mapped = hospData.map((h: any) => {
        const cliente = cliData.find((c: any) => c.id === h.cliente_id);
        const acomodacao = acomData.find((a: any) => a.id === h.acomodacao_id);

        return {
          id: h.id,
          nome: cliente ? cliente.nome : `Cliente ${h.cliente_id}`,
          solteiro: acomodacao ? acomodacao.camaSolteiro : 0,
          casal: acomodacao ? acomodacao.camaCasal : 0,
          suite: acomodacao ? acomodacao.suite : 0,
          clima: acomodacao ? (acomodacao.climatizacao ? "Sim" : "Não") : "?",
          garagem: acomodacao ? acomodacao.garagem : 0,
          entrada: h.dataEntrada,
          saida: h.dataSaida
        };
      });
      setHospedagens(mapped);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExcluir = async () => {
    if (excluirIndex !== null) {
      const hosp = hospedagens[excluirIndex];
      if (hosp && hosp.id) {
        try {
          await deleteHospedagem(hosp.id);
          await fetchData();
        } catch (error) {
          console.error("Error deleting hospedagem:", error);
        }
      }
      setConfirmOpen(false);
      setExcluirIndex(null);
    }
  };

  const handleSave = async (h: any) => {
    try {
      await addHospedagem(h);
      await fetchData();
      setOpen(false);
    } catch (error) {
      console.error("Error adding hospedagem:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}>Adicionar</Button>
      </div>

      <Card
        title="Lista Hospedagens"
        rows={hospedagens}
        onDelete={(i) => {
          setExcluirIndex(i);
          setConfirmOpen(true);
        }}
      />

      {open && (
        <Adicionar
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}

      {confirmOpen && (
        <ConfirmPopup
          message="Deseja mesmo excluir esta hospedagem?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleExcluir}
        />
      )}
    </div>
  );
}

export default Hospedagem;
