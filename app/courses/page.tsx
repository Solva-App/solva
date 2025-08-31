"use client";
import React, { useState } from "react";
import SideNav from "@/components/sideNav";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCourses, CourseType } from "./useCourses";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

const Courses = () => {
  const router = useRouter();
  const { courses, loading, approveCourse, declineCourse, deleteCourse, approvingId } =
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

  console.log(approvingId, "approvong")

  return (
    <div className="flex relative bg-gray-50">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">
            Manage Past Questions
          </h1>
          <button
            onClick={() => router.push("/courses/add-course")}
            className=" text-sm font-medium flex items-center gap-1 p-2  rounded-lg text-white bg-primary  hover:bg-primary/90 transition"
          >
            <IoIosAddCircleOutline className="h-5 w-5" />
            <span className="text-sm">Add New</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center mt-10 text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-center mt-10 text-gray-400 italic">
            No courses available
          </p>
        ) : (
          <div className="overflow-x-auto rounded-sm shadow-sm bg-white">
            <table className="table-auto whitespace-nowrap w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {[
                    "University",
                    "Faculty",
                    "Department",
                    "Course Code",
                    "Title",
                    "Requires Approval",
                    "Documents",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="py-2 text-sm px-2 text-center">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="capitalize">
                {courses.map((course) => (
                  <tr
                    key={course.question.id}
                    className="border-t hover:bg-gray-50 text-sm transition"
                  >
                    <td className="py-2 font-semibold text-center">
                      {course.question?.university || "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {course.question?.faculty || "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {course.question?.department || "-"}
                    </td>
                    <td className="py-2 uppercase px-2 text-center">
                      {course.question?.courseCode || "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {course.question?.title || "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {course.question.requiresApproval ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {Array.isArray(course.document) &&
                        course.document.length > 0 ? (
                        <button
                          onClick={() => setViewDocs(course)}
                          className="mt-2 bg-primary text-white px-2 py-1 rounded-sm hover:bg-primary/80 transition text-xs"
                        >
                          View ({course.document.length})
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No Docs</span>
                      )}
                    </td>
                    <td className="py-2 px-3 flex justify-center gap-2 flex-wrap">
                      <button
                        disabled={!course.question.requiresApproval}
                        onClick={() => approveCourse(course)}
                        className="bg-green-600 px-3 py-1 disabled:hidden rounded-sm text-sm text-white hover:bg-green-700 transition"
                      >
                        {approvingId === course.question.id ? (
                          <Loader2 className="animate-spin text-white" />
                        ) : (
                          "Approve"
                        )}
                      </button>

                      {/* <button
                        disabled={course.question.requiresApproval}
                        onClick={() => declineCourse(course.question.id)}
                        className="bg-yellow-500 disabled:hidden px-3 py-1 rounded-sm text-sm text-white hover:bg-yellow-600 transition"
                      >
                        Disapprove
                      </button> */}
                      <button
                        onClick={() => handleDelete(course.question.id)}
                        className="bg-red-600 px-3 py-1 rounded-sm text-sm text-white hover:bg-red-700 transition disabled:opacity-50"
                        disabled={deleting}
                      >
                        {deleting && deleteModalId === course.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModalId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-full h-screen top-0 left-0 flex justify-center items-center bg-black/40 z-50"
          >
            <div className="w-96 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
              <h1 className="text-center font-bold text-xl text-gray-800">
                Confirm Delete
              </h1>
              <p className="text-center text-gray-500 my-4 text-sm">
                Once deleted, this action cannot be undone.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1 bg-gray-200 rounded-lg py-2 font-medium hover:bg-gray-300 transition"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white rounded-lg py-2 font-medium hover:bg-red-700 transition"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* View Docs Modal */}
        {viewDocs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-full h-screen top-0 left-0 flex justify-center items-center bg-black/50 z-50"
          >
            <div className="bg-white rounded-xl p-5 w-[90%] max-w-2xl h-[80%] overflow-y-auto shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800 ">
                  Documents for {viewDocs.question?.title}
                </h2><button
                  onClick={() => setViewDocs(null)}
                  className="p-2 w-7 h-7 bg-white rounded-full"
                >
                  <X className="text-red-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {viewDocs.document?.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-2 bg-gray-50 hover:shadow-md transition"
                  >
                    {doc.mimetype.startsWith("image/") ? (
                      <Image
                        width={100}
                        height={100}
                        src={doc.url}
                        alt={doc.name}
                        className="w-full h-96 object-cover rounded"
                      />
                    ) : (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {doc.name}
                      </a>
                    )}
                    <p className="text-xs text-primary mt-1">
                      Status: {doc.status}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
