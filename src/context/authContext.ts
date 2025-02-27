import { createContext } from "react";
import { AuthContextType } from "../types/authTypes";
const authContext = createContext<AuthContextType | undefined>(undefined);
export default authContext;
