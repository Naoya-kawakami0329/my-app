import { User } from "firebase/auth";
import { createContext, ReactNode, useState } from "react";

type AppProviderProps={
    children:ReactNode;
}

type AppContextType={
    user:User | null;
    userId:string | null,
    setUser:React.Dispatch<React.SetStateAction<User | null>>
    selectedRoom:string | null,
    setSelectedRoom:React.Dispatch<React.SetStateAction<string | null>>
}

const defaultContextData={
    user:null,
    userId:null,
    setUser:()=>{},
    selectedRoom:null,
    setSelectedRoom:()=>{}
}
const AppContext=createContext<AppContextType>(defaultContextData);

export function AppProvider({children}:AppProviderProps){
    const [user,setUser]=useState<User | null>(null);
    const [userId,setUserId]=useState<string | null>(null);
    const [selectedRoom,setSelectedRoom]=useState<string | null>(null);

    return (
        <AppContext.Provider value={{user,setUser,userId,selectedRoom,setSelectedRoom}}>{children}</AppContext.Provider>
    )
};