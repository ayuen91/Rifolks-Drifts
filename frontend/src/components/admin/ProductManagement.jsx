import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../store/slices/productSlice"; // Assuming you have a productSlice

const ProductManagement = () => {
	const dispatch = useDispatch();
	// const { items: products, loading, error } = useSelector((state) => state.products); // Assuming you have a products slice

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [editingProductId, setEditingProductId] = useState(null);

	useEffect(() => {
		// dispatch(fetchProducts());
	}, [dispatch]);

	const handleCreateProduct = async () => {
		try {
			// await dispatch(createProduct({ name, description, price, category, image })).unwrap();
			toast.success("Product created successfully");
			clearForm();
		} catch (error) {
			toast.error(error.message || "Failed to create product");
		}
	};

	const handleUpdateProduct = async () => {
		try {
			// await dispatch(updateProduct({ id: editingProductId, name, description, price, category, image })).unwrap();
			toast.success("Product updated successfully");
			clearForm();
			setIsEditing(false);
			setEditingProductId(null);
		} catch (error) {
			toast.error(error.message || "Failed to update product");
		}
	};

	const handleDeleteProduct = async (productId) => {
		try {
			// await dispatch(deleteProduct(productId)).unwrap();
			toast.success("Product deleted successfully");
		} catch (error) {
			toast.error(error.message || "Failed to delete product");
		}
	};

	const handleEditProduct = (product) => {
		setIsEditing(true);
		setEditingProductId(product.id);
		setName(product.name);
		setDescription(product.description);
		setPrice(product.price);
		setCategory(product.category);
		setImage(product.image);
	};

	const clearForm = () => {
		setName("");
		setDescription("");
		setPrice("");
		setCategory("");
		setImage("");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Product Management</h1>

			{/* Product Form */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-semibold mb-4">
					{isEditing ? "Edit Product" : "Create Product"}
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Price
						</label>
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Category
						</label>
						<input
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Image URL
						</label>
						<input
							type="text"
							value={image}
							onChange={(e) => setImage(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
				</div>
				<div className="mt-6 flex justify-end">
					<button
						onClick={isEditing ? handleUpdateProduct : handleCreateProduct}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
					>
						{isEditing ? "Update Product" : "Create Product"}
					</button>
				</div>
			</div>

			{/* Product List */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">Product List</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Price
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
						<tr><td>Product list</td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProductManagement;