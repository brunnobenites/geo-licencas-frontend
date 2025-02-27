import React from 'react';
import PropTypes from 'prop-types';
import './LicencasMapModal.css'; // Importe o CSS

const LicencasMapModal = ({ formData, onChange, onSubmit, onCancel, isEditMode }) => {
    console.log('Props recebidas no modal:', { formData, isEditMode });
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '300px',
    padding: '10px',
    overflowY: 'auto',
    maxHeight: '400px',
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '12px',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      <div className="form-group">
        <label>Razão Social:</label>
        <input type="text" name="razao_social" value={formData.razao_social} onChange={onChange} required style={inputStyle} />
      </div>
      <div className="form-group">
        <label>Atividade:</label>
        <input type="text" name="atividade" value={formData.atividade} onChange={onChange} required style={inputStyle} />
      </div>
      <div className="form-group">
        <label>Endereço:</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={onChange} required style={inputStyle} />
      </div>
      <div className="form-group">
        <label>Núm. da Licença:</label>
        <input
          type="text"
          name="numero_licenca"
          value={formData.numero_licenca}
          onChange={onChange}
          required={!isEditMode || formData.status !== 'Processo Aberto'}
          style={inputStyle}
        />
      </div>
      <div className="form-group">
        <label>Núm. do Processo:</label>
        <input type="text" name="numero_processo" value={formData.numero_processo || ''} onChange={onChange} style={inputStyle} />
      </div>
      <div className="form-group">
        <label>Tipo de Licença:</label>
        <input
          type="text"
          name="tipo_licenca"
          value={formData.tipo_licenca}
          onChange={onChange}
          required={!isEditMode || formData.status !== 'Processo Aberto'}
          style={inputStyle}
        />
      </div>
      <div className="form-group">
        <label>Data de Emissão:</label>
        <input
          type="date"
          name="data_emissao"
          value={formData.data_emissao}
          onChange={onChange}
          required={!isEditMode || formData.status !== 'Processo Aberto'}
          style={inputStyle}
        />
      </div>
      <div className="form-group">
        <label>Validade:</label>
        <input
          type="date"
          name="validade"
          value={formData.validade}
          onChange={onChange}
          required={!isEditMode || formData.status !== 'Processo Aberto'}
          style={inputStyle}
        />
      </div>
      <div className="form-group">
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={onChange} style={inputStyle}>
          <option value="Ativo">Ativo</option>
          <option value="Em Análise">Em Análise</option>
          <option value="Processo Aberto">Processo Aberto</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button type="submit" className="modal-submit-button">
          {isEditMode ? 'Atualizar' : 'Salvar'}
        </button>
        <button type="button" className="modal-cancel-button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

LicencasMapModal.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default LicencasMapModal;