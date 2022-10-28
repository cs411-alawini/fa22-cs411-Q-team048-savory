import { PrimaryButton } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Auth() {
    const [isLoginSuccess, setIsLoginSuccess]= useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if(isLoginSuccess)
        {
            navigate("/home");
        }
    }, [isLoginSuccess])
  return (
    <div className="auth">
      <div style={{ display: "flex", flexDirection: "column", alignItems:"center", justifyContent: "center", width: "600px", height: "350px" }}>
        Login
        <PrimaryButton text="Login" style={{marginTop: "50px"}} onClick={() => setIsLoginSuccess(true)} />
        </div>
    </div>
  );
}
