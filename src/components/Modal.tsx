import { useEffect } from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log("Modal mounted");
  }, []);
  console.log("Modal render");
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      {children}
    </div>
  );
};
export default Modal;
