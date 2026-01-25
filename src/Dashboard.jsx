import { useContext, useEffect, useState } from "react";
import  {AuthContext}  from "./Authcontext";
import { supabase } from "./supabaseClient";
import UploadImg from "./uploadImg";
import "./auth.css";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

//taking { user,loading } from the auth which is globally accessible

const Dashboard = () => {

  const { user, loading } = useContext(AuthContext);
  const [username, setUsername] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
// this useEffect will run when the  user changes

  useEffect(() => {
    if (!user) return;

    const getProfile = async () => {
      //this try catch is used for avoiding the non supabase error...
      // if it is not there then the whole app crashes 
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data && data.username) {
          setUsername(data.username);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    getProfile();
  }, [user]);

  if (loading) return (
    <div className="auth-container">
      <div className="auth-box">
        <p>Loading...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="auth-container">
      <div className="auth-box">
        <p>Please login</p>
        <p> <Link to="/login" className="auth-buttom-text">Sign In </Link></p>
      </div>

    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="auth-title">Welcome, {username || "User"}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <HamburgerMenu user={user} />
            <button 
              onClick={handleLogout}
              style={{ 
                padding: "8px 16px", 
                fontSize: "0.9rem", 
                width: "auto",
                marginTop: "0"
              }}
            >
              Logout
            </button>
          </div>
        </div>
        
        <UploadImg user={user} />
      </div>
    </div>
  );
};
 

export default Dashboard;
