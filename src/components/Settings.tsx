import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Sun, 
  Moon, 
  Bell, 
  Mail, 
  Shield, 
  Lock, 
  Trash2, 
  Save,
  Globe,
  MessageSquare,
  AtSign
} from 'lucide-react';

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
  <motion.div 
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${checked ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
    onClick={() => onChange(!checked)}
  >
    <motion.div 
      layout 
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className="w-4 h-4 bg-white rounded-full" 
    />
  </motion.div>
);

const Settings: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('pt-BR');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklySummary: true
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSettings = () => {
    // Simulação de salvamento
    showNotification('success', 'Configurações salvas com sucesso!');
  };

  const onPasswordSubmit = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      showNotification('error', 'As novas senhas não coincidem.');
      return;
    }
    // Simulação de alteração de senha
    showNotification('success', 'Senha alterada com sucesso!');
    reset();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as preferências do sistema e da sua conta
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Geral</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Tema da Interface</h3>
                <p className="text-sm text-gray-500">Selecione o tema claro ou escuro.</p>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-full">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <Sun className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Idioma</h3>
                <p className="text-sm text-gray-500">Escolha o idioma da interface.</p>
              </div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notificações</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AtSign className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-800">Notificações por E-mail</h3>
                  <p className="text-sm text-gray-500">Receba e-mails sobre atividades importantes.</p>
                </div>
              </div>
              <Switch checked={notifications.email} onChange={(c) => setNotifications(p => ({...p, email: c}))} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-800">Notificações Push</h3>
                  <p className="text-sm text-gray-500">Receba notificações no seu navegador.</p>
                </div>
              </div>
              <Switch checked={notifications.push} onChange={(c) => setNotifications(p => ({...p, push: c}))} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-800">Resumo Semanal</h3>
                  <p className="text-sm text-gray-500">Receba um resumo semanal por e-mail.</p>
                </div>
              </div>
              <Switch checked={notifications.weeklySummary} onChange={(c) => setNotifications(p => ({...p, weeklySummary: c}))} />
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Segurança</h2>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-800">Alterar Senha</h3>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Senha Atual</label>
              <input 
                type="password"
                {...register('currentPassword', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nova Senha</label>
              <input 
                type="password"
                {...register('newPassword', { required: true, minLength: 6 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">A senha deve ter no mínimo 6 caracteres.</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirmar Nova Senha</label>
              <input 
                type="password"
                {...register('confirmPassword', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
              Alterar Senha
            </button>
          </form>
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Autenticação de Dois Fatores (2FA)</h3>
                <p className="text-sm text-gray-500">Adicione uma camada extra de segurança.</p>
              </div>
              <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                Habilitar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Conta</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-medium text-red-800">Desativar Conta</h3>
            <p className="text-sm text-red-700 mt-1 mb-3">
              Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.
            </p>
            <button 
              onClick={() => confirm('Tem certeza que deseja desativar sua conta?')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Desativar Minha Conta
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
