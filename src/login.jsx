import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./auth.css";


const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [pass, setPass] = useState("");
  const navigate=useNavigate();
  const handleLogin = async () => {
    if (!identifier || !pass) {
      alert("Please enter all fields");
      return;
    }
console.log(identifier);
  let finalEmail = identifier;
//taking username, if not there in supabase return no user found or else fetch email from that username
if (!identifier.includes("@")) {
  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", identifier)
    .single();

  if (error || !profileData) {
    alert("No user found with that username");
    return;
  }

  finalEmail = profileData.email;
}


    // LOGIN USING EMAIL
    const { error } = await supabase.auth.signInWithPassword({
      email: finalEmail,
      password: pass
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login Successful!");
   
    navigate("/dashboard")
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">LOGIN</h2>

        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-buttom-text">Sign Up</Link>
        </p>

        <label>Email or Username</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter email or username"
        />

        <label>Password</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Enter password"
        />

        <button onClick={handleLogin}>LOGIN</button>
      </div>
    </div>
  );
};

export default Login;
