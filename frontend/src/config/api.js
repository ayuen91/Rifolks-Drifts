const API_URL =
	process.env.REACT_APP_API_URL || "https://rifolks-drifts.railway.app/api";

export const endpoints = {
	auth: {
		login: `${API_URL}/auth/login`,
		register: `${API_URL}/auth/register`,
		logout: `${API_URL}/auth/logout`,
		refreshToken: `${API_URL}/auth/refresh-token`,
		forgotPassword: `${API_URL}/auth/forgot-password`,
		resetPassword: `${API_URL}/auth/reset-password`,
	},
	products: {
		list: `${API_URL}/products`,
		detail: (id) => `${API_URL}/products/${id}`,
		create: `${API_URL}/products`,
		update: (id) => `${API_URL}/products/${id}`,
		delete: (id) => `${API_URL}/products/${id}`,
	},
	orders: {
		list: `${API_URL}/orders`,
		detail: (id) => `${API_URL}/orders/${id}`,
		create: `${API_URL}/orders`,
		update: (id) => `${API_URL}/orders/${id}`,
		cancel: (id) => `${API_URL}/orders/${id}/cancel`,
	},
	cod: {
		list: `${API_URL}/cod/orders`,
		detail: (id) => `${API_URL}/cod/orders/${id}`,
		updateStatus: (id) => `${API_URL}/cod/orders/${id}/status`,
		recordPayment: (id) => `${API_URL}/cod/orders/${id}/payment`,
		createReturn: (id) => `${API_URL}/cod/orders/${id}/return`,
	},
	profile: {
		get: `${API_URL}/profile`,
		update: `${API_URL}/profile`,
		changePassword: `${API_URL}/profile/change-password`,
	},
};

export const headers = {
	"Content-Type": "application/json",
};

export const getAuthHeaders = (token) => ({
	...headers,
	Authorization: `Bearer ${token}`,
});
