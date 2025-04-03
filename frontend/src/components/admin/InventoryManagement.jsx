import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	getInventory,
	updateInventory,
} from "../../store/slices/inventorySlice";

const InventoryManagement = () => {
	const dispatch = useDispatch();
	 const { items: inventory, loading, error } = useSelector((state) => state.inventory);

	const [productId, setProductId] = useState("");
	const [stockLevel, setStockLevel] = useState("");

	useEffect(() => {
		dispatch(getInventory());
	}, [dispatch]);

	const handleUpdateInventory = async () => {
		try {
			await dispatch(updateInventory({ productId, stockLevel })).unwrap();
			toast.success("Inventory updated successfully");
			clearForm();
		} catch (error) {
			toast.error(error.message || "Failed to update inventory");
		}
	};

	const clearForm = () => {
		setProductId("");
		setStockLevel("");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

			{/* Inventory Form */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-semibold mb-4">Update Inventory</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Product ID
						</label>
						<input
							type="text"
							value={productId}
							onChange={(e) => setProductId(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Stock Level
						</label>
						<input
							type="number"
							value={stockLevel}
							onChange={(e) => setStockLevel(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
				</div>
				<div className="mt-6 flex justify-end">
					<button
						onClick={handleUpdateInventory}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
					>
						Update Inventory
					</button>
				</div>
			</div>

			{/* Inventory List */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">Inventory List</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Product ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Stock Level
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							<tr><td>Inventory list</td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default InventoryManagement;