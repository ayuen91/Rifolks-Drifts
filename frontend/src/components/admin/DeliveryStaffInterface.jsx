import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	fetchCODOrders,
	updateDeliveryStatus,
	recordPayment,
	createReturn,
} from "../../store/slices/codOrdersSlice";

const DeliveryStaffInterface = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const {
		items: orders,
		loading,
		error,
	} = useSelector((state) => state.codOrders);

	const [selectedOrder, setSelectedOrder] = useState(null);
	const [paymentAmount, setPaymentAmount] = useState("");
	const [notes, setNotes] = useState("");
	const [returnReason, setReturnReason] = useState("");
	const [returnItems, setReturnItems] = useState([]);
	const [showReturnModal, setShowReturnModal] = useState(false);

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchCODOrders({ assignedStaff: user.id }));
		}
	}, [dispatch, user?.id]);

	const handleStatusUpdate = async (orderId, status) => {
		try {
			await dispatch(
				updateDeliveryStatus({
					orderId,
					status,
					notes: `Status updated to ${status}`,
				})
			).unwrap();
			toast.success("Delivery status updated successfully");
		} catch (error) {
			toast.error(error.message || "Failed to update status");
		}
	};

	const handlePaymentCollection = async (orderId) => {
		if (!paymentAmount || isNaN(paymentAmount)) {
			toast.error("Please enter a valid payment amount");
			return;
		}

		try {
			await dispatch(
				recordPayment({
					orderId,
					amount: parseFloat(paymentAmount),
					notes,
				})
			).unwrap();
			toast.success("Payment recorded successfully");
			setPaymentAmount("");
			setNotes("");
		} catch (error) {
			toast.error(error.message || "Failed to record payment");
		}
	};

	const handleReturn = async (orderId) => {
		if (!returnReason) {
			toast.error("Please provide a return reason");
			return;
		}

		try {
			await dispatch(
				createReturn({
					orderId,
					reason: returnReason,
					returnFee: 0, // This should be calculated based on business rules
				})
			).unwrap();
			toast.success("Return processed successfully");
			setReturnReason("");
			setShowReturnModal(false);
		} catch (error) {
			toast.error(error.message || "Failed to process return");
		}
	};

	const toggleReturnItem = (itemId) => {
		setReturnItems((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				{error}
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">
				Delivery Staff Dashboard
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{orders.map((order) => (
					<div
						key={order.id}
						className="bg-white rounded-lg shadow-md p-6 space-y-4"
					>
						<div className="flex justify-between items-start">
							<div>
								<h3 className="text-lg font-semibold">
									Order #{order.order.order_number}
								</h3>
								<p className="text-sm text-gray-500">
									{new Date(
										order.created_at
									).toLocaleDateString()}
								</p>
							</div>
							<span
								className={`px-2 py-1 rounded-full text-sm ${
									order.payment_status === "paid"
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{order.payment_status}
							</span>
						</div>

						<div className="space-y-2">
							<p className="font-medium">
								{order.order.shipping_address.name}
							</p>
							<p className="text-sm text-gray-600">
								{order.order.shipping_address.address}
							</p>
							<p className="text-sm text-gray-600">
								{order.order.shipping_address.city},{" "}
								{order.order.shipping_address.state}{" "}
								{order.order.shipping_address.postal_code}
							</p>
							<p className="text-sm text-gray-600">
								Phone: {order.order.shipping_address.phone}
							</p>
						</div>

						<div className="border-t pt-4">
							<h4 className="font-medium mb-2">Order Items</h4>
							{order.order.order_items.map((item) => (
								<div
									key={item.id}
									className="flex justify-between text-sm mb-1"
								>
									<span>
										{item.name} x {item.quantity}
									</span>
									<span>
										$
										{(item.price * item.quantity).toFixed(
											2
										)}
									</span>
								</div>
							))}
							<div className="border-t mt-2 pt-2">
								<div className="flex justify-between font-medium">
									<span>Total</span>
									<span>
										${order.total_amount.toFixed(2)}
									</span>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<button
								onClick={() =>
									handleStatusUpdate(
										order.id,
										"out_for_delivery"
									)
								}
								className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
							>
								Start Delivery
							</button>
							<button
								onClick={() => setSelectedOrder(order)}
								className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
							>
								Record Payment
							</button>
							<button
								onClick={() => {
									setSelectedOrder(order);
									setShowReturnModal(true);
								}}
								className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
							>
								Process Return
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Payment Modal */}
			{selectedOrder && !showReturnModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-lg p-6 max-w-md w-full">
						<h2 className="text-xl font-semibold mb-4">
							Record Payment
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Payment Amount
								</label>
								<input
									type="number"
									value={paymentAmount}
									onChange={(e) =>
										setPaymentAmount(e.target.value)
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Notes
								</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									rows="3"
								/>
							</div>
							<div className="flex justify-end space-x-3">
								<button
									onClick={() => setSelectedOrder(null)}
									className="px-4 py-2 text-gray-700 hover:text-gray-900"
								>
									Cancel
								</button>
								<button
									onClick={() =>
										handlePaymentCollection(
											selectedOrder.id
										)
									}
									className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
								>
									Record Payment
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Return Modal */}
			{showReturnModal && selectedOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-lg p-6 max-w-md w-full">
						<h2 className="text-xl font-semibold mb-4">
							Process Return
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Return Reason
								</label>
								<select
									value={returnReason}
									onChange={(e) =>
										setReturnReason(e.target.value)
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									required
								>
									<option value="">Select a reason</option>
									<option value="wrong_size">
										Wrong Size
									</option>
									<option value="not_as_expected">
										Not as Expected
									</option>
									<option value="damaged">Damaged</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Select Items to Return
								</label>
								{selectedOrder.order.order_items.map((item) => (
									<div
										key={item.id}
										className="flex items-center mb-2"
									>
										<input
											type="checkbox"
											checked={returnItems.includes(
												item.id
											)}
											onChange={() =>
												toggleReturnItem(item.id)
											}
											className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
										/>
										<label className="ml-2 text-sm text-gray-700">
											{item.name} x {item.quantity}
										</label>
									</div>
								))}
							</div>
							<div className="flex justify-end space-x-3">
								<button
									onClick={() => setShowReturnModal(false)}
									className="px-4 py-2 text-gray-700 hover:text-gray-900"
								>
									Cancel
								</button>
								<button
									onClick={() =>
										handleReturn(selectedOrder.id)
									}
									className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
								>
									Process Return
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeliveryStaffInterface;
