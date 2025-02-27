import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchLicencas, createLicenca, updateLicenca, deleteLicenca } from '../../services/LicencasService';
import BasemapControl from '../../components/BaseMapControl';

const campoGrandeLat = -20.4697;
const campoGrandeLng = -54.6201;

// Ícones personalizados
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Dashboard = () => {
  const [licencas, setLicencas] = useState([]);
  const [novaLicenca, setNovaLicenca] = useState(null);
  const [modoCriacao, setModoCriacao] = useState(false);
  const [formData, setFormData] = useState({
    razao_social: '',
    atividade: '',
    endereco: '',
    tipo_licenca: '',
    data_emissao: '',
    validade: '',
    status: 'Ativo'
  });
  const [licencaEdicao, setLicencaEdicao] = useState(null); // Licença a ser editada

  useEffect(() => {
    const getLicencas = async () => {
      const data = await fetchLicencas();
      setLicencas(data);
    };

    getLicencas();
  }, []);

  const getIconForLicenca = (validade) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diferencaTempo = dataValidade.getTime() - hoje.getTime();
    const diasParaVencer = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

    if (diasParaVencer < 0) {
      return redIcon;
    } else if (diasParaVencer <= 30) {
      return orangeIcon;
    } else {
      return greenIcon;
    }
  };

  // Estilos em linha para tornar o formulário responsivo e organizado
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '100%',
    padding: '20px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  submitButtonStyle[':hover'] = {
    backgroundColor: '#0056b3',
  };

  // Estilos dos Botões
  const editButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745', // Cor verde para editar
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  };

  const deleteButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545', // Cor vermelha para excluir
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
    marginLeft: '10px',
  };

  // Hover para os botões
  editButtonStyle[':hover'] = {
    backgroundColor: '#218838',
  };

  deleteButtonStyle[':hover'] = {
    backgroundColor: '#c82333',
  };

  const MapaEventos = () => {
    useMapEvents({
      click(e) {
        if (modoCriacao) {
          e.originalEvent.preventDefault();
          setNovaLicenca({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          });
        }
      }
    });
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaLicenca && !licencaEdicao) return;

    const nova = {
      ...formData,
      latitude: novaLicenca ? novaLicenca.latitude : licencaEdicao.latitude,
      longitude: novaLicenca ? novaLicenca.longitude : licencaEdicao.longitude
    };

    const response = licencaEdicao ? await updateLicenca(nova) : await createLicenca(nova);

    if (response) {
      setLicencas((prevLicencas) => {
        if (licencaEdicao) {
          return prevLicencas.map((licenca) =>
            licenca.id === licencaEdicao.id ? { ...licenca, ...nova } : licenca
          );
        } else {
          return [...prevLicencas, response];
        }
      });
      setNovaLicenca(null);
      setLicencaEdicao(null);
      setModoCriacao(false);
      setFormData({
        razao_social: '',
        atividade: '',
        endereco: '',
        tipo_licenca: '',
        data_emissao: '',
        validade: '',
        status: 'Ativo'
      });
    } else {
      alert('Erro ao salvar licença. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setModoCriacao(false);
    setNovaLicenca(null); // Resetar marcador temporário
  };

  const cancelarEdicao = () => {
    setLicencaEdicao(null);
    setFormData({
      razao_social: '',
      atividade: '',
      endereco: '',
      tipo_licenca: '',
      data_emissao: '',
      validade: '',
      status: 'Ativo'
    });
  };

  const excluirLicenca = async (id) => {
    const response = await deleteLicenca(id);
    if (response) {
      setLicencas(licencas.filter((licenca) => licenca.id !== id));
    } else {
      alert('Erro ao excluir licença. Tente novamente.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flexGrow: 1 }}>
        <h2>Mapa de Obras - SISEP</h2>
        <button onClick={() => setModoCriacao(!modoCriacao)} style={{ marginBottom: '10px' }}>
          {!modoCriacao && 'Adicionar Obra'}
        </button>
        {modoCriacao && (
          <button onClick={handleCancel} style={{ marginBottom: '10px', marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
        <MapContainer center={[campoGrandeLat, campoGrandeLng]} zoom={13} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <BasemapControl />
          <MapaEventos />
          {licencas.map((licenca) => (
            <Marker key={licenca.id} position={[licenca.latitude, licenca.longitude]} icon={getIconForLicenca(licenca.validade)}>
              <Popup>
                <strong>{licenca.razao_social}</strong>
                <p>Atividade: {licenca.atividade}</p>
                <p>Endereço: {licenca.endereco}</p>
                <p>Status: {licenca.status}</p>
                <p>Validade: {licenca.validade}</p>

                <button onClick={() => { setLicencaEdicao(licenca); setFormData({ ...licenca }); }} style={editButtonStyle}>
                  Editar
                </button>
                <button onClick={() => excluirLicenca(licenca.id)} style={deleteButtonStyle}>
                  Excluir
                </button>
              </Popup>
            </Marker>
          ))}

          {novaLicenca && (
            <Marker position={[novaLicenca.latitude, novaLicenca.longitude]} icon={orangeIcon}>
              <Popup>
                <form onSubmit={handleSubmit} style={formStyle}>
                  <div className="form-group">
                    <label>Razão Social:</label>
                    <input
                      type="text"
                      name="razao_social"
                      value={formData.razao_social}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label>Atividade:</label>
                    <input
                      type="text"
                      name="atividade"
                      value={formData.atividade}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label>Endereço:</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo de Licença:</label>
                    <input
                      type="text"
                      name="tipo_licenca"
                      value={formData.tipo_licenca}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label>Data de Emissão:</label>
                    <input
                      type="date"
                      name="data_emissao"
                      value={formData.data_emissao}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label>Validade:</label>
                    <input
                      type="date"
                      name="validade"
                      value={formData.validade}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <button type="submit" style={submitButtonStyle}>Salvar Licença</button>
                </form>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;