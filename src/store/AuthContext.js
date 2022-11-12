import * as React from "react";

const authContext = React.createContext();

function useAuth(){
    const [isAuthed, setAuthed] = React.useState(false);

    return {
        isAuthed,
        login(){
            setAuthed(true);
        },
        logout(){
            setAuthed(false);
        }
    };
}

export function AuthProvider({children}) {
    const auth = useAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export default function AuthConsumer(){
    return React.useContext(authContext);
}