import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authSelector, login, setLoginResult } from "./AuthSlice";

export default function Auth() {
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [isAuthAttempted, setIsAuthAttempted] = useState(false);
  const authDetails = useSelector(authSelector);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    setIsAuthAttempted(true);
    dispatch(setLoginResult(undefined));
    dispatch(login({ userName: userName, password: password }));
  };
  useEffect(() => {
    if (authDetails.loginResult) {
      setIsLoginSuccess(authDetails.loginResult);
    }
  }, [authDetails.loginResult]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/home");
    } else {
      setError("Authentication failed");
    }
  }, [isLoginSuccess]);
  const handleuserNameChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => {
    if (newValue) {
      setUserName(newValue);
    }
  };
  const handlePasswordChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => {
    if (newValue) {
      setPassword(newValue);
    }
  };
  return (
    <div className="auth">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "450px",
          height: "350px",
          border: "2px solid darkgrey",
        }}
      >
        <div>
          {isAuthAttempted && authDetails.loginResult===false && (
            <div style={{marginBottom: "20px"}}>
              <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
                onDismiss={() => setIsAuthAttempted(false)}
              >
                {error}
              </MessageBar>
            </div>
          )}
          <div>
            <div
              style={{ display: "flex", gap: "30px", flexDirection: "column" }}
            >
              <TextField
                label="UserName"
                onChange={handleuserNameChange}
                styles={{
                  root: {
                    width: "300px",
                  },
                }}
              />
              <TextField
                styles={{
                  root: {
                    width: "300px",
                  },
                }}
                label="Password"
                type="password"
                onChange={handlePasswordChange}
              />
            </div>
            <PrimaryButton
              text="Login"
              style={{ marginTop: "50px" }}
              onClick={handleLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
