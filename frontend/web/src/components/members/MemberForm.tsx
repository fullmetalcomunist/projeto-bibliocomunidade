import React, { useState, useEffect } from 'react';
import { Member } from '../../types';

interface MemberFormProps {
  member?: Member | null;
  onSave: (memberData: any) => void;
  onCancel: () => void;
  loading: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  member, 
  onSave, 
  onCancel, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address,
        status: member.status
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="member-form-container">
      <h2>{member ? 'Editar Membro' : 'Novo Membro'}</h2>
      <form onSubmit={handleSubmit} className="member-form">
        <div className="form-group">
          <label htmlFor="name">Nome completo:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Endereço:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={loading}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="btn-cancel"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-save"
          >
            {loading ? 'Salvando...' : (member ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
