import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";
import Publish from "./components/publish/Publish";
import Appbar from "./components/Appbar";
import Home from "./components/Home";
import Editor from "./components/Editor";


function App() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#eee",
    }}>
      <Appbar />
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/signin"} element={<Signin />} />
            {/* Clear description from localStorage while logging out */}
            <Route path={"/publish"} element={<Publish />} />
            <Route path={"/editor"} element={<Editor />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;
