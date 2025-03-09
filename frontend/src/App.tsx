
import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { Dashboard } from './components/dashboard/Dashboard/Dashboard';
import { PrivateRoute } from './utils/PrivateRoute';
import { websocketService } from './utils/websocketService';

const App: React.FC = () => {
    const cleanupRef = useRef<boolean>(false);

    useEffect(() => {
        cleanupRef.current = false;

        return () => {
            cleanupRef.current = true;
            console.log("📱 App unmounting...");
            
            const cleanup = () => {
                if (cleanupRef.current) {
                    console.log("🧹 Performing final cleanup...");
                    if (websocketService.isConnected()) {
                        console.log("🔌 Disconnecting established connection...");
                        websocketService.disconnect();
                    } else {
                        console.log("⚠️ No active connection to disconnect");
                    }
                }
            };

            setTimeout(cleanup, 100);
        };
    }, []);

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
                <Route 
                    path="/" 
                    element={<Navigate to="/dashboard" replace />} 
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;