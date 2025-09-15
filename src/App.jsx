// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import history from './utils/redirect';

// Import Components
import Login from './pages/Login';
import Tables from './pages/Tables';
import User from './pages/User';
import Product from './pages/Product';

const App = () => {
  const token = localStorage.getItem('admin');
  return (
    <Router>
      <Routes history={history}>
        <Route path="/" element={token ? <Navigate to="/tables" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute component={Login} />} />
        <Route path="/tables" element={<PrivateRoute component={Tables} />} />
        <Route path="/users" element={<PrivateRoute component={User} />} />
        <Route path="/products" element={<PrivateRoute component={Product} />} />
      </Routes>
    </Router>
  );
};

const PrivateRoute = ({ component: Component }) => {
  const token = localStorage.getItem('admin');
  return token ? <Component /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ component: Component }) => {
  const token = localStorage.getItem('admin');
  return token ? <Navigate to="/tables" replace /> : <Component />;
};

export default App;