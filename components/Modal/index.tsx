import { useRef } from 'react';
import ReactModal from 'react-modal';

interface IModalProps extends ReactModal.Props {
  handleClose: () => void;
}

const Modal = ({ isOpen, children, handleClose, ...rest }: IModalProps) => {
  const ref = useRef<ReactModal>(null);
  return (
    <ReactModal
      ref={ref}
      isOpen={isOpen}
      onRequestClose={handleClose}
      {...rest}
      style={{
        content: {
          width: '250px',

          top: '50%',
          left: '50%',
          bottom: 'auto',
          right: 'auto',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
