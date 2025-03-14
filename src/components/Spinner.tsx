import { useEffect } from "react";

const Spinner: React.FC = () => {
  console.log("Spinner render");
  useEffect(() => {
    console.log("Spinner mounted");
  }, []);
  return (
    <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  );
};
export default Spinner;
