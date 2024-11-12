// src/components/ConfirmModal.js
import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, userName, darkMode, actionType }) => {
  if (!isOpen) return null;

  const actionMessage = actionType === 'update'
    ? `¿Estás seguro de que deseas actualizar los datos de ${userName}?`
    : `¿Estás seguro de que deseas eliminar a ${userName}?`;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
        <h3>{actionType === 'update' ? 'Confirmar Actualización' : 'Confirmar Eliminación'}</h3>
        <p>{actionMessage}</p>
        <div className="modal-buttons">
          <button
            onClick={onConfirm}
            className={actionType === 'update' ? 'confirm-update-button' : 'confirm-delete-button'}
          >
            Sí, {actionType === 'update' ? 'Actualizar' : 'Eliminar'}
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
