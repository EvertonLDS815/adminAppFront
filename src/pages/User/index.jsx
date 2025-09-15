// User.js

import { useState } from "react";
import Header from "../../components/Header";
import api from "../../config";
import './style.css';
import { useNavigate } from "react-router-dom";


const User = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleUserSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    await api.post('/create', {email, password});

    
      navigate('/tables', { replace: true });
  }

  return (
    <>
      <Header />
        <form id="user-form" onSubmit={handleUserSubmit}>
          <label>
            <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Criar Usuário</button>
        </form>
    </>
  );
};

export default User;