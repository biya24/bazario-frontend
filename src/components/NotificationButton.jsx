import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationButton = ({ vendorId }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo || !userInfo.token) {
                throw new Error("User not authenticated");
            }

            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`https://bazario-backend-iqac.onrender.com/api/notifications/${vendorId}`, config);
            
            console.log("API Response:", data); // Debugging log

            // Ensure notifications are an array
            if (Array.isArray(data)) {
                setNotifications(data);
            } else {
                setNotifications([]); // Set empty array if response is not valid
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]); // Prevent map error
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/mark-read/${id}`);
            setNotifications(notifications.filter((notif) => notif._id !== id));
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    return (
        <div className="relative">
            <button
                className="p-2 bg-blue-600 text-white rounded"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                🔔 {notifications.length > 0 && <span>({notifications.length})</span>}
            </button>

            {showDropdown && (
                <div className="absolute right-0 bg-white shadow-lg p-4 w-64 border">
                    {notifications.length === 0 ? (
                        <p>No new notifications</p>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif._id} className="p-2 border-b flex justify-between">
                                <span>{notif.message}</span>
                                <button onClick={() => markAsRead(notif._id)}>✔</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationButton;
