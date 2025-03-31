import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
		address: "",
	});
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.auth);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name) {
			newErrors.name = "Name is required";
		}
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		}
		if (!formData.address) {
			newErrors.address = "Address is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await dispatch(register(formData)).unwrap();
			toast.success("Registration successful");
			navigate("/");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							to="/login"
							className="font-medium text-primary hover:text-primary-dark"
						>
							sign in to your account
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="name" className="sr-only">
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className={`appearance-none rounded relative block w-full px-3 py-2 border ${
									errors.name
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Full Name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.name}
								</p>
							)}
						</div>

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
								value={formData.email}
								onChange={handleChange}
								className={`appearance-none rounded relative block w-full px-3 py-2 border ${
									errors.email
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
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
								required
								value={formData.password}
								onChange={handleChange}
								className={`appearance-none rounded relative block w-full px-3 py-2 border ${
									errors.password
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Password"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-500">
									{errors.password}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="sr-only"
							>
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`appearance-none rounded relative block w-full px-3 py-2 border ${
									errors.confirmPassword
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Confirm Password"
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-500">
									{errors.confirmPassword}
								</p>
							)}
						</div>

						<div>
							<label htmlFor="phone" className="sr-only">
								Phone Number
							</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								required
								value={formData.phone}
								onChange={handleChange}
								className={`appearance-none rounded relative block w-full px-3 py-2 border ${
									errors.phone
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Phone Number"
							/>
							{errors.phone && (
								<p className="mt-1 text-sm text-red-500">
									{errors.phone}
								</p>
							)}
						</div>

						<div>
							<label htmlFor="address" className="sr-only">
								Address
							</label>
							<textarea
								id="address"
								name="address"
								required
								value={formData.address}
								onChange={handleChange}
								rows="3"
								className={`appearance-none rounded relative block w-full px-3 py-2 border ${
									errors.address
										? "border-red-500"
										: "border-gray-300"
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
								placeholder="Address"
							/>
							{errors.address && (
								<p className="mt-1 text-sm text-red-500">
									{errors.address}
								</p>
							)}
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
								"Create Account"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
