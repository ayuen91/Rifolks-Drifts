import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
	const { user, isAdmin } = useSelector((state) => state.auth);

	if (!user || !isAdmin) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default AdminRoute;
