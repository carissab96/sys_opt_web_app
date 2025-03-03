import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './utils/PrivateRoute';
import { Login } from './components/Auth/Login.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;