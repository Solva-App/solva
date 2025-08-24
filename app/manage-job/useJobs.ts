import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export interface JobI {
  title: string;
  desc: string;
  status: string;
  id?: number;
  description?: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<JobI[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const axios = createAxiosInstance();
  const router = useRouter();

  const createJob = async ({ title, desc, status }: JobI) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${apis.job}/create`,
        {
          title,
          description: desc,
          status: [status],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Job created successfully");
        setJobs((prev) => [...prev, { title, desc, status }]);
        router.replace("/manage-job");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [fetched, setFetched] = useState<JobI[]>([]);
  const [loadFetch, setLoadFetch] = useState(true);
  const fetchJob = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${apis.job}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFetched(response.data.data);
        setLoadFetch(false);
        // toast.success("Users fetched Successfully");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadFetch(false);
    }
  };

  const [editLoad, setEditLoad] = useState(false);
  const editJob = async ({ title, desc, status, id }: JobI) => {
    setEditLoad(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${apis.job}/${id}`,
        {
          title,
          description: desc,
          status: [status],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Job edited successfully");
        // setJobs((prev) => [...prev, { title, desc, status }]);
        router.replace("/manage-job");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setEditLoad(false);
    }
  };

  const [delGrant, setDelGrant] = useState(false);

  const deleteJob = async (id: string) => {
    try {
      setDelGrant(true);
      const token = Cookies.get("accessToken");
      const response = await axios.delete(`${apis.job}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDelGrant(false);
        fetchJob();
        setDeleteModal(false);
        // router.replace("/grants");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setDelGrant(false);
    }
  };

  return {
    createJob,
    loading,
    jobs,
    editLoad,
    editJob,
    fetched,
    loadFetch,
    fetchJob,
    deleteJob,
    setDeleteModal,
    openDeleteModal,
    delGrant
  };
};
