import './App.css'
import Navbar from './shared/components/navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Acomodacoes from "./features/acomocadocoes/acomodacoes";
import Hospedagem from "./features/hospedagem/hospedagem";
import Clientes from "./features/clientes/clientes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/acomodacoes" element={<Acomodacoes />} />
        <Route path="/hospedagem" element={<Hospedagem />} />
        <Route path="/" element={<Clientes />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
