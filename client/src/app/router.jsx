import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LoginPage from '../scenes/loginPage';
import HomePage from '../scenes/homePage';
import ProfilePage from '../scenes/profilePage';
import MyProductPage from '../scenes/myProductPage';
import ProductDetail from '../scenes/productDetailPage';
import EmployeeProfilePage from '../scenes/employeeprofilePage';
import PaymentPage from '../scenes/paymentPage';
import PredictionPage from '../scenes/predictionsPage';
import DeletePage from '../scenes/deletePage';

const protectedRoutes = [
  { path: '/home', element: <HomePage /> },
  { path: '/employee/:userId', element: <EmployeeProfilePage /> },
  { path: '/myproduct', element: <MyProductPage /> },
  { path: '/products/:productId/product', element: <ProductDetail /> },
  { path: '/pay', element: <PaymentPage /> },
  { path: '/prediction', element: <PredictionPage /> },
  { path: '/delete', element: <DeletePage /> },
  { path: '/profile', element: <ProfilePage /> },
];

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(useSelector((state) => state.token));
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
