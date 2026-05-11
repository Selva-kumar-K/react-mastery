import { useState, useEffect } from "react";

type Notification = {
  id: number;
  message: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const count = notifications.length;

  // Bug 1 — auto-clear after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return; // don't set timer if no notifications
    const timer = setTimeout(() => {
      setNotifications([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications.length]);

  const addNotification = () => {
    const newNotif: Notification = {
      id: Date.now(),
      message: `Notification #${count + 1}`,
    };
    setNotifications((prev) => [...prev, newNotif]);
  };

  // Bug 2 — remove one notification
  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      <button onClick={addNotification}>Add notification ({count})</button>

      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            {n.message}
            <button onClick={() => dismiss(n.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
