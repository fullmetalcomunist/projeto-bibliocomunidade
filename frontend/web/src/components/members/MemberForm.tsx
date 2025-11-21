import React, { useState, useEffect } from 'react';
import { Member } from '../../types';
import './MemberForm.css';

interface MemberFormProps {
  member?: Member | null;
  onSave: (memberData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  member, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        status: member.status || 'active'
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email deve ser válido';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone deve ser válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Formatar telefone (remover caracteres não numéricos)
    const submitData = {
      ...formData,
      phone: formData.phone ? formData.phone.replace(/\D/g, '') : undefined
    };

    onSave(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="member-form-container">
      <form onSubmit={handleSubmit} className="member-form">
        <h2>{member ? '✏️ Editar Membro' : '👥 Adicionar Novo Membro'}</h2>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Nome Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Digite o nome completo"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="email@exemplo.com (opcional)"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="(85) 99999-9999 (opcional)"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {member && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">✅ Ativo</option>
                <option value="suspended">⏸️ Suspenso</option>
                <option value="inactive">❌ Inativo</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="address">Endereço</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Endereço completo (opcional)"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
            disabled={loading}
          >
            ❌ Cancelar
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={loading}
          >
            {loading ? '⏳ Salvando...' : (member ? '💾 Atualizar Membro' : '👥 Adicionar Membro')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
