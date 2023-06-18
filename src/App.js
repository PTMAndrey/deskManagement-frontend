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
import Profil from "./pagini/Profil/Profil";

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
          <Route path="/" element={<PaginaPrincipala />} />
          <Route path="/profil" element={<Profil />} />

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
