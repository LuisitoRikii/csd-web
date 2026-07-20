import { Modal } from './Modal'

export const ConfirmModal = ({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?' }) => {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-charcoal/80 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm hover:bg-subtle transition-colors">
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          className="px-4 py-2 rounded-xl bg-red-600 text-paper text-sm hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}
