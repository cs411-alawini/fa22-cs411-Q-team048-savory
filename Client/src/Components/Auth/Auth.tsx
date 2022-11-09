import { PrimaryButton, TextField } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authSelector, login } from "./AuthSlice";

export default function Auth() {
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);//just for test here, should be false
  const [isAuthAttempted, setIsAuthAttempted] = useState(false);
  const authDetails = useSelector(authSelector);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();


  
  const handleLogin = () => {
    setIsAuthAttempted(true);
    dispatch(login({ userName: userName, password: password }));
  }
  useEffect(() => {
    if (authDetails.loginResult) {
      setIsLoginSuccess(authDetails.loginResult);
    }
  }, [authDetails.loginResult])
  const onUsernameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      setUserName(newValue);
    }
  }
  const onPasswordChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      setPassword(newValue);
    }
  }
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/home");
    }
    else {
      setError("Login failure");
    }
  }, [isLoginSuccess])
  const handleuserNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
    if(newValue)
    {
      setUserName(newValue);
    }
  }
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
    if(newValue)
    {
      setPassword(newValue);
    }
  }
  return (
    <div className="auth">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "600px", height: "350px" }}>
        <div>
          <TextField
            label="UserName"
            onChange={handleuserNameChange}
          />
          <TextField
            label="Password"
            type="password" 
            onChange={handlePasswordChange}/>


          <PrimaryButton text="Login" style={{ marginTop: "50px" }} onClick={handleLogin} />
        </div>
        {isAuthAttempted && !isLoginSuccess &&
          <div>
            {error}
          </div>}
      </div>
    </div>
  );
}