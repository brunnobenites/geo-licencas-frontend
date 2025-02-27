import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ou use a instância do axiosConfig

const Licencas = () => {
  const [licencas, setLicencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as licenças
  useEffect(() => {
    const fetchLicencas = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/licencas/');
        setLicencas(response.data); // Atualiza o estado com os dados das licenças
      } catch (error) {
        setError('Erro ao carregar as licenças'); // Tratamento de erro
      } finally {
        setLoading(false);
      }
    };

    fetchLicencas();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Licenças Ambientais</h2>
      <ul>
        {licencas.map((licenca) => (
          <li key={licenca.id}>
            {licenca.razao_social} - {licenca.tipo_licenca} - {licenca.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Licencas;