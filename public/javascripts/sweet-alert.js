const toast = swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000
});

const swalert = swal.mixin({
  buttonsStyling: false,
  confirmButtonClass: 'btn btn-primary mr-2',
  cancelButtonClass: 'btn btn-outline-secondary',
})