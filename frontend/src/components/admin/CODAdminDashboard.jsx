import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	fetchCODOrders,
	updateOrderStatus,
	assignDeliveryStaff,
} from "../../store/slices/codOrdersSlice";

const CODAdminDashboard = () => {
	const dispatch = useDispatch();
	const {
		items: orders,
		loading,
		error,
		statistics,
	} = useSelector((state) => state.codOrders);
	const { user } = useSelector((state) => state.auth);

	const [selectedOrders, setSelectedOrders] = useState([]);
	const [selectedStaff, setSelectedStaff] = useState("");
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [codFee, setCodFee] = useState(0);
	const [returnFee, setReturnFee] = useState(0);

	useEffect(() => {
		dispatch(fetchCODOrders());
	}, [dispatch]);

	const handleStatusUpdate = async (orderId, status) => {
		try {
			await dispatch(updateOrderStatus({ orderId, status })).unwrap();
			toast.success("Order status updated successfully");
		} catch (error) {
			toast.error(error.message || "Failed to update status");
		}
	};

	const handleStaffAssignment = async () => {
		if (!selectedStaff) {
			toast.error("Please select a delivery staff member");
			return;
		}

		try {
			await dispatch(
				assignDeliveryStaff({
					orderIds: selectedOrders,
					staffId: selectedStaff,
				})
			).unwrap();
			toast.success("Orders assigned successfully");
			setShowAssignModal(false);
			setSelectedOrders([]);
			setSelectedStaff("");
		} catch (error) {
			toast.error(error.message || "Failed to assign orders");
		}
	};

	const handleFeeUpdate = async (type) => {
		try {
			const fee = type === "cod" ? codFee : returnFee;
			// Implement API call to update fees
			toast.success(`${type.toUpperCase()} fee updated successfully`);
		} catch (error) {
			toast.error(error.message || `Failed to update ${type} fee`);
		}
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
				COD Management Dashboard
			</h1>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold mb-2">Total Orders</h3>
					<p className="text-3xl font-bold text-indigo-600">
						{statistics.totalOrders}
					</p>
				</div>
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold mb-2">
						Pending Payment
					</h3>
					<p className="text-3xl font-bold text-yellow-600">
						{statistics.pendingPayment}
					</p>
				</div>
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold mb-2">
						Payment Collected
					</h3>
					<p className="text-3xl font-bold text-green-600">
						{statistics.paymentCollected}
					</p>
				</div>
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold mb-2">Returns</h3>
					<p className="text-3xl font-bold text-red-600">
						{statistics.returns}
					</p>
				</div>
			</div>

			{/* Configuration */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-semibold mb-4">
					COD Configuration
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							COD Fee
						</label>
						<div className="flex space-x-2">
							<input
								type="number"
								value={codFee}
								onChange={(e) =>
									setCodFee(parseFloat(e.target.value))
								}
								className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								min="0"
								step="0.01"
							/>
							<button
								onClick={() => handleFeeUpdate("cod")}
								className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
							>
								Update
							</button>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Return Fee
						</label>
						<div className="flex space-x-2">
							<input
								type="number"
								value={returnFee}
								onChange={(e) =>
									setReturnFee(parseFloat(e.target.value))
								}
								className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								min="0"
								step="0.01"
							/>
							<button
								onClick={() => handleFeeUpdate("return")}
								className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
							>
								Update
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Orders List */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">COD Orders</h2>
					<button
						onClick={() => setShowAssignModal(true)}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
						disabled={selectedOrders.length === 0}
					>
						Assign Delivery Staff
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									<input
										type="checkbox"
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedOrders(
													orders.map(
														(order) => order.id
													)
												);
											} else {
												setSelectedOrders([]);
											}
										}}
										checked={
											selectedOrders.length ===
											orders.length
										}
										className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Order ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Customer
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Amount
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{orders.map((order) => (
								<tr key={order.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<input
											type="checkbox"
											checked={selectedOrders.includes(
												order.id
											)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedOrders([
														...selectedOrders,
														order.id,
													]);
												} else {
													setSelectedOrders(
														selectedOrders.filter(
															(id) =>
																id !== order.id
														)
													);
												}
											}}
											className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											#{order.order.order_number}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{order.order.shipping_address.name}
										</div>
										<div className="text-sm text-gray-500">
											{order.order.shipping_address.phone}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											${order.total_amount.toFixed(2)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												order.payment_status === "paid"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{order.payment_status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<select
											value={order.delivery_status}
											onChange={(e) =>
												handleStatusUpdate(
													order.id,
													e.target.value
												)
											}
											className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										>
											<option value="pending">
												Pending
											</option>
											<option value="assigned">
												Assigned
											</option>
											<option value="out_for_delivery">
												Out for Delivery
											</option>
											<option value="delivered">
												Delivered
											</option>
											<option value="returned">
												Returned
											</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Assign Staff Modal */}
			{showAssignModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-lg p-6 max-w-md w-full">
						<h2 className="text-xl font-semibold mb-4">
							Assign Delivery Staff
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Select Staff Member
								</label>
								<select
									value={selectedStaff}
									onChange={(e) =>
										setSelectedStaff(e.target.value)
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									required
								>
									<option value="">
										Select a staff member
									</option>
									{/* Add staff options here */}
								</select>
							</div>
							<div className="flex justify-end space-x-3">
								<button
									onClick={() => setShowAssignModal(false)}
									className="px-4 py-2 text-gray-700 hover:text-gray-900"
								>
									Cancel
								</button>
								<button
									onClick={handleStaffAssignment}
									className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
								>
									Assign
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CODAdminDashboard;
