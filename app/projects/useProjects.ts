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
  mimetype: string;
  size: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  modelId: number;
  owner: number;
  requiresApproval: boolean;
}

export interface ProjectType {
  id: number;
  name: string;
  description: string;
  owner: number;
  createdAt: string;
  updatedAt: string;
  documents: DocumentType[];
  status?: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const axios = createAxiosInstance();

  const getProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apis.project}/admin/all`);
      if (res.status === 200) {
        const mapped: ProjectType[] = res.data.data.map((item: any) => ({
          ...item.project,
          documents: item.document,
        }));
        setProjects(mapped);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      // toast.error(error.response?.data?.message || "Failed to fetch projects");
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [approvingId, setApprovingId] = useState<number | null>(null);
  const approveProject = async (project: any) => {
    setApprovingId(project.id); 
    const body = {
      name: project.name,
      description: project.description,
    };

    try {
      const res = await axios.patch(`${apis.project}/approve/${project.id}`, body);

      if (res.status === 200) {
        toast.success("Project approved");
        getProjects(); 
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to approve");
    } finally {
      setApprovingId(null);
    }
  };



  const declineProject = async (id: number) => {
    setActionLoading(id);
    try {
      await axios.patch(`${apis.project}/decline/${id}`);
      toast.success("Project declined");
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "declined" } : p))
      );
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to decline");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProject = async (id: number) => {
    setActionLoading(id);
    try {
      await axios.delete(`${apis.project}/${id}`);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return {
    projects,
    loading,
    actionLoading,
    error,
    getProjects,
    approveProject,
    declineProject,
    deleteProject,
    approvingId
  };
}
