import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter, RouterProvider,
} from "react-router-dom";
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import ErrorPage from './error-page';
import './index.css';



//imports pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Forgot from './pages/Forgot/Forgot';
import Settings from './pages/Settings/Settings';
import Signup from './pages/Signup/Signup';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Chat from './pages/Chat/Chat';
import Admin from './pages/Admin/Admin';

const router = createHashRouter([
  {
    path: "/",
    element: <PrivateRoute>
      <App>
        <Home />
      </App>
    </PrivateRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat",
    element: <PrivateRoute>
      <App>
        <Chat />
      </App>
    </PrivateRoute>,
  },
  {
    path: "/settings",
    element: <PrivateRoute>
      <App>
        <Settings />
      </App>
    </PrivateRoute>,
  },
  {
    path: "/admin",

    element: <PrivateRoute>
      {/* <AdminRoute>
        <App>
          <Admin />
        </App>
      </AdminRoute> */}
        <App>
          <AdminRoute>
            <Admin />
          </AdminRoute>
        </App>
    </PrivateRoute>, 
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />
  }, 
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/forgot",
    element: <Forgot />
  }, 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ChatContextProvider>
         <RouterProvider router={router} />
      </ChatContextProvider>
    </AuthProvider>
  </React.StrictMode>
);