import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/auth");
  }

  return (
    <header className="border-b border-slate-800 px-6 py-3 flex justify-between items-center bg-slate-950">
      <h1 className="text-lg font-semibold">{title}</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-black px-3 py-1 rounded-lg hover:bg-red-400 text-sm"
      >
        Logout
      </button>
    </header>
  );
}
// export default function Topbar({ title }) {
//   return (
//     <header className="border-b border-slate-800 px-6 py-3 flex justify-between items-center bg-slate-950">
//       <h1 className="text-lg font-semibold">{title}</h1>

//       <div className="text-sm text-slate-400">
//         CryptoGuard
//       </div>
//     </header>
//   );
// }
