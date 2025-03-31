import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuthStatus } from "../../store/slices/authSlice";
import Loading from "../Loading";

const ProtectedRoute = ({ children, requiredRole = null }) => {
	const { isAuthenticated, loading, role } = useSelector(
		(state) => state.auth
	);
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (!isAuthenticated && !loading) {
			dispatch(checkAuthStatus());
		}
	}, [dispatch, isAuthenticated, loading]);

	if (loading) {
		return <Loading />;
	}

	if (!isAuthenticated) {
		return (
			<Navigate to="/admin/login" state={{ from: location }} replace />
		);
	}

	if (requiredRole && role !== requiredRole) {
		return <Navigate to="/admin" replace />;
	}

	return children;
};

export default ProtectedRoute;
