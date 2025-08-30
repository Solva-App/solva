"use client";
import { useState, useEffect } from "react";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export interface DocumentType {
  id: number;
  name: string;
  url: string;
  status: string;
  mimetype: string;
  size: number;
  model: string;
  modelId: number;
  owner: number;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionType {
  id: number;
  owner: number;
  title: string;
  university: string;
  faculty: string;
  department: string;
  courseCode: string;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseType {
  question: QuestionType;
  id: number;
  title: string;
  courseCode: string;
  department: string;
  faculty: string;
  university: string;
  owner: number;
  createdAt: string;
  updatedAt: string;
  requiresApproval: boolean;
  status?: string;
  document?: DocumentType[];
}

export function useCourses() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = createAxiosInstance();

  const getCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apis.past}/admin/all`);
      if (res.status === 200) {
        setCourses(res.data.data);
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to fetch courses");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (course: CourseType) => {
    const body = {
      title: course.question.title,
      department: course.question.department,
      university: course.question.university,
      courseCode: course.question.courseCode,
      faculty: course.question.faculty,
    };

    console.log(course, "courses docs")

    try {
      const res = await axios.patch(`${apis.past}/approve/${course.question.id}`, body);

      if (res.status === 200) {
        toast.success("Course approved");
        getCourses()
      }

    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;

      toast.error(error.response?.data?.message || "Failed to approve");
    }
  };

  const declineCourse = async (id: number) => {
    try {
      const res = await axios.patch(`${apis.past}/decline/${id}`);
      if (res.status === 200) {
        toast.success("Course declined");

        getCourses()
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      if (error?.response?.data?.message === "No documents awaiting approval for this question.") {
        toast.error("Can't perform this action on this course because it has already been disapproved")
      } else {
        toast.error(error.response?.data?.message || "Failed to decline");
      }
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      const res = await axios.delete(`${apis.past}/${id}`);
      if (res.status === 200) {
        toast.success("Course deleted");
        setCourses((prev) => prev.filter((c) => c.id !== id));
        getCourses()
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    getCourses,
    approveCourse,
    declineCourse,
    deleteCourse,
  };
}
