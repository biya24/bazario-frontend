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

    const markNotificationAsRead = async (notificationId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo || !userInfo.token) {
                throw new Error("User not authenticated");
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
    
            await axios.put(
                `https://bazario-backend-iqac.onrender.com/api/notifications/mark-read/${notificationId}`,
                {}, // Sending an empty body
                config
            );
    
            // Refresh notifications after marking as read
            fetchNotifications();
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };
    

    return (
        <div>
            <h4>Notifications</h4>
            {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div key={notif._id} className="notification-item">
                        <p>{notif.message}</p>
                        {!notif.isRead && (
                            <button onClick={() => markNotificationAsRead(notif._id)}>
                                Mark as Read
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No new notifications.</p>
            )}
        </div>
    );
    
};

export default NotificationButton;
