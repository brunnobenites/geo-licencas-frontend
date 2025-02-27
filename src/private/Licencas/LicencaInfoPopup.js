import React from "react";
import PropTypes from "prop-types";
import "./LicencaInfoPopup.css"; // Novo CSS pra estilizar

const LicencaInfoPopup = ({ licenca, onEdit, onDelete }) => {
  const popupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "300px",
    padding: "10px",
    overflowY: "auto", // Barra de rolagem vertical
    maxHeight: "400px", // Altura máxima igual ao modal
  };

  const fieldStyle = {
    margin: "0",
    fontSize: "12px",
  };

  const labelStyle = {
    fontWeight: "bold",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "5px",
    marginTop: "10px",
  };

  return (
    <div style={popupStyle}>
      <div style={fieldStyle}>
        <span style={labelStyle}>Razão Social:</span> {licenca.razao_social}
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Atividade:</span> {licenca.atividade}
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Endereço:</span> {licenca.endereco}
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Núm. da Licença:</span> {licenca.numero_licenca}
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Núm. do Processo:</span>{" "}
        {licenca.numero_processo || "Não informado"}
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Status:</span> {licenca.status}
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>Validade:</span> {licenca.validade}
      </div>
      <div style={buttonContainerStyle}>
        <button
          onClick={() => onEdit(licenca)}
          className="popup-edit-button"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(licenca.id)}
          className="popup-delete-button"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

LicencaInfoPopup.propTypes = {
  licenca: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LicencaInfoPopup;