import { useEffect } from "react";

type ModalProps = {
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ children }) => {
  useEffect(() => {
    console.log("Modal mounted");
  }, []);
  console.log("Modal render");
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-60">
      {children}
    </div>
  );
};
export default Modal;
