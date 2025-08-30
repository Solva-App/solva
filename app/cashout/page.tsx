"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useCashOut } from "./useCashout";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-3">{title}</h2>
        <p className="mb-5 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-[#5427D7] text-white hover:bg-[#3d1da3]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
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

  const openModal = (type: "approve" | "decline", id: string) => {
    setModalType(type);
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalType === "approve" && selectedId) {
      approveCashOut(selectedId);
    } else if (modalType === "decline" && selectedId) {
      declineCashOut(selectedId);
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <h1 className="text-2xl sm:text-3xl text-center font-bold">
          Cashout requests
        </h1>
        <hr className="my-5" />

        {loading ? (
          <p className="text-center mt-5">Loading...</p>
        ) : cashOut.length === 0 ? (
          <p className="text-center mt-5">No cashout requests available</p>
        ) : (
          <div className="overflow-x-scroll">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-[#E1E2E180]">
                  <td className="px-3 py-4 text-sm sm:text-base font-medium text-[#5C5F62] rounded-tl-[8px]">
                    Name
                  </td>
                  <td className="px-2 py-4 text-sm sm:text-base font-medium text-[#5C5F62] text-center">
                    Amount
                  </td>
                  <td className="px-2 py-4 text-sm sm:text-base font-medium text-[#5C5F62] text-center">
                    Account No.
                  </td>
                  <td className="px-2 py-4 text-sm sm:text-base font-medium text-[#5C5F62] text-center">
                    Bank
                  </td>
                  <td className="px-2 py-4 text-sm sm:text-base font-medium text-[#5C5F62] text-center">
                    Status
                  </td>
                  <td className="px-2 py-4 text-sm sm:text-base font-medium text-[#5C5F62] text-center">
                    Date
                  </td>
                  <td className="py-4 pr-3 text-sm sm:text-base font-medium text-[#5C5F62] rounded-tr-[8px] text-center">
                    Action
                  </td>
                </tr>
              </thead>
              <tbody>
                {cashOut.map((data, index) => (
                  <tr key={index} className="border border-[#D9D9D9]">
                    <td className="px-2 py-4 font-medium text-sm sm:text-base capitalize">
                      {data.accountName}
                    </td>
                    <td className="px-2 py-4 text-center">{data.amount}</td>
                    <td className="px-2 py-4 text-center">{data.accountNumber}</td>
                    <td className="px-2 py-4 text-center">{data.bankName}</td>
                    <td className="px-2 py-4 text-center capitalize">
                      {data.status}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {data.status === "awaiting-response" ? (
                        <button className="bg-[#42832C] text-white p-2 rounded-sm text-sm cursor-pointer"
                          onClick={() => openModal("approve", data.id)}>
                          Approve
                        </button>
                      ) : (
                        <button className="bg-[#FF1212] text-white p-2 rounded-sm text-sm cursor-pointer"
                          onClick={() => openModal("decline", data.id)}>
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
          title={
            modalType === "approve"
              ? "Approve Cashout"
              : "Decline Cashout"
          }
          message={`Are you sure you want to ${modalType === "approve" ? "approve" : "decline"
            } this cashout request?`}
        />
      </div>
    </div>
  );
};

export default CashOut;
