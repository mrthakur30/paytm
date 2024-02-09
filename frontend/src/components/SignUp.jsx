import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SignUp = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.BACKEND_URL +'/api/v1/user/signup'}`, {
      firstname: firstName,
      lastname: lastName,
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
        <h1 className=" text-3xl  text-blue-800 my-10 font-light">Sign Up</h1>
        <form onSubmit={submitHandler} className="grid gap-2 justify-items-center">
          <input type="text" onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" value={firstName} />
          <input type="text" onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" value={lastName} />
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" value={username} />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" value={password} />
          <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" value={confirmPassword} />
          <button type="submit" className="rounded-md px-3 py-2 font-semibold bg-slate-800 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default SignUp