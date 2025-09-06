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

export const useGrants = () => {
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
        `${apis.grant}/create`,
        {
          // name,
          // description: desc,
          link,
        },
      );

      if (response.status === 200) {
        toast.success("Grant created successfully");
        setGrants((prev) => [...prev, {  link }]);
        router.replace("/grants");
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
      toast.error("Grant ID is required");
      return;
    }

    setEditLoad(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.patch(
        `${apis.grant}/${id}`,
        {
          // name,
          // description: desc,
          link,
        },
      );

      if (response.status === 200) {
        toast.success("Grant updated successfully");
        router.replace("/grants");
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
  const fetchGrants = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${apis.grant}`, {
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
      const response = await axios.delete(`${apis.grant}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDelGrant(false);
        fetchGrants();
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
    fetchGrants,
    delGrant,
    deleteGrant,
    setDeleteModal,
    openDeleteModal,
    router
  };
};
