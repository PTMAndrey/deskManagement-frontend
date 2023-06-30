import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import style from "./Login.module.scss";
import Input from "../../componente/Input/Input";
import Button from "../../componente/Buton/Buton";

import { ReactComponent as View } from "../../assets/icons/view.svg";
import { ReactComponent as ViewOff } from "../../assets/icons/view-off.svg";

import useAuth from "../../hooks/useAuth";
import useStateProvider from "../../hooks/useStateProvider";

import { login } from "../../api/API";

const Login = () => {
  const { setUser, setUserId, rememberMe, setRememberMe } = useAuth();

  const { setAlert } = useStateProvider();

  const navigate = useNavigate();

  // const { setUser } = useAuth();
  const [passwordShown, setPasswordShown] = useState(true);

  // form values
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  // error states
  const [emailError, setEmailError] = useState(null);
  const [pwdError, setPwdError] = useState(null);

  const handleEmailError = (e) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(e) === false) {
      setEmailError("Invalid e-mail address!");
    } else {
      setEmailError("");
    }
  };


  const handlePwdError = (e) => {
    if (e.length < 7) {
      setPwdError("Parola trebuie sa fie de cel putin 7 caractere!");
    } else setPwdError("");
  };

  const handleLogin = async () => {
    try {
      if (emailError === "" && pwdError === "") {
        if (pwd.length > 6) {
          const response = await login(email, pwd);
          if (response) {
            setUser(response.data);
            navigate("/");
            if (rememberMe) localStorage.setItem("userID", response?.data.id);
            else sessionStorage.setItem("userID", response?.data.id);
            setAlert({
              type: "success",
              message: "Login successfully",
            });
          }
        }
      } else {
        if (emailError !== "") handleEmailError("");
        if (pwdError !== "") handlePwdError("");
        setAlert({
          type: "danger",
          message: "Fill all the required fields correctly.",
        });
      }
    } catch (error) {
      console.log(error, "error");
      setAlert({
        type: "danger",
        message: "Something went wrong! Check your credentials",
      });
    }
  };

  const passToggleHandler = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={style.containerAuth}>
      <div className={style.contentContainerForm}>
        <div className={style.form}>
          <div className={style.formTitle}>
            <h4 className={style.title}>Log in</h4>
            <p className={style.subTitle}>Enter your account details below.</p>
          </div>

          <div className={style.formInput}>
            {/* email */}
            {emailError && <div className={style.authError}>{emailError}</div>}
            <Input
              label="Email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleEmailError(e.target.value);
              }}
              type="email"
              placeholder={"Email"}
              required
            />

            {/* password */}
            {pwdError && <div className={style.authError}>{pwdError}</div>}
            <Input
              label="Password"
              id="password"
              name="password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                handlePwdError(e.target.value);
              }}
              type={passwordShown ? "password" : "text"}
              placeholder={"Password"}
              icon={passwordShown ? <View /> : <ViewOff />}
              onIconClick={passToggleHandler}
              required
            />
          </div>
        </div>

        <div className={style.rememberMe}>
          <div
            className={style.checkBox}
            type="button"
            onClick={(e) => setRememberMe(!rememberMe)}
          >
            <Input
              type="checkbox"
              label=""
              value={rememberMe}
              checked={rememberMe}
              onClick={(e) => setRememberMe(!rememberMe)}
            />
            <p className={style.textRememberMe}>Remember me</p>
          </div>

          <div className={style.forgotPassword}>
            <span
              className={style.textForgotPassword}
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot your password?
            </span>
          </div>
        </div>
      </div>

      <div className={style.contentContainerAuthOptions}>
        <div className={style.contentContainerButtons}>
          <Button variant="primary" label="Log in" onClick={handleLogin} />
        </div>
        <div className={style.contentContainerAuthEndForm}>
          <p className={style.textAuthEndForm}>
            Don't have an account?{" "}
            <span
              className={style.textAuthEndForm}
              onClick={() => {
                navigate("/register");
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;