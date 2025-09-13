import { useNavigate } from "react-router-dom";
import logOut from '../../assets/log-out.svg';
import { useEffect, useState } from "react";
import api from "../../config";


const Header = () => {
    const [user, setUser] = useState('');

    
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
      }, []);

    const fetchUser = async () => {
    const {data} = await api.get('/user');

    setUser(data);
    if (data.role === 'Waiter') {
      return handleLogout();
    }
  };

    const handleLogout = async () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };
    return (
        <header>
            <h2>{`${user.role} - ${user.email}`}</h2>
            <button onClick={handleLogout}>
                <img src={logOut} />
          </button>
        </header>
    )
}

export default Header;