import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { loading, error } = useSelector((state) => state.auth);

	const redirect = location.search ? location.search.split("=")[1] : "/";

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const validateForm = () => {
		const newErrors = {};
		if (!email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Email is invalid";
		}
		if (!password) {
			newErrors.password = "Password is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await dispatch(login({ email, password })).unwrap();
			toast.success("Login successful");
			navigate(redirect);
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							to="/register"
							className="font-medium text-primary hover:text-primary-dark"
						>
							create a new account
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.email
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Email address"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-500">
									{errors.email}
								</p>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.password
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Password"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-500">
									{errors.password}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-900"
							>
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<Link
								to="/forgot-password"
								className="font-medium text-primary hover:text-primary-dark"
							>
								Forgot your password?
							</Link>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
								loading
									? "bg-primary/70 cursor-not-allowed"
									: "bg-primary hover:bg-primary-dark"
							} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
						>
							{loading ? (
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
							) : (
								"Sign in"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
