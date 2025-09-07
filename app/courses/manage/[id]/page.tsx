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
import { faculties, universities } from "@/data/userData";

type Question = {
  id: number;
  title: string;
  university: string;
  faculty: string;
  department: string;
  courseCode: string;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
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

const ManagePQ = () => {
  const params = useParams();
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const axios = createAxiosInstance();

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"upload" | "delete" | null>(
    null
  );
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // per-document loading states
  const [approvingDocId, setApprovingDocId] = useState<number | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);

  // form states for upload
  const [title, setTitle] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const resetForm = () => {
    setTitle("");
    setSelectedUniversity("");
    setSelectedFaculty("");
    setSelectedDepartment("");
    setCourseCode("");
  };

  const getAQuestion = async (id: any) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apis.past}/${id}`);
      if (res.status === 200) {
        const { question, documents } = res.data.data;
        setQuestion(question);
        setDocuments(documents);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message || "Failed to fetch past question"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId: number) => {
    setDeletingDocId(docId);
    try {
      const res = await axios.delete(`${apis.docs}/${docId}`);
      if (res.status === 200) {
        toast.success("Document deleted successfully");
        // getAQuestion(params?.id);
        router.back();
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to delete document");
    } finally {
      setDeletingDocId(null);
    }
  };

  const uploadDocument = async (docId: number) => {
    if (
      title === "" ||
      selectedUniversity === "" ||
      selectedFaculty === "" ||
      selectedDepartment === "" ||
      courseCode === ""
    ) {
      toast.error("Ensure that fields are filled");
      return;
    }

    setApprovingDocId(docId);

    try {
      const res = await axios.patch(`${apis.docs}/send/${docId}`, {
        title,
        university: selectedUniversity,
        faculty: selectedFaculty,
        department: selectedDepartment,
        courseCode,
      });

      if (res.status === 200) {
        toast.success("Document uploaded to user successfully");
        // getAQuestion(params?.id);
        router.back();
        resetForm();
      }
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setApprovingDocId(null);
    }
  };

  const handleConfirm = () => {
    if (!selectedDoc || !actionType) return;
    if (actionType === "delete") {
      deleteDocument(selectedDoc.id);
    }
    setModalOpen(false);
    setActionType(null);
    setSelectedDoc(null);
  };

  useEffect(() => {
    getAQuestion(params?.id);
  }, []);

  return (
    <div className="flex relative">
      <SideNav />
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-5">Manage Past Question</h1>

        {loading ? (
          <p>Loading...</p>
        ) : question ? (
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
                      <div className="flex items-center gap-2">
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
                            setSelectedDoc(doc);
                            setModalOpen(true);
                          }}
                          disabled={approvingDocId === doc.id}
                        >
                          {approvingDocId === doc.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                              color="#16a34a"
                            />
                          ) : (
                            <MdFileUpload
                              className={`text-green-500 ${
                                doc.uploadedToUser ? "hidden" : ""
                              } cursor-pointer`}
                              size={16}
                            />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setActionType("delete");
                            setSelectedDoc(doc);
                            setModalOpen(true);
                          }}
                          disabled={deletingDocId === doc.id}
                        >
                          {deletingDocId === doc.id ? (
                            <Loader2 size={16} color="#dc2626" />
                          ) : (
                            <MdDelete
                              className="text-red-500 cursor-pointer"
                              size={16}
                            />
                          )}
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
          <p>No past question found.</p>
        )}
        {modalOpen && actionType === "delete" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
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
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                  onClick={handleConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && actionType === "upload" && selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-lg max-h-[90%] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  uploadDocument(selectedDoc.id);
                  setModalOpen(false);
                }}
                className="flex flex-col gap-4"
              >
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2"
                    placeholder="e.g. Introduction to Artificial Intelligence"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* University */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    University
                  </label>
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    required
                  >
                    <option value="">Select University</option>
                    {universities.map((uni, idx) => (
                      <option key={idx} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Faculty */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">Faculty</label>
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    required
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((f, idx) => (
                      <option key={idx} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {faculties
                      .find((f) => f.name === selectedFaculty)
                      ?.departments.map((dept, idx) => (
                        <option key={idx} value={dept}>
                          {dept}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    Course Code
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2"
                    placeholder="e.g. CSC401"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePQ;
