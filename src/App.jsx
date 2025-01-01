// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import Login from './pages/Login';
import Tables from './pages/Tables';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute component={Login} />} />
        <Route path="/tables" element={<PrivateRoute component={Tables} />} />
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