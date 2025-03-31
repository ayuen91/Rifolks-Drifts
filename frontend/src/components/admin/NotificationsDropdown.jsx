import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, isToday, isYesterday } from "date-fns";
import { markNotificationAsRead } from "../../store/slices/notificationSlice";

const NotificationsDropdown = ({ onClose }) => {
	const dropdownRef = useRef(null);
	const dispatch = useDispatch();
	const { notifications } = useSelector((state) => state.notifications);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	const groupNotificationsByDate = () => {
		const groups = {};

		notifications.forEach((notification) => {
			const date = new Date(notification.createdAt);
			let key;

			if (isToday(date)) {
				const hours = date.getHours();
				key = `Today ${hours}:00`;
			} else if (isYesterday(date)) {
				key = "Yesterday";
			} else {
				key = format(date, "MMM d, yyyy");
			}

			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(notification);
		});

		return groups;
	};

	const handleNotificationClick = (notification) => {
		if (!notification.read) {
			dispatch(markNotificationAsRead(notification.id));
		}
	};

	const groupedNotifications = groupNotificationsByDate();

	return (
		<div
			ref={dropdownRef}
			className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
		>
			<div className="max-h-[32rem] overflow-y-auto">
				{Object.entries(groupedNotifications).map(
					([date, notifications]) => (
						<div key={date}>
							<div className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-2">
								<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
									{date}
								</h3>
							</div>
							<div className="divide-y divide-gray-200 dark:divide-gray-700">
								{notifications.map((notification) => (
									<button
										key={notification.id}
										onClick={() =>
											handleNotificationClick(
												notification
											)
										}
										className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
											!notification.read
												? "bg-blue-50 dark:bg-blue-900/20"
												: ""
										}`}
									>
										<div className="flex items-start">
											<div className="flex-1 space-y-1">
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{notification.title}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{notification.message}
												</p>
												<p className="text-xs text-gray-400 dark:text-gray-500">
													{format(
														new Date(
															notification.createdAt
														),
														"h:mm a"
													)}
												</p>
											</div>
											{!notification.read && (
												<span className="w-2 h-2 bg-accent rounded-full" />
											)}
										</div>
									</button>
								))}
							</div>
						</div>
					)
				)}

				{notifications.length === 0 && (
					<div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
						No notifications
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationsDropdown;
