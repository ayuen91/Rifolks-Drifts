import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, saveShippingAddress } from "../store/slices/cartSlice";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import toast from "react-hot-toast";

const Cart = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cartItems, shippingAddress } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	const handleQuantityChange = (product, newQty) => {
		if (newQty > product.countInStock) {
			toast.error("Sorry, this product is out of stock");
			return;
		}
		dispatch(removeFromCart(product._id));
		dispatch(addToCart({ ...product, qty: newQty }));
	};

	const handleRemoveItem = (productId) => {
		dispatch(removeFromCart(productId));
		toast.success("Item removed from cart");
	};

	const handleCheckout = () => {
		if (!user) {
			navigate("/login?redirect=/checkout");
		} else {
			navigate("/checkout");
		}
	};

	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.qty,
		0
	);
	const shipping = subtotal > 100 ? 0 : 10;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

			{cartItems.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 mb-4">Your cart is empty</p>
					<button
						onClick={() => navigate("/products")}
						className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
					>
						Continue Shopping
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2">
						{cartItems.map((item) => (
							<div
								key={item._id}
								className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md mb-4"
							>
								<img
									src={item.image}
									alt={item.name}
									className="w-24 h-24 object-cover rounded-md"
								/>
								<div className="flex-1">
									<h3 className="font-semibold">
										{item.name}
									</h3>
									<p className="text-gray-600">
										${item.price}
									</p>
									<div className="flex items-center space-x-2 mt-2">
										<button
											onClick={() =>
												handleQuantityChange(
													item,
													item.qty - 1
												)
											}
											className="text-gray-500 hover:text-primary"
										>
											<FaMinus />
										</button>
										<span className="mx-2">{item.qty}</span>
										<button
											onClick={() =>
												handleQuantityChange(
													item,
													item.qty + 1
												)
											}
											className="text-gray-500 hover:text-primary"
										>
											<FaPlus />
										</button>
										<button
											onClick={() =>
												handleRemoveItem(item._id)
											}
											className="ml-4 text-red-500 hover:text-red-600"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Order Summary */}
					<div className="bg-white p-6 rounded-lg shadow-md h-fit">
						<h2 className="text-xl font-semibold mb-4">
							Order Summary
						</h2>
						<div className="space-y-2 mb-4">
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

						<button
							onClick={handleCheckout}
							className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors"
						>
							Proceed to Checkout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
