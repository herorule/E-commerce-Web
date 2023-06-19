import { useCallback, useRef , useState} from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const uniRef = useRef()
  const pdRef = useRef()
  const pRef = useRef()
  const eRef = useRef()
  const adRef = useRef()
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleRegister = useCallback(async()=>{
    const uni = uniRef.current
    const pd = pdRef.current
    const p = pRef.current
    const e = eRef.current
    const ad = adRef.current
    
    if (!uni || !pd || !p || !e || !ad) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BE_URI}account/add`,{
        username: uni.value,
        password: pd.value,
        type: 'Customer',
        phone: p.value,
        email: e.value,
        address: ad.value
      })
      console.log(res);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setErrorMsg('Registration failed. Please try again.');
    }

  },[])



    return (
      <div className="Login">
        <div className="box-form">
          <div className="left">
            <div className="overlay">
              <h1>Hello World.</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                et est sed felis aliquet sollicitudin
              </p>
            </div>
          </div>
  
          <div className="right">
            <h5>Register</h5>
            <br />
            <br /><br />
            {errorMsg && <p>{errorMsg}</p>}

  
            <div className="inputs">
              <input type="text" ref={uniRef} placeholder="user name" /> 
              <br />
              <input type="password" ref={pdRef} placeholder="password" />
              <br/>
              <input type="text" ref={pRef} placeholder="phone"/>
              <br />
              <input type="email" ref={eRef} placeholder="email"/>
              <br />
              <input type="text" ref={adRef} placeholder="address"/>
            </div>
  
            <br />
            <br />
  
            
  
            <br />
            <br />
            <button onClick={handleRegister}>SignUp!</button>
            <br />
          <br />
          <p>Already have an account? <br /> <Link to="/Login">Login here</Link></p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Register;