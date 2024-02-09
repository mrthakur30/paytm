import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import Dashboard from './components/Dashboard.jsx' ;
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import Send from './components/Send.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element : <Dashboard />
  },
  {
    path: "/send",
    element : <Send />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
