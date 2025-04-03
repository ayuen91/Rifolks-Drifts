import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const Verify2FA = () => {
	const [code, setCode] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { data, error } = await supabase.auth.signInWithOtp({
				email: localStorage.getItem("email"),
				token: code,
				type: 'email',
			});

			if (error) {
				toast.error(error.message);
			} else {
				toast.success("Verification successful");
				navigate("/");
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Verify Two-Factor Authentication
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter the code sent to your email address.
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="code" className="sr-only">
								Verification Code
							</label>
							<input
								id="code"
								name="code"
								type="text"
								autoComplete="one-time-code"
								required
								value={code}
								onChange={(e) => setCode(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
								placeholder="Verification Code"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
						>
							Verify
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Verify2FA;