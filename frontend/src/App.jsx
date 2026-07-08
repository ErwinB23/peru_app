import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Configuracion from './pages/Configuracion';
import Departamentos from './pages/Departamentos';
import DetalleDepartamento from './pages/DetalleDepartamento';
import GestionDepartamentos from './pages/GestionDepartamentos';
import GestionContenidoDepartamento from './pages/GestionContenidoDepartamento';
import ListaUsuarios from './pages/ListaUsuarios';
import ProvinciasDepartamento from './pages/ProvinciasDepartamento';
import ExplorarProvincias from './pages/ExplorarProvincias';
import DetalleProvincia from './pages/DetalleProvincia';
import GestionProvincias from './pages/GestionProvincias';
import GestionContenidoProvincia from './pages/GestionContenidoProvincia';
import DistritosProvincia from './pages/DistritosProvincia';
import DetalleDistrito from './pages/DetalleDistrito';
import GestionDistritos from './pages/GestionDistritos';
import ExplorarDistritos from './pages/ExplorarDistritos';
import DistritosDepartamento from './pages/DistritosDepartamento';
import GestionContenidoDistrito from './pages/GestionContenidoDistrito';
import ExplorarCiudades from './pages/ExplorarCiudades';
import CiudadesDepartamento from './pages/CiudadesDepartamento';
import DetalleCiudad from './pages/DetalleCiudad';
import CiudadesProvincia from './pages/CiudadesProvincia';
import CiudadesDistrito from './pages/CiudadesDistrito';
import GestionCiudades from './pages/GestionCiudades';
import GestionContenidoCiudad from './pages/GestionContenidoCiudad';
import DetalleLugarTuristico from './pages/DetalleLugarTuristico';


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />

            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/departamentos" element={<PrivateRoute><Departamentos /></PrivateRoute>} />
            <Route
              path="/departamentos/:id"
              element={
                <PrivateRoute>
                  <DetalleDepartamento />
                </PrivateRoute>
              }
            />

            

            <Route
              path="/departamentos/:id/provincias"
              element={
                <PrivateRoute>
                  <ProvinciasDepartamento />
                </PrivateRoute>
              }
            />

            <Route
              path="/explorar-provincias"
              element={
                <PrivateRoute>
                  <ExplorarProvincias />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestionar-provincias"
              element={
                <AdminRoute>
                  <GestionProvincias />
                </AdminRoute>
              }
            />

            <Route
              path="/gestionar-provincias/:id/contenido"
              element={
                <AdminRoute>
                  <GestionContenidoProvincia />
                </AdminRoute>
              }
            />

            <Route
              path="/provincias/:id"
              element={
                <PrivateRoute>
                  <DetalleProvincia />
                </PrivateRoute>
              }
            />

            <Route
              path="/provincias/:id/distritos"
              element={
                <PrivateRoute>
                  <DistritosProvincia />
                </PrivateRoute>
              }
            />

            <Route
              path="/distritos/:id"
              element={
                <PrivateRoute>
                  <DetalleDistrito />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestionar-distritos"
              element={
                <AdminRoute>
                  <GestionDistritos />
                </AdminRoute>
              }
            />

            <Route
              path="/explorar-distritos"
              element={
                <PrivateRoute>
                  <ExplorarDistritos />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestionar-distritos/:id/contenido"
              element={
                <AdminRoute>
                  <GestionContenidoDistrito />
                </AdminRoute>
              }
            />

            <Route
              path="/departamentos/:id/distritos"
              element={
                <PrivateRoute>
                  <DistritosDepartamento />
                </PrivateRoute>
              }
            />

            <Route
              path="/explorar-ciudades"
              element={
                <PrivateRoute>
                  <ExplorarCiudades />
                </PrivateRoute>
              }
            />

            <Route
              path="/departamentos/:id/ciudades"
              element={
                <PrivateRoute>
                  <CiudadesDepartamento />
                </PrivateRoute>
              }
            />

            <Route
              path="/ciudades/:id"
              element={
                <PrivateRoute>
                  <DetalleCiudad />
                </PrivateRoute>
              }
            />

            <Route
              path="/provincias/:id/ciudades"
              element={
                <PrivateRoute>
                  <CiudadesProvincia />
                </PrivateRoute>
              }
            />

            <Route
              path="/distritos/:id/ciudades"
              element={
                <PrivateRoute>
                  <CiudadesDistrito />
                </PrivateRoute>
              }
            />

            <Route
              path="/gestionar-ciudades"
              element={
                <AdminRoute>
                  <GestionCiudades />
                </AdminRoute>
              }
            />

            <Route
              path="/gestionar-ciudades/:id/contenido"
              element={
                <AdminRoute>
                  <GestionContenidoCiudad />
                </AdminRoute>
              }
            />

            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/configuracion"
              element={
                <PrivateRoute>
                  <Configuracion />
                </PrivateRoute>
              }
            />

            <Route
              path="/lista-usuarios"
              element={
                <AdminRoute>
                  <ListaUsuarios />
                </AdminRoute>
              }
            />

            <Route
              path="/gestionar-departamentos"
              element={
                <AdminRoute>
                  <GestionDepartamentos />
                </AdminRoute>
              }
            />

            <Route
              path="/gestionar-departamentos/:id/contenido"
              element={
                <AdminRoute>
                  <GestionContenidoDepartamento />
                </AdminRoute>
              }
            />

            <Route
              path="/lugares-turisticos/:id"
              element={
                <PrivateRoute>
                  <DetalleLugarTuristico />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
