import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} from "../../store/slices/staffSlice";

const UserManagement = () => {
	const dispatch = useDispatch();
	const { items: users, loading, error } = useSelector((state) => state.staff);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("customer");
	const [isEditing, setIsEditing] = useState(false);
	const [editingUserId, setEditingUserId] = useState(null);

  const fetchStaff = useCallback(() => {
    dispatch(getUsers());
  }, [dispatch]);

	useEffect(() => {
    fetchStaff();
	}, [dispatch, fetchStaff]);

	const handleCreateUser = async () => {
		try {
			await dispatch(createUser({ name, email, password, role })).unwrap();
			toast.success("User created successfully");
			clearForm();
		} catch (error) {
			toast.error(error.message || "Failed to create user");
		}
	};

	const handleUpdateUser = async () => {
		try {
			await dispatch(updateUser({ id: editingUserId, name, email, password, role })).unwrap();
			toast.success("User updated successfully");
			clearForm();
			setIsEditing(false);
			setEditingUserId(null);
		} catch (error) {
			toast.error(error.message || "Failed to update user");
		}
	};

	const handleDeleteUser = async (userId) => {
		try {
			await dispatch(deleteUser(userId)).unwrap();
			toast.success("User deleted successfully");
		} catch (error) {
			toast.error(error.message || "Failed to delete user");
		}
	};

	const handleEditUser = (user) => {
		setIsEditing(true);
		setEditingUserId(user.id);
		setName(user.name);
		setEmail(user.email);
		setRole(user.role);
	};

	const clearForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setRole("customer");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">User Management</h1>

			{/* User Form */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-semibold mb-4">
					{isEditing ? "Edit User" : "Create User"}
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
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Role
						</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						>
							<option value="customer">Customer</option>
							<option value="employee">Employee</option>
							<option value="delivery">Delivery</option>
							<option value="admin">Admin</option>
						</select>
					</div>
				</div>
				<div className="mt-6 flex justify-end">
					<button
						onClick={isEditing ? handleUpdateUser : handleCreateUser}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
					>
						{isEditing ? "Update User" : "Create User"}
					</button>
				</div>
			</div>

			{/* User List */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">User List</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Email
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Role
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
						<tr><td>User list</td></tr>
						 </tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default UserManagement;