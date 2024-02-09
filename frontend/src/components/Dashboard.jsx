import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userBulkResponse = await axios.get(`${import.meta.env.BACKEND_URL+'/api/v1/user/bulk'}`, {
          headers: { Authorization: `Bearer ${window.localStorage.getItem('muku-pay-token')}` }
        });


        const accountResponse = await axios.get(`${import.meta.env.BACKEND_URL+'/api/v1/account/user'}`, {
          headers: { Authorization: `Bearer ${window.localStorage.getItem('muku-pay-token')}` }
        });


        setUsers(userBulkResponse.data.data);
        setAccount(accountResponse.data.account);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/signin');
      }
    };

    fetchData();
  }, []);

  const onSendHandler = (e, userId) => {
    e.preventDefault();
    navigate('/send', { state: { key: userId } });
  }
  
  console.log(account);

  if (users.length === 0 || account === null) return;
  return (
    <div className="h-screen">
      <nav className="h-12 bg-slate-800 flex justify-between text-white font-semibold items-center text-xl px-4">
        <h1>Dashboard</h1>
        <h2>Account : {account.id} Balance : {account.balance}</h2>
      </nav>
      <div>
        <h2 className="mx-8 mt-8 font-semibold">Send money :</h2>
        <ul className="mx-8 flex flex-col gap-3">
          {users.map((user) => {
            return (
              <li key={user.id} className="flex items-center gap-4">
                <h2 className="font-semibold text-md">{user.firstName + " " + user.lastName}</h2>
                <button onClick={(e) => onSendHandler(e, user.id )} className="rounded-md px-3 py-2 font-semibold bg-green-500 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Send money</button>
              </li>
            )
          })}
        </ul>
      </div>
      <div>
      </div>
    </div>
  );
};

export default Dashboard;
