import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../store/slices/orderSlice";
import toast from "react-hot-toast";

const OrderDetails = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { order, loading, error } = useSelector((state) => state.orders);

	useEffect(() => {
		dispatch(getOrderById(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
						<div className="space-y-4">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
					<p className="text-gray-600">
						The order you're looking for doesn't exist or you don't
						have permission to view it.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Order Details</h1>

				{/* Order Status */}
				<div className="bg-white p-6 rounded-lg shadow-md mb-8">
					<div className="flex justify-between items-center mb-4">
						<div>
							<h2 className="text-xl font-semibold">
								Order #{order._id}
							</h2>
							<p className="text-gray-500">
								Placed on{" "}
								{new Date(order.createdAt).toLocaleDateString()}
							</p>
						</div>
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${
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

					{/* Order Items */}
					<div className="space-y-4">
						{order.orderItems.map((item) => (
							<div
								key={item._id}
								className="flex items-center space-x-4 py-4 border-b last:border-b-0"
							>
								<img
									src={item.image}
									alt={item.name}
									className="w-20 h-20 object-cover rounded"
								/>
								<div className="flex-1">
									<h3 className="font-medium">{item.name}</h3>
									<p className="text-gray-500">
										Size: {item.size}
									</p>
									<p className="text-gray-500">
										Quantity: {item.qty}
									</p>
									<p className="text-gray-500">
										Price: ${item.price}
									</p>
									<p className="font-medium">
										Total: $
										{(item.qty * item.price).toFixed(2)}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Order Summary */}
					<div className="mt-6 pt-6 border-t">
						<h3 className="text-lg font-semibold mb-4">
							Order Summary
						</h3>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600">Subtotal</span>
								<span>${order.itemsPrice.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Shipping</span>
								<span>${order.shippingPrice.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Tax</span>
								<span>${order.taxPrice.toFixed(2)}</span>
							</div>
							<div className="flex justify-between font-semibold text-lg pt-2 border-t">
								<span>Total</span>
								<span>${order.totalPrice.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Shipping Information */}
				<div className="bg-white p-6 rounded-lg shadow-md mb-8">
					<h2 className="text-xl font-semibold mb-4">
						Shipping Information
					</h2>
					<div className="space-y-2">
						<p>
							<span className="font-medium">Name:</span>{" "}
							{order.shippingAddress.name}
						</p>
						<p>
							<span className="font-medium">Address:</span>{" "}
							{order.shippingAddress.address}
						</p>
						<p>
							<span className="font-medium">City:</span>{" "}
							{order.shippingAddress.city}
						</p>
						<p>
							<span className="font-medium">Postal Code:</span>{" "}
							{order.shippingAddress.postalCode}
						</p>
						<p>
							<span className="font-medium">Country:</span>{" "}
							{order.shippingAddress.country}
						</p>
					</div>
				</div>

				{/* Payment Information */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">
						Payment Information
					</h2>
					<div className="space-y-2">
						<p>
							<span className="font-medium">Payment Method:</span>{" "}
							{order.paymentMethod}
						</p>
						<p>
							<span className="font-medium">Payment Status:</span>{" "}
							<span
								className={`px-2 py-1 rounded-full text-sm ${
									order.isPaid
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{order.isPaid ? "Paid" : "Not Paid"}
							</span>
						</p>
						{order.paidAt && (
							<p>
								<span className="font-medium">Paid At:</span>{" "}
								{new Date(order.paidAt).toLocaleDateString()}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
