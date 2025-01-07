// Login.js
import { useState } from 'react';
import api from '../../config';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import FormatCurrency from '../../utils/FormatCurrency';
import logOut from '../../assets/log-out.svg';
import Trash from '../../assets/trash.svg';
import CheckTable from '../../assets/check-table.png';
import socketIo from 'socket.io-client';

const Tables = () => {
  const [user, setUser] = useState('');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser();
    fetchTables()
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
  }

  const fetchTables = async () => {
    const {data} = await api.get('/orders');

    setOrders(data);
  }

  const handleLogout = async () => {
    localStorage.removeItem('admin');
    navigate('/login');
  }
  const handleDeleteOrder = async (id) => {
    await api.delete(`/order/${id}`)
    fetchTables();
  }

  const handleCheckOrder = async (id) => {
    await api.patch(`/order/${id}`)
    return fetchTables();
  }

  
  
  
  return (
    <>
      <header>
        <h2>{`${user.role} - ${user.email}`}</h2>
        <button onClick={handleLogout}>
              <img src={logOut} />
          </button>
      </header>

      <div className='container'>
        {orders.map((order) => {
          const calculateTotal = () => {
            return order.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
            // console.log(order)
            };
          return (
          <div key={order._id} className='content-order'>
            <input type="checkbox" id={order._id} className='trigger-input' />
            <div className='table-wrapper'>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <label className='label-flex' htmlFor={order._id}>
                  <h3>Mesa {order.tableId.number}</h3>
                  <p>{order.userId.email}</p>
                  <span>{order.items.length} {order.items.length > 1? 'itens' : 'item'}</span>
                  {order.status === 'completed' && (
                    <img src={CheckTable} />
                  )}
                </label>
                <img src={Trash} onClick={() => handleDeleteOrder(order._id)}/>
              </div>
              <div className='opacity-container'>
                {order.items.map(({productId, quantity}, index) => {
                
                  return (
                    <div key={productId._id} className='faq-content'>
                        <img src={`http://10.0.0.110:3000${productId.imageURL}`} />
                        <div>
                          <h4>{quantity}x {productId.name}</h4>
                          <span>{FormatCurrency(productId.price)}</span>
                        </div>
                    </div>
                )})}
                        <div className="total">
                          <h3>Total: {FormatCurrency(calculateTotal())}</h3>
                          {order.status === 'pending' && (
                            <button onClick={() => handleCheckOrder(order._id)}>Check</button>
                          )}
                          {order.status === 'completed' && (
                            <button 
                                onClick={() => handleCheckOrder(order._id)}
                                style={{backgroundColor: 'red'}}>
                              Uncheck
                            </button>
                          )}
                        </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </>
  );
};

export default Tables;