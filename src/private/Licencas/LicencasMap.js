import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import BasemapControl from "../../components/BaseMapControl";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchLicencas,
  createLicenca,
  updateLicenca,
  deleteLicenca,
} from "../../services/LicencasService";
import Button from "../../components/ButtonStyle";
import LicencasMapModal from "./LicencasMapModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal"; 
import LicencaInfoPopup from "./LicencaInfoPopup";

const campoGrandeLat = -20.4697;
const campoGrandeLng = -54.6201;

// Ícones personalizados (mantidos iguais)
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [22, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [22, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [22, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [22, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const grayIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [22, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Dashboard = () => {
  const [licencas, setLicencas] = useState([]);
  const [novaLicenca, setNovaLicenca] = useState(null);
  const [modoCriacao, setModoCriacao] = useState(false);
  const [formData, setFormData] = useState({
    razao_social: "",
    atividade: "",
    endereco: "",
    numero_licenca: "",
    numero_processo: "",
    tipo_licenca: "",
    data_emissao: "",
    validade: "",
    status: "Ativo",
  });
  const [licencaEdicao, setLicencaEdicao] = useState(null);

  useEffect(() => {
    const getLicencas = async () => {
      const data = await fetchLicencas();
      setLicencas(data);
    };
    getLicencas();
  }, []);

  const getIconForLicenca = (validade, status, numero_processo) => {
    if (status === "Processo Aberto" || (numero_processo && !validade)) {
      return grayIcon;
    }
    if (status === "Em Análise") {
      return blueIcon;
    }
    if (!validade || isNaN(new Date(validade).getTime())) {
      return grayIcon;
    }
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diferencaTempo = dataValidade.getTime() - hoje.getTime();
    const diasParaVencer = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
    if (diasParaVencer < 0) {
      return redIcon;
    } else if (diasParaVencer <= 120) {
      return yellowIcon;
    } else {
      return greenIcon;
    }
  };

  const MapaEventos = () => {
    useMapEvents({
      click(e) {
        if (modoCriacao) {
          e.originalEvent.preventDefault();
          setNovaLicenca({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          });
        }
      },
    });
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaLicenca && !licencaEdicao) return;

    const novaLicencaData = {
      ...formData,
      latitude: novaLicenca ? novaLicenca.latitude : licencaEdicao.latitude,
      longitude: novaLicenca ? novaLicenca.longitude : licencaEdicao.longitude,
    };

    try {
      const response = licencaEdicao
        ? await updateLicenca(licencaEdicao.id, novaLicencaData)
        : await createLicenca(novaLicencaData);

      if (response) {
        setLicencas((prevLicencas) =>
          licencaEdicao
            ? prevLicencas.map((licenca) =>
                licenca.id === licencaEdicao.id ? { ...licenca, ...novaLicencaData } : licenca
              )
            : [...prevLicencas, response]
        );
        setNovaLicenca(null);
        setLicencaEdicao(null);
        setFormData({
          razao_social: "",
          atividade: "",
          endereco: "",
          numero_licenca: "",
          numero_processo: "",
          tipo_licenca: "",
          data_emissao: "",
          validade: "",
          status: "Ativo",
        });
      } else {
        alert("Erro ao salvar licença. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao salvar licença:", error);
      alert("Erro ao salvar licença. Tente novamente.");
    }
  };

  useEffect(() => {
    if (licencaEdicao) {
      console.log("Atualizando formData com licencaEdicao:", licencaEdicao);
      setFormData({
        razao_social: licencaEdicao.razao_social || "",
        atividade: licencaEdicao.atividade || "",
        endereco: licencaEdicao.endereco || "",
        numero_licenca: licencaEdicao.numero_licenca || "",
        numero_processo: licencaEdicao.numero_processo || "",
        tipo_licenca: licencaEdicao.tipo_licenca || "",
        data_emissao: licencaEdicao.data_emissao || "",
        validade: licencaEdicao.validade || "",
        status: licencaEdicao.status || "Ativo",
      });
    }
  }, [licencaEdicao]);

  const handleEditClick = (licenca) => {
    console.log("Botão Editar clicado. Licença selecionada:", licenca);
    setLicencaEdicao(licenca);
  };

  const handleCancel = () => {
    setModoCriacao(false);
    setNovaLicenca(null);
    setLicencaEdicao(null);
    setFormData({
      razao_social: "",
      atividade: "",
      endereco: "",
      numero_licenca: "",
      numero_processo: "",
      tipo_licenca: "",
      data_emissao: "",
      validade: "",
      status: "Ativo",
    });
  };

  const handleDeleteClick = async (id) => {
    await ConfirmDeleteModal({
      title: "Confirmar Exclusão",
      text: "Você tem certeza que deseja excluir esta licença? Essa ação não pode ser desfeita!",
      onConfirm: async () => {
        try {
          const response = await deleteLicenca(id);
          if (response) {
            setLicencas(licencas.filter((licenca) => licenca.id !== id));
          } else {
            throw new Error("Erro ao excluir");
          }
        } catch (error) {
          console.error("Erro ao excluir licença:", error);
          alert("Erro ao excluir licença. Tente novamente.");
        }
      },
      onCancel: () => {
        console.log("Exclusão cancelada");
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2>Mapa de Licenças Ambientais - DIMEA</h2>
          {!modoCriacao ? (
            <Button
              onClick={() => setModoCriacao(true)}
              style={{ marginBottom: "10px" }}
            >
              <span>+</span> Adicionar Licença
            </Button>
          ) : (
            <Button onClick={handleCancel} style={{ marginBottom: "10px" }}>
              Cancelar
            </Button>
          )}
        </div>
        <MapContainer
          center={[campoGrandeLat, campoGrandeLng]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <BasemapControl />
          <MapaEventos />
          {licencas.map((licenca) => (
            <Marker
              key={licenca.id}
              position={[licenca.latitude, licenca.longitude]}
              icon={getIconForLicenca(
                licenca.validade,
                licenca.status,
                licenca.numero_processo
              )}
            >
              <Popup
                autoPanPadding={[50, 50]}
                maxWidth={320}
                onOpen={() => {
                  document
                    .querySelector(".leaflet-popup-content-wrapper")
                    .addEventListener("wheel", (e) => {
                      e.stopPropagation();
                      document
                        .querySelector(".leaflet-container")
                        .dispatchEvent(new Event("wheel"));
                    });
                }}
              >
                <LicencaInfoPopup
                  licenca={licenca}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </Popup>
            </Marker>
          ))}
          {(novaLicenca || licencaEdicao) && (
            <Marker
              position={[
                novaLicenca ? novaLicenca.latitude : licencaEdicao.latitude,
                novaLicenca ? novaLicenca.longitude : licencaEdicao.longitude,
              ]}
              icon={getIconForLicenca(
                formData.validade,
                formData.status,
                formData.numero_processo
              )}
            >
              <Popup
                autoPanPadding={[50, 50]}
                maxWidth={320}
                onOpen={() => {
                  document
                    .querySelector(".leaflet-popup-content-wrapper")
                    .addEventListener("wheel", (e) => {
                      e.stopPropagation();
                      document
                        .querySelector(".leaflet-container")
                        .dispatchEvent(new Event("wheel"));
                    });
                }}
              >
                {(novaLicenca || licencaEdicao) && (
                  <>
                    {console.log("Renderizando modal:", {
                      novaLicenca,
                      licencaEdicao,
                    })}
                    <LicencasMapModal
                      formData={formData}
                      onChange={handleChange}
                      onSubmit={handleSubmit}
                      onCancel={handleCancel}
                      isEditMode={!!licencaEdicao}
                    />
                  </>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
        <div
          style={{
            position: "absolute",
            top: "200px",
            right: "20px",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Legenda</h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png"
              alt="Ícone Cinza"
              style={{ width: "20px", height: "30px", marginRight: "5px" }}
            />
            <span>Processo Aberto</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
              alt="Ícone Verde"
              style={{ width: "20px", height: "30px", marginRight: "5px" }}
            />
            <span>Licença Válida</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
              alt="Ícone Azul"
              style={{ width: "20px", height: "30px", marginRight: "5px" }}
            />
            <span>Licença em Análise</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png"
              alt="Ícone Amarelo"
              style={{ width: "20px", height: "30px", marginRight: "5px" }}
            />
            <span>Licença Prestes a Vencer</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
              alt="Ícone Vermelho"
              style={{ width: "20px", height: "30px", marginRight: "5px" }}
            />
            <span>Licença Vencida</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;