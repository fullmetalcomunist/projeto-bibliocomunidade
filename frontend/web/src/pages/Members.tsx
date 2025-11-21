import React, { useState } from 'react';
import { memberService } from '../services/api';
import { Member } from '../types';
import MembersList from '../components/members/MembersList';
import MemberForm from '../components/members/MemberForm';
import './Members.css';

const Members: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDeleteMember = async (member: Member) => {
    if (!window.confirm(`Tem certeza que deseja excluir o membro "${member.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await memberService.delete(member.id);
      
      if (response.data.success) {
        alert('Membro excluído com sucesso!');
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Erro ao excluir membro:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao excluir membro';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async (memberData: any) => {
    try {
      setLoading(true);
      let response;

      if (editingMember) {
        response = await memberService.update(editingMember.id, memberData);
      } else {
        response = await memberService.create(memberData);
      }

      if (response.data.success) {
        alert(editingMember ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!');
        setShowForm(false);
        setEditingMember(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Erro ao salvar membro:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao salvar membro';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  return (
    <div className="members-page">
      <div className="page-header">
        <h1>👥 Gerenciar Membros</h1>
        <p>Cadastre e gerencie os membros da comunidade</p>
      </div>

      {!showForm ? (
        <>
          <div className="page-actions">
            <button 
              onClick={handleAddMember}
              className="btn-add"
              disabled={loading}
            >
              👥 Adicionar Novo Membro
            </button>
          </div>

          <MembersList
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            refreshTrigger={refreshTrigger}
          />
        </>
      ) : (
        <MemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={handleCancelForm}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Members;
