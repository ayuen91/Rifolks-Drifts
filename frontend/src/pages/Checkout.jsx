import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	saveShippingAddress,
	savePaymentMethod,
} from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/orderSlice";
import toast from "react-hot-toast";

const Checkout = () => {
	const [formData, setFormData] = useState({
		address: "",
		city: "",
		postalCode: "",
		country: "",
		paymentMethod: "PayPal",
	});
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { cartItems, shippingAddress } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);
	const { loading, error } = useSelector((state) => state.orders);

	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.qty,
		0
	);
	const shipping = subtotal > 100 ? 0 : 10;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax;

	const validateForm = () => {
		const newErrors = {};
		if (!formData.address) {
			newErrors.address = "Address is required";
		}
		if (!formData.city) {
			newErrors.city = "City is required";
		}
		if (!formData.postalCode) {
			newErrors.postalCode = "Postal code is required";
		}
		if (!formData.country) {
			newErrors.country = "Country is required";
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
			dispatch(saveShippingAddress(formData));
			dispatch(savePaymentMethod(formData.paymentMethod));

			const orderData = {
				orderItems: cartItems,
				shippingAddress: formData,
				paymentMethod: formData.paymentMethod,
				itemsPrice: subtotal,
				shippingPrice: shipping,
				taxPrice: tax,
				totalPrice: total,
			};

			await dispatch(createOrder(orderData)).unwrap();
			toast.success("Order placed successfully");
			navigate(`/orders/${orderData._id}`);
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Shipping Information */}
				<div>
					<h2 className="text-2xl font-bold mb-6">
						Shipping Information
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-gray-700 mb-2">
								Address
							</label>
							<input
								type="text"
								name="address"
								value={formData.address}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-md ${
									errors.address
										? "border-red-500"
										: "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-primary`}
							/>
							{errors.address && (
								<p className="mt-1 text-sm text-red-500">
									{errors.address}
								</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2">
								City
							</label>
							<input
								type="text"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-md ${
									errors.city
										? "border-red-500"
										: "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-primary`}
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
								className={`w-full px-3 py-2 border rounded-md ${
									errors.postalCode
										? "border-red-500"
										: "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-primary`}
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
								className={`w-full px-3 py-2 border rounded-md ${
									errors.country
										? "border-red-500"
										: "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-primary`}
							/>
							{errors.country && (
								<p className="mt-1 text-sm text-red-500">
									{errors.country}
								</p>
							)}
						</div>

						<div>
							<label className="block text-gray-700 mb-2">
								Payment Method
							</label>
							<select
								name="paymentMethod"
								value={formData.paymentMethod}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="PayPal">PayPal</option>
								<option value="Stripe">Stripe</option>
								<option value="Credit Card">Credit Card</option>
							</select>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full py-2 px-4 rounded-md text-white ${
								loading
									? "bg-primary/70 cursor-not-allowed"
									: "bg-primary hover:bg-primary-dark"
							} transition-colors`}
						>
							{loading ? "Processing..." : "Place Order"}
						</button>
					</form>
				</div>

				{/* Order Summary */}
				<div>
					<h2 className="text-2xl font-bold mb-6">Order Summary</h2>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<div className="space-y-4">
							{cartItems.map((item) => (
								<div
									key={item._id}
									className="flex justify-between"
								>
									<div>
										<p className="font-medium">
											{item.name}
										</p>
										<p className="text-sm text-gray-500">
											{item.qty} x ${item.price}
										</p>
									</div>
									<span>
										${(item.qty * item.price).toFixed(2)}
									</span>
								</div>
							))}
						</div>

						<div className="mt-6 space-y-2">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping</span>
								<span>${shipping.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Tax</span>
								<span>${tax.toFixed(2)}</span>
							</div>
							<div className="border-t border-gray-200 pt-2 mt-2">
								<div className="flex justify-between font-semibold">
									<span>Total</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
