import '../styles/login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import axios from "axios";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", formData);
      console.log("Login bem-sucedido:", response.data);
      navigate("/"); // Redireciona para o dashboard após login bem-sucedido
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Email ou senha inválidos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative overflow-hidden">
        <div className="relative z-10 px-12 text-white">
          <h2 className="text-5xl font-extrabold mb-6">Travelex</h2>
          <p className="text-xl font-light">Conectando viajantes ao redor do mundo.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50">
        <div className="w-full max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Email address</label>
              <FiMail className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 text-3xl" />
              <input
                type="email"
                name="email"
                placeholder="Seu email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <FiLock className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 text-3xl" />
              <input
                type="password"
                name="password"
                placeholder="Sua senha"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl shadow-md flex items-center justify-center space-x-2 hover:bg-indigo-700 active:bg-indigo-800 transform transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>Entrar</span>
              <FiArrowRight className="ml-2" />
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              Novo por aqui?
              <button
                onClick={() => navigate("/register")}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                Criar nova conta
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
