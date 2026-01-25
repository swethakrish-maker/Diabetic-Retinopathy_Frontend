import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css"; // Import the CSS file
import { supabase } from "./supabaseClient"

const Signup = () => {
  const [uname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // signup handling..
  //async kulla than await kudukanum to pause the function until it finishes.... after the 
  // signup function only we can do anyother..[data,error ]inside signup function there...if !data or error
  //  error msg sent
  const handlesignUp = async () => {
    if (!uname || !email || !pass) {
      alert("please enter all the Fields");
      return;
    }

    const { data, error } = await
      supabase.auth.signUp({
        email,
        password: pass
      });

    if (error) {
      alert(error.message);
      return;
    }

    if (!data.user) {
      alert("signUp failed - no user created!");
      return;
    }

    // Only insert profile if user was successfully created..........
    const { error: profileError } = await
      supabase.from("profiles").insert([{ id: data.user.id, username: uname,email:email}]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("SignUp Successful!");
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">SIGN UP</h2>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="auth-buttom-text">
            Sign In
          </Link>
        </p>

        <label>Name</label>
        <input
          type="text"
          value={uname}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label>Password</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Enter your password"
        />

        <button onClick={handlesignUp}>SIGN UP</button>
      </div>
    </div>
  );
};

export default Signup;
