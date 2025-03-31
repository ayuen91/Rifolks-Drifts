import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyOrders } from "../store/slices/orderSlice";
import toast from "react-hot-toast";

const OrderList = () => {
	const dispatch = useDispatch();
	const { orders, loading, error } = useSelector((state) => state.orders);

	useEffect(() => {
		dispatch(getMyOrders())
			.unwrap()
			.catch((err) => {
				toast.error(err.message);
			});
	}, [dispatch]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">My Orders</h1>

			{orders.length === 0 ? (
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<p className="text-gray-500 mb-4">
						You haven't placed any orders yet.
					</p>
					<Link
						to="/"
						className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
					>
						Start Shopping
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div
							key={order._id}
							className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
						>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
								<div>
									<h2 className="text-xl font-semibold">
										Order #{order._id}
									</h2>
									<p className="text-gray-500">
										Placed on{" "}
										{new Date(
											order.createdAt
										).toLocaleDateString()}
									</p>
								</div>
								<div className="mt-4 md:mt-0">
									<span
										className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
							</div>

							<div className="space-y-4">
								{order.orderItems.map((item) => (
									<div
										key={item._id}
										className="flex items-center space-x-4 py-2 border-b border-gray-100 last:border-0"
									>
										<img
											src={item.image}
											alt={item.name}
											className="w-16 h-16 object-cover rounded"
										/>
										<div className="flex-1">
											<h3 className="font-medium">
												{item.name}
											</h3>
											<p className="text-gray-500">
												{item.qty} x ${item.price}
											</p>
										</div>
										<div className="font-medium">
											$
											{(item.qty * item.price).toFixed(2)}
										</div>
									</div>
								))}
							</div>

							<div className="mt-4 pt-4 border-t border-gray-200">
								<div className="flex justify-between items-center">
									<div className="space-y-1">
										<p className="text-gray-500">
											Total:{" "}
											<span className="font-semibold">
												${order.totalPrice.toFixed(2)}
											</span>
										</p>
										<p className="text-sm text-gray-500">
											{order.orderItems.length} items
										</p>
									</div>
									<Link
										to={`/orders/${order._id}`}
										className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
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
	);
};

export default OrderList;
