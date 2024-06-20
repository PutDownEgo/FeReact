import { toast } from 'react-toastify';

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

const useCustomToast = () => {
    const showToast = (message: string, type: ToastType = 'default') => {
        const options = {
            position: "top-right" as const,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light" as const,
        };

        switch (type) {
            case 'info':
                toast.info(message, options);
                break;
            case 'success':
                toast.success(message, options);
                break;
            case 'warning':
                toast.warning(message, options);
                break;
            case 'error':
                toast.error(message, options);
                break;
            default:
                toast(message, options);
        }
    };

    return showToast;
}

export default useCustomToast;
