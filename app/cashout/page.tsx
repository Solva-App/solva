"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { useCashOut } from "./useCashout";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CashOut = () => {
  const { fetchCashOut, loading, cashOut, approveCashOut, declineCashOut } =
    useCashOut();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "decline" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCashOut();
  }, []);

  const openModal = (type: "approve" | "decline" , id: string) => {
    setModalType(type);
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalType === "approve" && selectedId) approveCashOut(selectedId);
    else if (modalType === "decline" && selectedId) declineCashOut(selectedId);
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-auto h-screen bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Cashout Requests
        </h1>
        <hr className="my-5 border-gray-300" />

        {loading ? (
          <p className="text-center text-gray-500 mt-5">Loading...</p>
        ) : cashOut.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">
            No cashout requests available
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm bg-white">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm sm:text-base">
                  <th className="px-3 py-3 text-left font-medium">Name</th>
                  <th className="px-3 py-3 text-center font-medium">Amount</th>
                  <th className="px-3 py-3 text-center font-medium">
                    Account No.
                  </th>
                  <th className="px-3 py-3 text-center font-medium">Bank</th>
                  <th className="px-3 py-3 text-center font-medium">Status</th>
                  <th className="px-3 py-3 text-center font-medium">Date</th>
                  <th className="px-3 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {cashOut.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-sm sm:text-base hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-3 font-medium capitalize">
                      {data.accountName}
                    </td>
                    <td className="px-3 py-3 text-center">{data.amount}</td>
                    <td className="px-3 py-3 text-center">
                      {data.accountNumber}
                    </td>
                    <td className="px-3 py-3 text-center">{data.bankName}</td>
                    <td
                      className={`px-3 py-3 text-center font-medium capitalize ${data.status === "awaiting-response"
                        ? "text-yellow-600"
                        : data.status === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {data.status}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {data.status === "awaiting-response" ? (
                        <button
                          onClick={() => openModal("approve", data.id)}
                          className="px-3 py-1 rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          disabled={data.status === "approved"}
                          onClick={() => openModal("decline", data.id)}
                          className="px-3 py-1 disabled:hidden rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                        >
                          Decline
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
          title={modalType === "approve" ? "Approve Cashout" : "Decline Cashout"}
          message={`Are you sure you want to ${modalType === "approve" ? "approve" : "decline"
            } this cashout request?`}
        />
      </div>
    </div>
  );
};

export default CashOut;
