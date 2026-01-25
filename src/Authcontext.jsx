import { createContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

//Now the Auth context is globally accessible

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session on refresh ,it will set the values of username with getsession() function
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Session error:", error);
        setUser(null);
      } else {
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    });



    // Listen to auth changes (Whenever the auth changes it has to set the user)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
          setUser(session?.user ?? null);
        
      });


//below stmt is just a cleanup code when the user stops or logged out.
// it should stop listening the Auth changes
    return () => listener.subscription.unsubscribe();


  }, []);

  //the whole 2 functions getsession and Authchangestate
  //  are in useEffect inorder to change whenver the refresh happends

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
  //in index.jsx the /App is wrapped with Authprovider so here the children is ./App...
};

export default AuthProvider;
