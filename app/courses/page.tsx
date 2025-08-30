"use client";
import React, { useState } from "react";
import SideNav from "@/components/sideNav";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCourses, CourseType } from "./useCourses";

const Courses = () => {
  const router = useRouter();
  const { courses, loading, approveCourse, declineCourse, deleteCourse } =
    useCourses();

  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [viewDocs, setViewDocs] = useState<CourseType | null>(null);

  const handleDelete = (id: number) => setDeleteModalId(id);

  const confirmDelete = async () => {
    if (deleteModalId !== null) {
      setDeleting(true);
      await deleteCourse(deleteModalId);
      setDeleting(false);
      setDeleteModalId(null);
    }
  };

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="sm:text-3xl text-2xl font-bold">Manage Courses</h1>
          <button
            onClick={() => router.push("/courses/add-course")}
            className="sm:text-xl text-base font-medium flex items-center gap-2 rounded-[8px] text-white bg-primary p-2 cursor-pointer hover:bg-primary/90 transition"
          >
            <IoIosAddCircleOutline className="sm:h-8 h-5 w-5 sm:w-8" />
            Add new
          </button>
        </div>
        {loading ? (
          <p className="text-center mt-10">Loading courses...</p>
        ) : (
          <div className="overflow-x-scroll">
            <table className="table-auto w-full border-collapse">
              <thead className="bg-[#E1E2E180]">
                <tr>
                  <th className="text-center py-4 px-3">University</th>
                  <th className="text-center py-4">Faculty</th>
                  <th className="text-center py-4">Department</th>
                  <th className="text-center py-4 px-4">Course Code</th>
                  <th className="text-center py-4 px-2">Title</th>
                  <th className="text-center py-4 px-2">Documents</th>
                  <th className="text-center py-4 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: CourseType) => (
                  <tr
                    key={course.question.id}
                    className="border border-[#D9D9D9] hover:bg-gray-50 transition"
                  >
                    <td className="text-center py-4">
                      {course.question?.university || "-"}
                    </td>
                    <td className="text-center py-4">
                      {course.question?.faculty || "-"}
                    </td>
                    <td className="text-center py-4">
                      {course.question?.department || "-"}
                    </td>
                    <td className="text-center py-4">
                      {course.question?.courseCode || "-"}
                    </td>
                    <td className="text-center py-4">
                      {course.question?.title || "-"}
                    </td>
                    <td className="text-center py-4">
                      {Array.isArray(course.document) &&
                        course.document.length > 0 ? (
                        <button
                          onClick={() => setViewDocs(course)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          View ({course.document.length})
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No Docs</span>
                      )}
                    </td>
                    <td className="text-center flex-col py-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => approveCourse(course)}
                        className="bg-green-600 disabled:hidden p-2 rounded text-white hover:bg-green-700 transition"
                        disabled={
                          !Array.isArray(course.document) ||
                          course.document.every(
                            (doc) => doc.requiresApproval === true
                          )
                        }
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => declineCourse(course.question.id)}
                        className="bg-yellow-500 disabled:hidden p-2 rounded text-white hover:bg-yellow-600 transition"
                        disabled={
                          !Array.isArray(course.document) ||
                          course.document.every(
                            (doc) => doc.requiresApproval !== true
                          )
                        }
                      >
                        Disapprove
                      </button>
                      <button
                        onClick={() => handleDelete(course.question.id)}
                        className="bg-red-600 p-2 rounded text-white hover:bg-red-700 transition disabled:opacity-50"
                        disabled={deleting}
                      >
                        {deleting && deleteModalId === course.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {deleteModalId !== null && (
          <div className="absolute w-full h-screen top-0 left-0 flex justify-center items-center bg-black/20">
            <div className="w-96 h-52 sm:h-60 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px] flex flex-col justify-between">
              <div>
                <h1 className="text-[#1E1E1E] text-center font-bold text-2xl sm:text-3xl">
                  Confirm Delete
                </h1>
                <p className="text-sm sm:text-base text-[#5C5F62] py-4 sm:py-6 text-center font-medium">
                  Once deleted you cannot recover it, confirm to delete.
                </p>
              </div>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-base sm:text-xl font-medium"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-[#DD0F0F] rounded-[8px] w-full py-3 text-base sm:text-xl text-white font-medium"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        {viewDocs && (
          <div className="absolute w-full h-screen top-0 left-0 flex justify-center items-center bg-black/30 z-50">
            <div className="bg-white rounded-lg p-5 w-[90%] max-w-2xl h-[80%] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                Documents for {viewDocs.question?.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {viewDocs.document?.map((doc) => (
                  <div key={doc.id} className="border rounded p-2">
                    {doc.mimetype.startsWith("image/") ? (
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="w-full h-40 object-cover rounded"
                      />
                    ) : (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {doc.name}
                      </a>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {doc.status}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setViewDocs(null)}
                className="mt-5 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
