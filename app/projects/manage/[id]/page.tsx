"use client";
import SideNav from "@/components/sideNav";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdFileUpload, MdDelete } from "react-icons/md";
import { Loader2 } from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string;
  uploadedToUser: boolean;
};

type Document = {
  uploadedToUser: any;
  id: number;
  name: string;
  url: string;
  mimetype: string;
  size: number;
  status: string;
};

const ManageProject = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const axios = createAxiosInstance();

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"upload" | "delete" | null>(
    null
  );
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  // Form fields for upload
  const [uploadName, setUploadName] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");

  // Loading states
  const [approvingDocId, setApprovingDocId] = useState<number | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);

  const getAProject = async (id: any) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apis.project}/${id}`);
      if (res.status === 200) {
        const { project, documents } = res.data.data;
        setProject(project);
        setDocuments(documents);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteADoc = async (docId: number) => {
    setDeletingDocId(docId);
    try {
      const res = await axios.delete(`${apis.docs}/${docId}`);
      if (res.status === 200) {
        toast.success("Document deleted successfully");
        router.back();
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to delete document");
    } finally {
      setDeletingDocId(null);
    }
  };

  const uploadADoc = async (docId: number) => {
    if (!uploadName || !uploadDesc) {
      toast.error("Please fill in all fields");
      return;
    }
    setApprovingDocId(docId);
    try {
      const res = await axios.patch(`${apis.docs}/send/${docId}`, {
        name: uploadName,
        description: uploadDesc,
      });
      if (res.status === 200) {
        toast.success("Document uploaded to user successfully");
        getAProject(params?.id);
        setModalOpen(false);
        setUploadName("");
        setUploadDesc("");
        router.back();
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setApprovingDocId(null);
    }
  };

  useEffect(() => {
    getAProject(params?.id);
  }, []);

  return (
    <div className="flex relative">
      <SideNav />
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">Manage Project</h1>

        {loading ? (
          <p>Loading...</p>
        ) : project ? (
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">Documents</h3>
              {documents.length > 0 ? (
                <ul className="space-y-2">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex justify-between items-center border p-2 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.mimetype} • {(doc.size / 1024).toFixed(1)} KB •{" "}
                          {doc.uploadedToUser ? "uploaded" : "not uploaded"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs cursor-pointer underline"
                        >
                          View
                        </a>
                        <button
                          onClick={() => {
                            setActionType("upload");
                            setSelectedDocId(doc.id);
                            setModalOpen(true);
                          }}
                          disabled={approvingDocId === doc.id}
                        >
                          <MdFileUpload
                            className={`text-green-500 ${
                              doc.uploadedToUser ? "hidden" : ""
                            } cursor-pointer`}
                            size={16}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setActionType("delete");
                            setSelectedDocId(doc.id);
                            setModalOpen(true);
                          }}
                          disabled={deletingDocId === doc.id}
                        >
                          <MdDelete
                            className="text-red-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No documents available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>No project found.</p>
        )}
        {modalOpen && actionType === "upload" && selectedDocId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    disabled={approvingDocId === selectedDocId}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    disabled={approvingDocId === selectedDocId}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                  onClick={() => setModalOpen(false)}
                  disabled={approvingDocId === selectedDocId}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/70 disabled:opacity-50 flex items-center gap-2"
                  onClick={() => uploadADoc(selectedDocId)}
                  disabled={approvingDocId === selectedDocId}
                >
                  {approvingDocId === selectedDocId ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && actionType === "delete" && selectedDocId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Delete Document</h2>
              <p className="mb-6 text-gray-700">
                Do you really want to delete this document?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  onClick={() => deleteADoc(selectedDocId)}
                  disabled={deletingDocId === selectedDocId}
                >
                  {deletingDocId === selectedDocId ? (
                    <Loader2 className="animate-spin inline" size={16} />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProject;
