"use client";
import { useState } from "react";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface CoursePayload {
  title: string;
  department: string;
  university: string;
  courseCode: string;
  faculty: string;
  documents: File[];
}

export function useCourses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const axios = createAxiosInstance();
  const router = useRouter();

  const createCourse = async (payload: CoursePayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("department", payload.department);
      formData.append("university", payload.university);
      formData.append("courseCode", payload.courseCode);
      formData.append("faculty", payload.faculty);

      payload.documents.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await axios.post(`${apis.past}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success("Past Question created successfully");
        setSuccess(true);
        router.replace("/courses");
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCourse,
    loading,
    error,
    success,
  };
}
