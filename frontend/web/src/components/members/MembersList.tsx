import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/api';
import { Member } from '../../types';

interface MembersListProps {
  onEditMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
  refreshTrigger: number;
}

const MembersList: React.FC<MembersListProps> = ({ 
  onEditMember, 
  onDeleteMember, 
  refreshTrigger 
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [refreshTrigger]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await memberService.getAll();
      
      // Garantir que members seja sempre um array
      const membersData = Array.isArray(response.data) ? response.data : [];
      
      console.log('📋 Dados de membros recebidos:', response.data);
      console.log('👥 Membros processados:', membersData);
      
      setMembers(membersData);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      alert('Erro ao carregar lista de membros');
      setMembers([]); // Garantir array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando membros...</div>;
  }

  return (
    <div className="members-list">
      <h2>Lista de Membros</h2>
      {members.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum membro cadastrado</p>
          <button onClick={fetchMembers} className="btn-retry">
            🔄 Recarregar
          </button>
        </div>
      ) : (
        <div className="members-grid">
          {members.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-info">
                <h3>{member.name}</h3>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Telefone:</strong> {member.phone}</p>
                <p><strong>Endereço:</strong> {member.address}</p>
                <p><strong>Status:</strong> 
                  <span className={member.status === 'active' ? 'status-active' : 'status-inactive'}>
                    {member.status === 'active' ? ' Ativo' : ' Inativo'}
                  </span>
                </p>
                <p><strong>Cadastro:</strong> {new Date(member.registrationDate).toLocaleDateString()}</p>
              </div>
              <div className="member-actions">
                <button 
                  onClick={() => onEditMember(member)}
                  className="btn-edit"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => onDeleteMember(member)}
                  className="btn-delete"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersList;
