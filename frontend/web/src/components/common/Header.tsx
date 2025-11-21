import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>📚 BiblioComunidade</h1>
          <span>Sistema de Gestão para Bibliotecas Comunitárias</span>
        </div>
        
        <nav className="navigation">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/books" 
            className={`nav-link ${isActive('/books') ? 'active' : ''}`}
          >
            📖 Livros
          </Link>
          <Link 
            to="/members" 
            className={`nav-link ${isActive('/members') ? 'active' : ''}`}
          >
            👥 Membros
          </Link>
          <Link 
            to="/loans" 
            className={`nav-link ${isActive('/loans') ? 'active' : ''}`}
          >
            🔄 Empréstimos
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
