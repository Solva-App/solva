import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export interface CashOutI {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  status: "awaiting-response" | "approved" | "declined";
  createdAt: string;
}

export const useCashOut = () => {
  const [cashOut, setCashOut] = useState<CashOutI[]>([]);
  const [loading, setLoading] = useState(true);
  const axios = createAxiosInstance();

  const fetchCashOut = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${apis.cash}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCashOut(response.data.data);
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const approveCashOut = async (id: string) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${apis.cash}/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Cashout approved");
        fetchCashOut(); // refresh list
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const declineCashOut = async (id: string) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${apis.cash}/decline/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Cashout declined");
        fetchCashOut();
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to decline");
    }
  };

  return {
    fetchCashOut,
    approveCashOut,
    declineCashOut,
    loading,
    cashOut,
  };
};
