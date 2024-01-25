import { Link } from "react-router-dom";

function App() {
  return (
    <div className="h-screen flex-col polka flex items-center">
      <h1 className=" text-6xl  text-blue-800 my-10 font-light">Paytm</h1>
      <div className="flex flex-row gap-5">
        <Link to="/signin"><button className="rounded-md px-3 py-2 font-semibold bg-slate-800 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Sign In</button></Link>
        <Link to="/signup"><button className="rounded-md px-3 py-2 font-semibold bg-slate-800 hover:bg-slate-900 text-slate-100 hover:text-white transition-colors">Sign Up</button></Link>
      </div>
    </div>
  )
}

export default App
