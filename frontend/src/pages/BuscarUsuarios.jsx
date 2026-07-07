import { useState } from 'react';
import '../styles/AdminPages.css';

const BuscarUsuarios = () => {
  const [searchType, setSearchType] = useState('nombre');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // TODO: Implementar búsqueda real con API
    console.log('Buscar:', searchType, searchTerm);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>🔍 Buscar Cliente</h1>
        <p>Encuentra usuarios por nombre o correo electrónico</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="nombre">Por Nombre</option>
            <option value="email">Por Correo</option>
          </select>

          <input
            type="text"
            placeholder={searchType === 'nombre' ? 'Ingresa el nombre...' : 'Ingresa el correo...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <button type="submit" className="search-btn">
            Buscar
          </button>
        </form>

        {results.length > 0 && (
          <div className="results-container">
            <h3>Resultados:</h3>
            {/* Mostrar resultados aquí */}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarUsuarios;