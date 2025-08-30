import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export interface scholaI {
  name: string;
  desc: string;
  link: string;
  id?: number;
  description?: string;
}

export const useScholar = () => {
  const [scholar, setScholar] = useState<scholaI[]>([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const axios = createAxiosInstance();
  const router = useRouter();

  const createScholar = async ({ name, desc, link }: scholaI) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${apis.scholar}/create`,
        {
          name,
          description: desc,
          link,
        },
       
      );

      if (response.status === 200) {
        toast.success("Scholarship created successfully");
        setScholar((prev) => [...prev, { name, desc, link }]);
        router.replace("/scholarships");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [editLoad, setEditLoad] = useState(false);
  const editScholar = async ({ name, desc, link, id }: scholaI) => {
    setEditLoad(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${apis.scholar}/${id}`,
        {
          name,
          description: desc,
          link,
        },
       
      );

      if (response.status === 200) {
        toast.success("Scholarship edited successfully");
        // setScholar((prev) => [...prev, { name, desc, link }]);
        router.replace("/scholarships");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setEditLoad(false);
    }
  };

  const [fetched, setFetched] = useState<scholaI[]>([]);
  const [loadFetch, setLoadFetch] = useState(true);
  const fetchScholar = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${apis.scholar}`, {
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


  const [delGrant, setDelGrant] = useState(false);

  const deleteGrant = async (id: string) => {
    try {
      setDelGrant(true);
      const token = Cookies.get("accessToken");
      const response = await axios.delete(`${apis.scholar}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDelGrant(false);
        fetchScholar();
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
    createScholar,
    loading,
    scholar,
    editLoad,
    editScholar,
    fetchScholar,
    loadFetch,
    fetched,
    delGrant,
    deleteGrant,
    setDeleteModal,
    openDeleteModal,
    router,
  };
};
