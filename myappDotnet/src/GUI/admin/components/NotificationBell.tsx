import { Stomp } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { getAllNotificationByUser, markAsSeenNotification } from '../../../api/NotificationApi';
import { Notification } from '../../../models/Notification';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';



function NotificationBell() {
    // const [notifications, setNotifications] = useState<Notification[]>([]);
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const navigate = useNavigate();

    // useEffect(() => {

    //     fetchNotification();

    //     const socket = new SockJS(process.env.REACT_APP_API_ENDPOINT + "ws");
    //     const stompClient = Stomp.over(socket);

    //     stompClient.connect({}, function (frame: any) {
    //         console.log('Connected: ' + frame);
    //         stompClient.subscribe('/user/admin/queue/notification', function (notification) {
    //             const newNotification = JSON.parse(notification.body);
    //             setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    //         });
    //     });

    //     return () => {
    //         if (stompClient !== null) {
    //             stompClient.disconnect();
    //         }
    //         console.log("Disconnected");
    //     };
    // }, []);

    // const fetchNotification = async () => {
    //     const response = await getAllNotificationByUser();
    //     setNotifications(response.result)
    // }

    // const toggleDropdown = () => {
    //     setIsDropdownOpen(!isDropdownOpen);
    // };

    // const markAsSeen = async (notificationId: number, index: number) => {
    //     const response = await markAsSeenNotification(notificationId);
    //     if (response.code === 1000) {
    //         setNotifications(prevNotifications => {
    //             const newNotifications = [...prevNotifications];
    //             newNotifications[index].seen = true;
    //             return newNotifications;
    //         });
    //     }
    // };



    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ cursor: 'pointer', position: 'relative' }}>
                <i style={{ fontSize: "1.5em", color: "#81c408" }} className="bi bi-bell"></i>

                <span className="badge bg-primary badge-number">

                </span>

            </div>
            {/* {isDropdownOpen && ( 
            <div style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                width: '310px',
                maxHeight: '400px',
                overflowY: 'auto'
            }}>
                {notifications.length === 0 ? (
                    <p style={{ padding: '10px' }}>No notifications</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                        <li style={{ padding: "15px" }} className="dropdown-header">
                            <strong> You have 4 new notifications</strong>
                            <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                        </li>
                        <hr className="dropdown-divider" />

                        {notifications.map((notification, index) => (
                            <li key={notification.id}
                                onClick={() => markAsSeen(notification.id, index)}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: notification.seen ? 'white' : '#f0f0f0',
                                    cursor: 'pointer'
                                }}>
                                {notification.content.startsWith('Your order') ?
                                    <Link to={notification?.linkUrl}>{notification.content}</Link>
                                    :
                                    notification.content
                                }
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
        }
        */}
        </div >
    );
}

export default NotificationBell;
