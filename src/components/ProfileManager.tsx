import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit,
  Save,
  X,
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType } from '../types';

const ProfileManager: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<UserType>>({
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
      telefone: user?.telefone || '',
    }
  });

  const onSubmit = async (data: Partial<UserType>) => {
    setIsSaving(true);
    
    // Simula delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProfile(data);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    reset({
      nome: user?.nome || '',
      email: user?.email || '',
      telefone: user?.telefone || '',
    });
    setIsEditing(false);
  };

  const profileFields = [
    {
      key: 'username',
      label: 'Usuário',
      value: user?.username,
      icon: User,
      readonly: true
    },
    {
      key: 'nome',
      label: 'Nome Completo',
      value: user?.nome,
      icon: User,
      readonly: false
    },
    {
      key: 'email',
      label: 'E-mail',
      value: user?.email,
      icon: Mail,
      readonly: false
    },
    {
      key: 'telefone',
      label: 'Telefone',
      value: user?.telefone,
      icon: Phone,
      readonly: false
    },
    {
      key: 'nivel',
      label: 'Nível de Acesso',
      value: user?.nivel,
      icon: User,
      readonly: true
    },
    {
      key: 'createdAt',
      label: 'Membro desde',
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '',
      icon: Calendar,
      readonly: true
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas informações pessoais
          </p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar Perfil</span>
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-16 h-16 text-white" />
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </motion.button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.nome || user?.username}
              </h2>
              <p className="text-gray-600 capitalize mt-1">
                {user?.nivel}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Informações Pessoais
              </h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-6">
                {profileFields.map((field, index) => {
                  const Icon = field.icon;
                  
                  return (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {isEditing && !field.readonly ? (
                          <input
                            {...register(field.key as keyof UserType, {
                              required: field.key === 'nome' ? 'Nome é obrigatório' : false
                            })}
                            type={field.key === 'email' ? 'email' : 'text'}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder={`Digite seu ${field.label.toLowerCase()}`}
                          />
                        ) : (
                          <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                            {field.value || 'Não informado'}
                          </div>
                        )}
                      </div>
                      {errors[field.key as keyof UserType] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as keyof UserType]?.message}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-4 mt-8 pt-6 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </motion.button>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileManager;
