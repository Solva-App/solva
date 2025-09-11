import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export interface GrantI {
  // name: string;
  // desc: string;
  link: string;
  id?: number;
  // description?: string;
}

export const useInnovation = () => {
  const [grants, setGrants] = useState<GrantI[]>([]);
  const [loading, setLoading] = useState(false);
  const axios = createAxiosInstance();
  const router = useRouter();
  const [openDeleteModal, setDeleteModal] = useState(false);

  const createGrant = async ({ link }: GrantI) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${apis.inno}/create`,
        {
          // name,
          // description: desc,
          link,
        },
      );

      if (response.status === 200) {
        toast.success("Innovations created successfully");
        setGrants((prev) => [...prev, {  link }]);
        router.replace("/innovation");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [editLoad, setEditLoad] = useState(false);

  const editGrant = async ({  link, id }: GrantI) => {
    if (!id) {
      toast.error("Innovation ID is required");
      return;
    }

    setEditLoad(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${apis.inno}/${id}`,
        {
          // name,
          // description: desc,
          link,
        },
      );

      if (response.status === 200) {
        toast.success("Innovation updated successfully");
        router.replace("/innovation");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setEditLoad(false);
    }
  };

  const [fetched, setFetched] = useState<GrantI[]>([]);
  const [loadFetch, setLoadFetch] = useState(true);
  const fetchInnovation = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${apis.inno}`, {
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
      const response = await axios.delete(`${apis.inno}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDelGrant(false);
        fetchInnovation();
        setDeleteModal(false)
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
    createGrant,
    loading,
    grants,
    editLoad,
    editGrant,
    loadFetch,
    fetched,
    fetchInnovation,
    delGrant,
    deleteGrant,
    setDeleteModal,
    openDeleteModal,
    router
  };
};
