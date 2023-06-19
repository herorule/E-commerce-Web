import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./context/user_context";

function Login() {
  const { handleLogin, msg ,isLoggedIn} = useUserContext();
  const uniRef = useRef();
  const pdRef = useRef();
  // const [msg, setMsg] = useState();
  const navigate = useNavigate();


  const login = useCallback(async () => {
    const uni = uniRef.current;
    const pd = pdRef.current;
    if (!uni || !pd) return;
    handleLogin(uni.value, pd.value)
  }, [handleLogin]);

  useEffect(()=>{
    isLoggedIn && navigate('/')
  },[isLoggedIn, navigate])

  return (
    <div className="Login">
      <div className="box-form">
        <div className="left">
          <div className="overlay">
            <h1>Hello World.</h1>
            <p>
              The customer is very important, the customer will be followed by
              the customer. chat and it is but a trigger for trucks to worry
              about
            </p>
          </div>
        </div>

        <div className="right">
          <h5>Login</h5>

          <div className="inputs">
            <input type="text" ref={uniRef} placeholder="user name" />
            <br />
            <input type="password" ref={pdRef} placeholder="password" />
          </div>

          <br />
          <br />

          <div className="remember-me--forget-password">
            <p>forget password?</p>
          </div>

          <br />

          <button onClick={login}>Login</button>

          <br />
          <br />
          <br />
          <p>
            You don't have an account yet sign up here{" "}
            <Link to="/Register">SignUp!</Link>
          </p>
          {msg && <p>{msg}</p>}
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default Login;
