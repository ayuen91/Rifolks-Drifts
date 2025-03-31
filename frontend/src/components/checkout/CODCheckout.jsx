import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createOrder } from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";

const CODCheckout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { items, total } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		fullName: user?.full_name || "",
		phone: user?.phone || "",
		address: user?.address || "",
		city: user?.city || "",
		state: user?.state || "",
		postalCode: user?.postal_code || "",
		country: user?.country || "",
		specialInstructions: "",
		agreeToCOD: false,
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.agreeToCOD) {
			toast.error("Please agree to the COD terms");
			return;
		}

		setLoading(true);
		try {
			// Create order
			const orderData = {
				user_id: user.id,
				items: items.map((item) => ({
					product_id: item.id,
					quantity: item.quantity,
					price: item.price,
					selected_size: item.selectedSize,
					selected_color: item.selectedColor,
				})),
				total_amount: total,
				shipping_address: {
					full_name: formData.fullName,
					phone: formData.phone,
					address: formData.address,
					city: formData.city,
					state: formData.state,
					postal_code: formData.postalCode,
					country: formData.country,
				},
				payment_method: "cod",
				status: "pending",
			};

			await dispatch(createOrder(orderData)).unwrap();
			dispatch(clearCart());
			toast.success("Order placed successfully!");
			navigate("/order-confirmation");
		} catch (error) {
			toast.error(error.message || "Failed to place order");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">
				Cash on Delivery Checkout
			</h2>

			{/* COD Information */}
			<div className="bg-gray-50 p-4 rounded-lg mb-6">
				<h3 className="font-semibold mb-2">
					Cash on Delivery Information
				</h3>
				<p className="text-gray-600 mb-4">
					Pay cash upon delivery. Available in select areas. A COD fee
					of $2.99 may apply.
				</p>
				<ul className="list-disc list-inside text-gray-600 space-y-1">
					<li>Please have exact change ready</li>
					<li>Delivery personnel will collect payment</li>
					<li>Maximum order value: $500</li>
					<li>Delivery within 3-5 business days</li>
				</ul>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Shipping Information */}
				<div className="space-y-4">
					<h3 className="font-semibold">Shipping Information</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Phone Number
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Address
						</label>
						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
							/>
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
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
							/>
						</div>
					</div>
				</div>

				{/* Special Instructions */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Special Instructions
					</label>
					<textarea
						name="specialInstructions"
						value={formData.specialInstructions}
						onChange={handleChange}
						rows={3}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
						placeholder="Any special instructions for delivery?"
					/>
				</div>

				{/* COD Agreement */}
				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							type="checkbox"
							name="agreeToCOD"
							checked={formData.agreeToCOD}
							onChange={handleChange}
							required
							className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
					</div>
					<div className="ml-3 text-sm">
						<label className="font-medium text-gray-700">
							I agree to pay the total amount in cash upon
							delivery
						</label>
						<p className="text-gray-500">
							By checking this box, you confirm that you will have
							the exact amount ready for the delivery personnel.
						</p>
					</div>
				</div>

				{/* Order Summary */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h3 className="font-semibold mb-4">Order Summary</h3>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span>Subtotal</span>
							<span>${total.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span>Shipping</span>
							<span>Free</span>
						</div>
						<div className="flex justify-between">
							<span>COD Fee</span>
							<span>$2.99</span>
						</div>
						<div className="border-t pt-2 mt-2">
							<div className="flex justify-between font-semibold">
								<span>Total</span>
								<span>${(total + 2.99).toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? "Processing..." : "Place Order"}
				</button>
			</form>
		</div>
	);
};

export default CODCheckout;
