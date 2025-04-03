//import '../styles/register.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Dados do formulário:", formData); // Logando os dados do formulário
      await axios.post("http://localhost:3000/api/setUser", formData);
      alert("Conta criada com sucesso!");
      //navigate("/login");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      alert("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label className="label">Email</label>
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
            <label className="label">Número de Telemóvel</label>
            <input
              type="tel"
              name="phone"
              placeholder="+351 912345678"
              className="input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label className="label">Senha</label>
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
          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl shadow-md hover:bg-indigo-700 active:bg-indigo-800 transform transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Criar Conta
          </button>
        </form>
        <div className="mt-6 text-center">
          Já tem uma conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-all duration-200"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
