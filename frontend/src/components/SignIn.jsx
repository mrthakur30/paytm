import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    axios.post(`${process.env.BACKEND_URL +'/api/v1/user/signin'}`, {
      username: username,
      password: password
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
         window.localStorage.setItem('muku-pay-token', response.data.token);
         navigate('/dashboard');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="flex min-h-screen justify-center ">
      <div>
        <h1 className=" text-3xl  text-blue-800 my-10 font-light">Sign In</h1>
        <form onSubmit={submitHandler} className="grid gap-2 justify-items-center">
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" value={username} />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" value={password} />
          <button type="submit" className="rounded-md px-3 py-2 font-semibold bg-slate-800 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default SignIn