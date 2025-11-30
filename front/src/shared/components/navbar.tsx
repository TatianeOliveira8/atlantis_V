import { GiWaterSplash } from "react-icons/gi";

function Navbar() {
  return (
    <nav className="bg-blue-900 px-6 py-6 flex justify-between items-center shadow-md ">
      <div className="flex items-center gap-2">
        <GiWaterSplash className="text-white text-2xl" />
        <h1 className="text-white text-xl font-semibold">ATLANTIS</h1>
      </div>

      <ul className="flex gap-8 text-lg">
  <li>
    <a
      href="/"
      className="text-gray-200 hover:text-white transition-all active:scale-95"
    >
      hóspedes
    </a>
  </li>
  <li>
    <a
      href="/hospedagem"
      className="text-gray-200 hover:text-white transition-all active:scale-95"
    >
      hospedagem
    </a>
  </li>
  <li>
    <a
      href="/acomodacoes"
      className="text-gray-200 hover:text-white transition-all active:scale-95"
    >
      acomodações
    </a>
  </li>
</ul>
    </nav>
  );
}

export default Navbar;
