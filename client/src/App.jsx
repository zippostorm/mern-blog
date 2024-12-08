import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "./redux/user/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    verifyToken();
  });

  const verifyToken = async () => {
    if (currentUser) {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // Отправляем куки
        });

        if (!response.ok) {
          console.log("Unauthorized");
          dispatch(signoutSuccess());
        }

        const data = await response.json();
      } catch (error) {
        console.log("Token verification failed:", error.message);
        // Разлогиниваем пользователя при невалидном токене
        if (currentUser) {
          dispatch(signoutSuccess());
        }
      }
    }
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Контейнер для Routes повинен займати весь доступний простір */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/create-post" element={<CreatePost />} />
            </Route>
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </div>
        <FooterCom />
      </div>
    </BrowserRouter>
  );
};

export default App;
