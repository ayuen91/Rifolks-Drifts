import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getMyOrders } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		postalCode: "",
		country: "",
	});
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const { userInfo, loading, error } = useSelector((state) => state.auth);
	const { orders } = useSelector((state) => state.orders);

	useEffect(() => {
		if (userInfo) {
			setFormData({
				name: userInfo.name || "",
				email: userInfo.email || "",
				phone: userInfo.phone || "",
				address: userInfo.address || "",
				city: userInfo.city || "",
				postalCode: userInfo.postalCode || "",
				country: userInfo.country || "",
			});
		}
		dispatch(getMyOrders());
	}, [dispatch, userInfo]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name) newErrors.name = "Name is required";
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (!formData.phone) newErrors.phone = "Phone number is required";
		if (!formData.address) newErrors.address = "Address is required";
		if (!formData.city) newErrors.city = "City is required";
		if (!formData.postalCode)
			newErrors.postalCode = "Postal code is required";
		if (!formData.country) newErrors.country = "Country is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await dispatch(updateProfile(formData)).unwrap();
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">My Profile</h1>

				{/* Profile Form */}
				<div className="bg-white p-6 rounded-lg shadow-md mb-8">
					<h2 className="text-xl font-semibold mb-4">
						Profile Information
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-gray-700 mb-2">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.name
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.name}
								</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.email
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-500">
									{errors.email}
								</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2">
								Phone
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.phone
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.phone && (
								<p className="mt-1 text-sm text-red-500">
									{errors.phone}
								</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2">
								Address
							</label>
							<input
								type="text"
								name="address"
								value={formData.address}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.address
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.address && (
								<p className="mt-1 text-sm text-red-500">
									{errors.address}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-gray-700 mb-2">
									City
								</label>
								<input
									type="text"
									name="city"
									value={formData.city}
									onChange={handleChange}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
										errors.city
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								{errors.city && (
									<p className="mt-1 text-sm text-red-500">
										{errors.city}
									</p>
								)}
							</div>

							<div>
								<label className="block text-gray-700 mb-2">
									Postal Code
								</label>
								<input
									type="text"
									name="postalCode"
									value={formData.postalCode}
									onChange={handleChange}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
										errors.postalCode
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								{errors.postalCode && (
									<p className="mt-1 text-sm text-red-500">
										{errors.postalCode}
									</p>
								)}
							</div>

							<div>
								<label className="block text-gray-700 mb-2">
									Country
								</label>
								<input
									type="text"
									name="country"
									value={formData.country}
									onChange={handleChange}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
										errors.country
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								{errors.country && (
									<p className="mt-1 text-sm text-red-500">
										{errors.country}
									</p>
								)}
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors ${
								loading ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							{loading ? "Updating..." : "Update Profile"}
						</button>
					</form>
				</div>

				{/* Order History */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">
						Order History
					</h2>
					{orders.length === 0 ? (
						<p className="text-gray-500">No orders found</p>
					) : (
						<div className="space-y-4">
							{orders.map((order) => (
								<div
									key={order._id}
									className="border rounded-md p-4 hover:shadow-md transition-shadow"
								>
									<div className="flex justify-between items-start mb-2">
										<div>
											<p className="font-medium">
												Order #{order._id}
											</p>
											<p className="text-sm text-gray-500">
												{new Date(
													order.createdAt
												).toLocaleDateString()}
											</p>
										</div>
										<span
											className={`px-2 py-1 rounded-full text-sm ${
												order.isDelivered
													? "bg-green-100 text-green-800"
													: order.isPaid
													? "bg-blue-100 text-blue-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{order.isDelivered
												? "Delivered"
												: order.isPaid
												? "Paid"
												: "Pending"}
										</span>
									</div>
									<div className="space-y-2">
										{order.orderItems.map((item) => (
											<div
												key={item._id}
												className="flex items-center space-x-4"
											>
												<img
													src={item.image}
													alt={item.name}
													className="w-16 h-16 object-cover rounded"
												/>
												<div className="flex-1">
													<p className="font-medium">
														{item.name}
													</p>
													<p className="text-sm text-gray-500">
														{item.qty} x $
														{item.price}
													</p>
												</div>
												<p className="font-medium">
													$
													{(
														item.qty * item.price
													).toFixed(2)}
												</p>
											</div>
										))}
									</div>
									<div className="mt-4 pt-4 border-t">
										<div className="flex justify-between items-center">
											<p className="text-gray-500">
												Total:{" "}
												<span className="font-medium">
													$
													{order.totalPrice.toFixed(
														2
													)}
												</span>
											</p>
											<Link
												to={`/orders/${order._id}`}
												className="text-primary hover:text-primary-dark"
											>
												View Details
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
