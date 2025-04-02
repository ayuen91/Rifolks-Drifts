"use client";

import { useState } from "react";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement form submission logic
		console.log("Form submitted:", formData);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
					<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
						<div>
							<h2 className="text-3xl font-bold tracking-tight text-gray-900">
								Get in Touch
							</h2>
							<p className="mt-4 leading-7 text-gray-600">
								Have questions about our products or services?
								We'd love to hear from you. Send us a message
								and we'll respond as soon as possible.
							</p>
							<dl className="mt-8 space-y-6 text-base leading-7 text-gray-600">
								<div>
									<dt className="font-semibold text-gray-900">
										Email
									</dt>
									<dd>
										<a
											className="hover:text-primary"
											href="mailto:contact@rifolksdrifts.com"
										>
											contact@rifolksdrifts.com
										</a>
									</dd>
								</div>
								<div>
									<dt className="font-semibold text-gray-900">
										Phone
									</dt>
									<dd>
										<a
											className="hover:text-primary"
											href="tel:+1234567890"
										>
											+1 (234) 567-890
										</a>
									</dd>
								</div>
								<div>
									<dt className="font-semibold text-gray-900">
										Address
									</dt>
									<dd>
										123 Drift Street
										<br />
										Speed City, SC 12345
										<br />
										United States
									</dd>
								</div>
							</dl>
						</div>
						<div className="lg:col-span-2">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-semibold leading-6 text-gray-900"
									>
										Name
									</label>
									<div className="mt-2.5">
										<input
											type="text"
											name="name"
											id="name"
											autoComplete="name"
											value={formData.name}
											onChange={handleChange}
											className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
											required
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-semibold leading-6 text-gray-900"
									>
										Email
									</label>
									<div className="mt-2.5">
										<input
											type="email"
											name="email"
											id="email"
											autoComplete="email"
											value={formData.email}
											onChange={handleChange}
											className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
											required
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-semibold leading-6 text-gray-900"
									>
										Phone
									</label>
									<div className="mt-2.5">
										<input
											type="tel"
											name="phone"
											id="phone"
											autoComplete="tel"
											value={formData.phone}
											onChange={handleChange}
											className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-semibold leading-6 text-gray-900"
									>
										Message
									</label>
									<div className="mt-2.5">
										<textarea
											name="message"
											id="message"
											rows={4}
											value={formData.message}
											onChange={handleChange}
											className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
											required
										/>
									</div>
								</div>
								<div>
									<button
										type="submit"
										className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
									>
										Send Message
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
