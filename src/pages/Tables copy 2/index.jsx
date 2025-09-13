// Login.js
import { useState } from 'react';
import api from '../../config';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import logOut from '../../assets/log-out.svg';
import socketIo from 'socket.io-client';
import Content from '../../components/Content';
import CreateProduct from '../../assets/box.png';
import CreateCategory from '../../assets/category.png';

const Tables = () => {
  const [user, setUser] = useState('');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchTables();
  }, []);

  useEffect(() => {
    // Conectar ao servidor WebSocket (ajuste o URL se necessário)
    const socket = socketIo('http://10.0.0.110:3000', {
      transports: ['websocket'],  // Certifique-se de que está usando WebSocket
    });

    // Escutar o evento 'orders@new'
    socket.on('orders@new', (order) => {
      setOrders(prevState => [...prevState, order]);  // Adiciona o pedido à lista
    });

    socket.on('order@deleted', (order) => {
    
      if (!order || !order._id) {
        console.warn('Pedido inválido recebido:', order);
        return;
      }
    
      setOrders((prevState) => {
        const validOrders = prevState.filter((o) => o && o._id); // Remove objetos inválidos
        return validOrders.filter((o) => o._id !== order._id);
      });
    });

    socket.on('order@checked', (updatedOrder) => {
      setOrders((prevState) => {
    
        // Atualiza ou adiciona o pedido, sem removê-lo
        const orderExists = prevState.some((order) => order._id === updatedOrder._id);
        if (orderExists) {
          // Atualiza o pedido existente
          return prevState.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          );
        } else {
          // Adiciona um novo pedido
          return [...prevState, updatedOrder];
        }
      });
    });

    // Limpeza ao desmontar o componente
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const fetchUser = async () => {
    const {data} = await api.get('/user');

    setUser(data);
    if (data.role === 'Waiter') {
      return handleLogout();
    }
  };

  const fetchTables = async () => {
    const {data} = await api.get('/orders');

    setOrders(data);
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  const handleCreateCategory = async () => {
    navigate('/categories');
  };
  const handleCreateProduct = async () => {
    navigate('/products');
  };
  
  
  
  return (
    <>
      <header>
        <h2>{`${user.role} - ${user.email}`}</h2>
        <button onClick={handleLogout}>
              <img src={logOut} />
          </button>
      </header>

      <div className='division'>

        <button onClick={handleCreateProduct} className='create-product'>
          <img src={CreateProduct} />
          <span>Criar produto</span>
        </button>
        <button onClick={handleCreateCategory} className='create-product'>
          <img src={CreateCategory} />
          <span>Criar Categoria</span>
        </button>
        
      </div>
        <div className='container'>
          {orders.map((order) => (
            <Content key={order._id} order={order} onFetchTable={fetchTables}/>
          ))}
        </div>
    </>
  );
};

export default Tables;