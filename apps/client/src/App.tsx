import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";
import Publish from "./components/Publish";
import Appbar from "./components/Appbar";
import Home from "./components/Home";
import Editor from "./components/Editor";
import Edit from "./components/Edit";

function App() {
  return (
    <div style={{
      width: "100%",
      height: "97.7vh",
      background: "#eee",
    }}>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path={"/problems/:slug"} element={<Editor />} />
            <Route
              element={<>
                <Appbar />
                <Outlet />
              </>}>

              <Route path={"/"} element={<Home />} />
              <Route path={"/signup"} element={<Signup />} />
              <Route path={"/signin"} element={<Signin />} />
              <Route path={"/publish"} element={<Publish />} />
              <Route path={"/edit/:slug"} element={<Edit />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </div >
  );
}

export default App;
