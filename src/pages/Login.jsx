import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import PageNav from "../components/PageNav";
import styles from "./Login.module.css";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <main className={styles.login}>
      <PageNav />
      <div className={styles.loginContainer}>
        <h1>登入到 WorldWise</h1>
        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              login(credentialResponse);
              navigate("/app", { replace: true });
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </main>
  );
}
