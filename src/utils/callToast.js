import { toast } from 'react-toastify';

const defaultConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false
};

export const callToastError = text => toast.error(text, defaultConfig);

export const callToastSuccess = text => toast.success(text, defaultConfig);
