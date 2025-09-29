// User.js

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import api from "../../config";
import './style.css';
import { useNavigate } from "react-router-dom";


const User = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await api.get("/user");
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  const handleRoleChange = async (userId) => {
    try {
      await api.patch(`/user/${userId}`);
      fetchUsers(); // Atualiza a lista de usuários após a mudança de role
    }
    catch (error) {
      console.error("Erro ao alterar role:", error);
    }
  };


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

        <div>
      <table className="user-list">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td
                style={{
                  backgroundColor: user.role === "Waiter" ? "#bb8011" : "#12568a",
                  color: "white",
                  textAlign: "center",
                  borderRadius: "4px",
                  padding: "0.3rem",
                  width: "80px",
                  margin: "0 auto"
                }}
              >
                {user.role}
              </td>
              <td className="tdButton">
                <button className="buttonChange" onClick={() => handleRoleChange(user._id)}>
                  Alterar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default User;