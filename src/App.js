import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Header from "./pages/Header/Header";
import Home from "./pages/Home/Home";
import Layout from './pages/Layout/Layout'
import ProtectedRoute from "./routes/ProtectedRoutes";
import Alert from "./components/Alert/Alert";
import useStateProvider from "./hooks/useStateProvider";
import useWindowDimensions from "./hooks/useWindowDimensions"

function App() {
  const { width } = useWindowDimensions();
  const { alert } = useStateProvider();
  return (
    <Router>
      <Routes>
        <Route
          element={
            <>
              <Header expand = {width >= 630 ? "md" : false} ></Header>
              <Layout>
                <ProtectedRoute />
              </Layout>
            </>
          }
        >
          {/* protected routes */}
          {/* <Route path="/add" element={<AddEdit />} />
          <Route path="/add/preview" element={<Preview />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-account">
            <Route path="profile" element={<MyAccount />} />
            <Route path="security" element={<MyAccount />} />
            <Route path="notifications" element={<MyAccount />} />
            <Route path="messages" element={<MyAccount />} />
          </Route>
          <Route path="/edit/:id" element={<AddEdit />} /> */}
        </Route>

        <Route
          element={
            <>
              <Header expand = {width >= 630 ? "sm" : false} ></Header>
              <Layout>
                <Outlet />
              </Layout>
            </>
          }
        >
          {/* public routes */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/listing" element={<Listing />} />
          <Route path="/listing/:id" element={<Details />} />
          <Route path="/favorites" element={<Favorites />} /> */}
        </Route>

        {/* onboarding routes */}
        {/* <Route path="/login" element={<Onboarding />} />
        <Route path="/register" element={<Onboarding />} />
        <Route path="/forgot-password" element={<Onboarding />} />
        <Route path="/reset-password" element={<Onboarding />} /> */}
      </Routes>
      {alert && <Alert message={alert.message} type={alert.type} />}
    </Router>
  );
}

export default App;
