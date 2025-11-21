import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import './App.css';

// Pages (vamos criar depois)
const Loans = () => <div style={{padding: '2rem', textAlign: 'center'}}>🔄 Página de Empréstimos - Em Desenvolvimento</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/loans" element={<Loans />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
