import { useState } from "react"
import axios from "axios";
import { useNavigate , useLocation } from "react-router-dom";

const Send = () => {
    let {state} = useLocation();
    const [amount,setAmount] = useState(0);
    const navigate = useNavigate();
    console.log('====================================');
    console.log(state.key);
    console.log('====================================');
    const tansferMoneyHandler = async ()=>{
        await axios.post('http://localhost:8080/api/v1/account/transfer', {
            amount : amount, to : state.key
          }, {
            headers: { Authorization: `Bearer ${window.localStorage.getItem('muku-pay-token')}` }
          })
          
            .then(response => {
                console.log('====================================');
                console.log(response);
                console.log('====================================');
               navigate('/dashboard');
            })
            .catch(error => {
              console.log(error);
            });
        }
 
  return (
    <div className="h-screen absolute w-screen grid  bg-opacity-45 z-10 bg-black justify-items-center">
        <div className=" w-1/3 h-60 bg-slate-100 rounded-md p-5">
        <h1>Send Money to {" Friend Name"}</h1>
        <input type="text" placeholder="Enter Amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
        <button onClick={tansferMoneyHandler} className="rounded-md px-3 py-2 font-semibold bg-green-500 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Transfer Money</button>
        </div>
     </div>
  )
}

export default Send 