import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ProfileManager from './ProfileManager';
import UserManagement from './UserManagement';
import Settings from './Settings'; // Importando o novo componente

const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <ProfileManager />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'settings':
        return <Settings />; // Usando o novo componente
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 ml-16 lg:ml-16 transition-all duration-300"
      >
        <div className="min-h-screen">
          {renderContent()}
        </div>
      </motion.main>
    </div>
  );
};

export default MainLayout;
