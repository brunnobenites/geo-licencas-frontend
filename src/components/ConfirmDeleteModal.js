import Swal from 'sweetalert2';

// Componente reutilizável pra confirmação de exclusão
const ConfirmDeleteModal = async ({ title, text, onConfirm, onCancel }) => {
  const result = await Swal.fire({
    title: title || 'Tem certeza?',
    text: text || 'Essa ação não pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545', // Vermelho pro "Excluir"
    cancelButtonColor: '#6c757d',  // Cinza pro "Cancelar"
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true, // Coloca "Cancelar" antes de "Excluir"
  });

  if (result.isConfirmed) {
    await onConfirm(); // Chama a função de exclusão
    Swal.fire({
      title: 'Excluído!',
      text: 'O item foi excluído com sucesso.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  } else if (onCancel) {
    onCancel(); // Chama a função de cancelamento, se passada
  }
};

export default ConfirmDeleteModal;