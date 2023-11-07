import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorPage from './error-page.jsx';
import App from './routes/App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './routes/signup.jsx';
import { isLoggedIn } from './helpers/credentials.js';
import Dashboard from './routes/dashboard.jsx';

const noLoggedRoutes = [{
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
},
{
  path: "/signup",
  element: <Signup />,
}]

const loggedRoutes = [{
  path: "/",
  element: <Dashboard />,
  errorElement: <ErrorPage />,
}]

const router = createBrowserRouter(isLoggedIn() ? loggedRoutes : noLoggedRoutes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);