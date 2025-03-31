const Order = require("../models/Order");
const Product = require("../models/Product");
const { createError } = require("../utils/error");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
	try {
		const {
			orderItems,
			shippingAddress,
			itemsPrice,
			shippingPrice,
			totalPrice,
			specialInstructions,
		} = req.body;

		if (!orderItems || orderItems.length === 0) {
			return next(createError(400, "No order items"));
		}

		// Update product stock
		for (const item of orderItems) {
			const product = await Product.findById(item.product);
			if (product) {
				product.stock -= item.quantity;
				await product.save();
			}
		}

		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			itemsPrice,
			shippingPrice,
			totalPrice,
			specialInstructions,
			paymentStatus: "pending",
			deliveryStatus: "pending",
			orderStatus: "pending",
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	} catch (error) {
		next(error);
	}
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("user", "name email")
			.populate("orderItems.product", "name price image");

		if (!order) {
			return next(createError(404, "Order not found"));
		}

		res.json(order);
		if (order) {
			res.json(order);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isPaid = true;
			order.paidAt = Date.now();
			order.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.email_address,
			};

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isDelivered = true;
			order.deliveredAt = Date.now();
			order.status = "delivered";

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id }).populate(
			"orderItems.product",
			"name price image"
		);
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate("user", "username email")
			.populate("orderItems.product", "name price image");
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.status = req.body.status;
			if (req.body.status === "delivered") {
				order.isDelivered = true;
				order.deliveredAt = Date.now();
			}

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createOrder,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getOrders,
	updateOrderStatus,
};
