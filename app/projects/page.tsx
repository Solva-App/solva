"use client";
import React, { useState } from "react";
import SideNav from "@/components/sideNav";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProjectType, useProjects } from "./useProjects";

const Project = () => {
  const router = useRouter();
  const {
    projects,
    loading,
    approveProject,
    declineProject,
    deleteProject,
  } = useProjects();

  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState<number | null>(null);
  const [disapproving, setDisapproving] = useState<number | null>(null);
  const [viewDocs, setViewDocs] = useState<ProjectType | null>(null);

  const handleDelete = (id: number) => setDeleteModalId(id);

  const confirmDelete = async () => {
    if (deleteModalId !== null) {
      setDeleting(true);
      await deleteProject(deleteModalId);
      setDeleting(false);
      setDeleteModalId(null);
    }
  };

  const handleApprove = async (id: number) => {
    setApproving(id);
    await approveProject(id);
    setApproving(null);
  };

  const handleDisapprove = async (id: number) => {
    setDisapproving(id);
    await declineProject(id);
    setDisapproving(null);
  };

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="sm:text-3xl text-2xl font-bold">Manage Projects</h1>
          <button
            onClick={() => router.push("/projects/add-project")}
            className="sm:text-xl text-base font-medium flex items-center gap-2 rounded-lg text-white bg-primary p-2 hover:bg-primary/90 transition"
          >
            <IoIosAddCircleOutline className="sm:h-8 h-5 w-5 sm:w-8" />
            Add new
          </button>
        </div>
        {loading ? (
          <p className="text-center mt-10">Loading projects...</p>
        ) : (
          <div className="overflow-x-scroll">
            <table className="table-auto w-full border-collapse">
              <thead className="bg-[#E1E2E180]">
                <tr>
                  <th className="text-center py-4 px-3">Project Name</th>
                  <th className="text-center py-4 px-3">Documents</th>
                  <th className="text-center py-4 px-3">Status</th>
                  <th className="text-center py-4 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: ProjectType | any) => {
                  return (
                    <tr key={project.id} className="border border-[#D9D9D9] hover:bg-gray-50 transition">
                      <td className="text-center py-4">{project.name}</td>
                      <td className="text-center py-4">
                        <p className="font-medium">{project.documents.length} file(s)</p>
                        <button
                          onClick={() => setViewDocs(project)}
                          className="mt-2 bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition text-sm"
                        >
                          View
                        </button>
                      </td>
                      <td className="text-center py-4">
                        <span
                          className={`px-2 py-1 rounded text-white font-semibold ${project.requiresApproval === true
                              ? "bg-yellow-500"  
                              : project.requiresApproval === false
                                ? "bg-green-600"  
                                : "bg-red-600"    
                            }`}
                        >
                          {project.requiresApproval === true
                            ? "Pending"
                            : project.requiresApproval === false
                              ? "Approved"
                              : "Declined"}
                        </span>

                      </td>
                      <td className="text-center flex-col py-4 flex items-center justify-center gap-2">
                        {/* {project.documents.some((doc: { status: string }) => doc.status === "pending") && (
            <>
              <button
                onClick={() => handleApprove(project.id)}
                className="bg-green-600 p-2 rounded text-white hover:bg-green-700 transition"
              >
                {approving === project.id ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={() => handleDisapprove(project.id)}
                className="bg-yellow-600 p-2 rounded text-white hover:bg-yellow-700 transition"
              >
                {disapproving === project.id ? "Processing..." : "Disapprove"}
              </button>
            </>
          )} */}
                        <button
                          disabled={!project.requiresApproval}
                          onClick={() => approveProject(project)}
                          className="bg-green-600 disabled:hidden p-2 rounded text-white hover:bg-green-700 transition"
                        >
                          {approving === project.id ? "Approving..." : "Approve"}
                        </button>

                        <button
                          disabled={project.requiresApproval}
                          onClick={() => handleDisapprove(project.id)}
                          className="bg-yellow-600 disabled:hidden p-2 rounded text-white hover:bg-yellow-700 transition"
                        >
                          {disapproving === project.id ? "Processing..." : "Disapprove"}
                        </button>

                        <button
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-600 p-2 rounded text-white hover:bg-red-700 transition disabled:opacity-50"
                          disabled={deleting && deleteModalId === project.id}
                        >
                          {deleting && deleteModalId === project.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

        {deleteModalId !== null && (
          <div className="absolute w-full h-screen top-0 left-0 flex justify-center items-center bg-black/20">
            <div className="w-96 bg-white border p-5 rounded-lg shadow flex flex-col justify-between">
              <div>
                <h1 className="text-center font-bold text-2xl">Confirm Delete</h1>
                <p className="text-sm text-gray-600 py-4 text-center">
                  This action is irreversible. Do you want to proceed?
                </p>
              </div>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="bg-gray-200 rounded-lg w-full py-2 text-base font-medium"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 rounded-lg w-full py-2 text-base text-white font-medium"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        {viewDocs && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
            onClick={() => setViewDocs(null)}
          >
            <div
              className="bg-white rounded-lg p-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{viewDocs.name} - Documents</h2>
                <button
                  onClick={() => setViewDocs(null)}
                  className="text-red-600 hover:text-red-800 text-lg font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {viewDocs.documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col items-center">
                    <Image
                      src={doc.url}
                      alt={doc.name}
                      height={300}
                      width={300}
                      className="w-full h-64 object-contain border rounded-lg shadow"
                    />
                    <p className="mt-2 text-sm text-gray-600">{doc.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;
