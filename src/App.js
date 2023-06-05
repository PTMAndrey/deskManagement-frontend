import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Header from "./componente/Header/Header";
import PaginaPrincipala from "./pagini/PaginaPrincipala/PaginaPrincipala";
import Layout from './pagini/Layout/Layout'
import RuteProtejate from "./rute/RuteProtejate";
import Alert from "./componente/Alert/Alert";
import useStateProvider from "./hooks/useStateProvider";
import useWindowDimensions from "./hooks/useWindowDimensions"
import Login from "./pagini/Login/Login";

function App() {
  const { width } = useWindowDimensions();
  const { alert } = useStateProvider();
  return (
    <Router>
      <Routes>
        <Route
          element={
            <>
              <Header expand={width >= 750 ? "md" : false} ></Header>
              <Layout>
                <RuteProtejate />
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
              <Header expand={width >= 750 ? "sm" : false} ></Header>
              <Layout>
                <Outlet />
              </Layout>
            </>
          }
        >
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PaginaPrincipala />} />
          {/* <Route path="/listing" element={<Listing />} />
          <Route path="/listing/:id" element={<Details />} />
          <Route path="/favorites" element={<Favorites />} /> */}
        </Route>

        {/* onboarding routes */}
        {/* <Route path="/register" element={<Onboarding />} />
        <Route path="/forgot-password" element={<Onboarding />} />
        <Route path="/reset-password" element={<Onboarding />} /> */}
      </Routes>
      {alert && <Alert message={alert.message} type={alert.type} />}
    </Router>
  );
}

export default App;
