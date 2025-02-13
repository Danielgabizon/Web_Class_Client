import { useEffect } from "react";

const Modal = ({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  useEffect(() => {
    console.log("Modal mounted");
  }, []);
  console.log("Modal render");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      {children}
    </div>
  );
};
export default Modal;
