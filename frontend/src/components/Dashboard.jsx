import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userBulkResponse = await axios.get('http://localhost:8080/api/v1/user/bulk', {
          headers: { Authorization: `Bearer ${window.localStorage.getItem('muku-pay-token')}` }
        });

        const accountBalanceResponse = await axios.get('http://localhost:8080/api/v1/account/balance', {
          headers: { Authorization: `Bearer ${window.localStorage.getItem('muku-pay-token')}` }
        });

        setUsers(userBulkResponse.data.data);
        setBalance(accountBalanceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/signin');
      }
    };

    fetchData();
  }, [navigate]);

  const onSendHandler = (e, userId) => {
    e.preventDefault();
    navigate('/send', { state: { key: userId } });
  }


  if (users.length === 0 || balance === null) return;
  return (
    <div className="h-screen">
      <nav className="h-12 bg-slate-800 flex justify-between text-white font-semibold items-center text-xl px-4">
        <h1>Dashboard</h1>
        <h2>Balance : {balance.balance}</h2>
      </nav>
      <div>
        <h2 className="mx-8 mt-8 font-semibold">Send money :</h2>
        <ul className="mx-8 flex flex-col gap-3">
          {users.map((user) => {
            return (balance.userId !== user._id) &&
              <li key={user._id} className="flex items-center gap-4">
                <h2 className="font-semibold text-md">{user.firstName + " " + user.lastName}</h2>
                <button onClick={(e) => onSendHandler(e, user._id )} className="rounded-md px-3 py-2 font-semibold bg-green-500 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Send money</button>
              </li>
          })}
        </ul>
      </div>
      <div>
      </div>
    </div>
  );
};

export default Dashboard;
