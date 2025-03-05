import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//import { PrivateRoute } from './utils/PrivateRoute';
import { Login } from './components/Auth/Login.tsx';
import { Dashboard } from './components/dashboard/Dashboard/Dashboard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from './store/store.ts';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};  
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