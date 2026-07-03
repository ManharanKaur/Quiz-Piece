import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TakeQuiz from "./pages/TakeQuiz";
import "./styles/App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/take-quiz" element={<TakeQuiz />} />
    </Routes>
  );
}

export default App;
