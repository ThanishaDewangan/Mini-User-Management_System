import './ConfirmModal.css'

const ConfirmModal = ({ show, type, userName, onConfirm, onCancel }) => {
  if (!show) return null

  const actionText = type === 'activate' ? 'activate' : 'deactivate'
  const actionColor = type === 'activate' ? '#4caf50' : '#f44336'

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm {actionText.charAt(0).toUpperCase() + actionText.slice(1)}</h2>
        <p>
          Are you sure you want to {actionText} the account for <strong>{userName}</strong>?
        </p>
        <div className="modal-actions">
          <button
            className="btn-confirm"
            onClick={onConfirm}
            style={{ backgroundColor: actionColor }}
          >
            Yes, {actionText}
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

