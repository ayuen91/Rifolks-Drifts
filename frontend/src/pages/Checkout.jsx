import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const Checkout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { cartItems, totalPrice } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		fullName: user?.name || "",
		phoneNumber: "",
		address: "",
		city: "",
		state: "",
		postalCode: "",
		specialInstructions: "",
		codAgreement: false,
	});

	useEffect(() => {
		if (cartItems.length === 0) {
			navigate("/cart");
		}
	}, [cartItems, navigate]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.codAgreement) {
			toast.error("Please agree to the Cash on Delivery terms");
			return;
		}

		const orderData = {
			orderItems: cartItems,
			shippingAddress: {
				fullName: formData.fullName,
				phoneNumber: formData.phoneNumber,
				address: formData.address,
				city: formData.city,
				state: formData.state,
				postalCode: formData.postalCode,
			},
			itemsPrice: totalPrice,
			shippingPrice: 0,
			totalPrice,
			specialInstructions: formData.specialInstructions,
		};

		try {
			await dispatch(createOrder(orderData)).unwrap();
			dispatch(clearCart());
			toast.success("Order placed successfully!");
			navigate("/order-confirmation");
		} catch (error) {
			toast.error(error.message || "Failed to place order");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Checkout</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<h2 className="text-xl font-semibold mb-4">
						Shipping Information
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Phone Number
							</label>
							<input
								type="tel"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Address
							</label>
							<textarea
								name="address"
								value={formData.address}
								onChange={handleChange}
								required
								rows="3"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									City
								</label>
								<input
									type="text"
									name="city"
									value={formData.city}
									onChange={handleChange}
									required
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									State
								</label>
								<input
									type="text"
									name="state"
									value={formData.state}
									onChange={handleChange}
									required
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Postal Code
							</label>
							<input
								type="text"
								name="postalCode"
								value={formData.postalCode}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Special Instructions
							</label>
							<textarea
								name="specialInstructions"
								value={formData.specialInstructions}
								onChange={handleChange}
								rows="3"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div className="flex items-center">
							<input
								type="checkbox"
								name="codAgreement"
								checked={formData.codAgreement}
								onChange={handleChange}
								required
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
							/>
							<label className="ml-2 block text-sm text-gray-900">
								I agree to pay the total amount in cash upon
								delivery
							</label>
						</div>

						<button
							type="submit"
							className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Place Order
						</button>
					</form>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-4">
						Order Summary
					</h2>
					<div className="bg-gray-50 p-4 rounded-lg">
						{cartItems.map((item) => (
							<div
								key={item._id}
								className="flex justify-between mb-2"
							>
								<span>
									{item.name} x {item.quantity}
								</span>
								<span>
									${(item.price * item.quantity).toFixed(2)}
								</span>
							</div>
						))}
						<div className="border-t border-gray-200 my-2"></div>
						<div className="flex justify-between font-semibold">
							<span>Total</span>
							<span>${totalPrice.toFixed(2)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
