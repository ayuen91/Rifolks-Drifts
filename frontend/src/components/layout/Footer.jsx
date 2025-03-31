import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* About Section */}
					<div>
						<h3 className="text-xl font-bold mb-4">
							RiFolks Drifts
						</h3>
						<p className="text-gray-400">
							Your one-stop shop for the latest fashion trends and
							styles. We offer high-quality clothing and
							accessories for everyone.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-xl font-bold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/products"
									className="text-gray-400 hover:text-white"
								>
									Products
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-400 hover:text-white"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-400 hover:text-white"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-gray-400 hover:text-white"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Customer Service */}
					<div>
						<h3 className="text-xl font-bold mb-4">
							Customer Service
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/shipping"
									className="text-gray-400 hover:text-white"
								>
									Shipping Information
								</Link>
							</li>
							<li>
								<Link
									to="/returns"
									className="text-gray-400 hover:text-white"
								>
									Returns & Exchanges
								</Link>
							</li>
							<li>
								<Link
									to="/privacy"
									className="text-gray-400 hover:text-white"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="text-gray-400 hover:text-white"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className="text-xl font-bold mb-4">Newsletter</h3>
						<p className="text-gray-400 mb-4">
							Subscribe to our newsletter for updates and
							exclusive offers.
						</p>
						<form className="flex">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<button
								type="submit"
								className="bg-primary px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Social Links */}
				<div className="mt-8 pt-8 border-t border-gray-800">
					<div className="flex justify-center space-x-6">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white"
						>
							<FaFacebook size={24} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white"
						>
							<FaTwitter size={24} />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white"
						>
							<FaInstagram size={24} />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white"
						>
							<FaLinkedin size={24} />
						</a>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 text-center text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} RiFolks Drifts. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
