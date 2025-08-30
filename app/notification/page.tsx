"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import Button from "@/components/button";
import { createAxiosInstance } from "@/lib/axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [openEditModal, setEditModal] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const axios = createAxiosInstance();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const res = await axios.get("/notification/admin/all");
      if (res.status === 200) setNotifications(res.data.data);
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAdd = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    try {
      setAddLoading(true);
      const token = Cookies.get("accessToken");
      await axios.post("/notification/broadcast", { title, message });
      toast.success("Notification added");
      setTitle("");
      setMessage("");
      fetchNotifications();
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to add notification");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedNotification) return;
    try {
      setEditLoading(true);
      const token = Cookies.get("accessToken");
      await axios.patch(`/notification/edit/${selectedNotification.id}`, { title, message });
      toast.success("Notification updated");
      setEditModal(false);
      setSelectedNotification(null);
      fetchNotifications();
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to update notification");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    try {
      setDeleteLoading(true);
      const token = Cookies.get("accessToken");
      await axios.delete(`/notification/delete/${selectedNotification.id}`);
      toast.success("Notification deleted");
      setDeleteModal(false);
      setSelectedNotification(null);
      fetchNotifications();
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete notification");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Notifications</h1>

        <div className="bg-white p-5 rounded-2xl shadow mb-8">
          <h2 className="font-medium text-lg mb-3">Add Notification</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-3 p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Message"
            className="w-full mb-3 p-2 border rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button BtnText={addLoading ? "Adding..." : "Add"} BtnFunction={handleAdd} />
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No notifications found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white p-4 rounded-xl shadow relative">
                <h3 className="font-bold text-lg">{notif.title}</h3>
                <p className="text-gray-600 mt-1">{notif.message}</p>
                <p className="text-gray-400 text-xs mt-2">{new Date(notif.createdAt).toLocaleString()}</p>

                <div className="absolute top-2 right-2 flex gap-2">
                  <RiEdit2Line
                    className="text-primary cursor-pointer"
                    onClick={() => {
                      setSelectedNotification(notif);
                      setTitle(notif.title);
                      setMessage(notif.message);
                      setEditModal(true);
                    }}
                  />
                  <RiDeleteBin6Line
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      setSelectedNotification(notif);
                      setDeleteModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <AnimatePresence>
          {openEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white p-5 rounded-2xl w-96 mx-2 shadow-lg"
              >
                <h2 className="font-bold text-xl mb-3">Edit Notification</h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full mb-3 p-2 border rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Message"
                  className="w-full mb-3 p-2 border rounded"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex gap-3 mt-3">
                  <button
                    className="w-full py-2 bg-gray-200 rounded"
                    onClick={() => setEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full py-2 bg-primary text-white rounded"
                    onClick={handleEdit}
                  >
                    {editLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {openDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white p-5 rounded-2xl w-96 mx-2 shadow-lg"
              >
                <h2 className="font-bold text-xl mb-3 text-center">Confirm Delete</h2>
                <p className="text-gray-600 text-center mb-4">
                  Are you sure you want to delete this notification? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    className="w-full py-2 bg-gray-200 rounded"
                    onClick={() => setDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full py-2 bg-red-600 text-white rounded"
                    onClick={handleDelete}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
