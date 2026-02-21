"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useGrants } from "@/app/grants/useGrants";
import { useScholar } from "@/app/scholarships/useSchola";
import { useRouter } from "next/navigation";

const Awards = () => {
  const router = useRouter();

  const {
    loadFetch: grantsLoading,
    fetched: grantsFetched,
    fetchGrants,
    delGrant: delGrantLoading,
    deleteGrant: deleteGrantGrant,
    setDeleteModal: setDeleteGrantModal,
    openDeleteModal: openDeleteGrantModal,
  } = useGrants();

  const {
    loadFetch: schLoading,
    fetched: schFetched,
    fetchScholar,
    delGrant: delSchLoading,
    deleteGrant: deleteScholar,
    setDeleteModal: setDeleteSchModal,
    openDeleteModal: openDeleteSchModal,
  } = useScholar();

  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);
  const [selectedSch, setSelectedSch] = useState<string | null>(null);

  useEffect(() => {
    fetchGrants();
    fetchScholar();
  }, []);

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="sm:text-3xl text-2xl font-bold text-gray-800">
            Manage Grants & Scholarships
          </h1>
        </div>

        {/* Grants Section */}
        <section className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Grants</h2>
            <button
              onClick={() => router.push("/grants/add-grants")}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 transition text-white text-sm font-medium"
            >
              <IoIosAddCircleOutline className="h-5 w-5" />
              Add Grant
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-2 px-4 text-center">Link</th>
                  <th className="py-2 px-4 text-center">Date</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {grantsLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">Loading grants...</td>
                  </tr>
                ) : grantsFetched.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">No grants found</td>
                  </tr>
                ) : (
                  grantsFetched.map((g: any) => (
                    <tr key={g.id} className="border-t hover:bg-gray-50">
                      <td className="text-primary underline text-center py-3 px-4">
                        <a href={g.link} target="_blank" rel="noreferrer">{g.link}</a>
                      </td>
                      <td className="text-center py-3 px-4">{new Date(g.createdAt).toLocaleDateString()}</td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-4">
                          <CiEdit onClick={() => router.push(`/grants/${g.id}`)} className="text-gray-700 hover:text-primary text-xl cursor-pointer" />
                          <RiDeleteBin2Line onClick={() => { setDeleteGrantModal(true); setSelectedGrant(g.id); }} className="text-red-500 hover:text-red-600 text-xl cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Grants Delete Modal */}
          {openDeleteGrantModal && selectedGrant && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white w-11/12 max-w-md rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-center text-gray-800">Confirm Delete</h2>
                <p className="text-gray-600 text-center mt-3 text-sm">Once deleted, you cannot recover this grant.</p>
                <div className="flex items-center gap-4 mt-6">
                  <button onClick={() => setDeleteGrantModal(false)} className="flex-1 py-2 rounded-lg border border-gray-300 bg-gray-100">Cancel</button>
                  <button onClick={() => deleteGrantGrant(selectedGrant)} className="flex-1 py-2 rounded-lg bg-red-600 text-white">{delGrantLoading ? "Deleting..." : "Confirm"}</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Scholarships Section */}
        <section className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Scholarships</h2>
            <button
              onClick={() => router.push("/scholarships/add-scholarship")}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 transition text-white text-sm font-medium"
            >
              <IoIosAddCircleOutline className="h-5 w-5" />
              Add Scholarship
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-2 px-4 text-center">Link</th>
                  <th className="py-2 px-4 text-center">Date</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {schLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">Loading scholarships...</td>
                  </tr>
                ) : schFetched.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">No scholarships found</td>
                  </tr>
                ) : (
                  schFetched.map((s: any) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="text-primary underline text-center py-3 px-4">
                        <a href={s.link} target="_blank" rel="noreferrer">{s.link}</a>
                      </td>
                      <td className="text-center py-3 px-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-4">
                          <CiEdit onClick={() => router.push(`/scholarships/${s.id}`)} className="text-gray-700 hover:text-primary text-xl cursor-pointer" />
                          <RiDeleteBin2Line onClick={() => { setDeleteSchModal(true); setSelectedSch(s.id); }} className="text-red-500 hover:text-red-600 text-xl cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Scholarships Delete Modal */}
          {openDeleteSchModal && selectedSch && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white w-11/12 max-w-md rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-center text-gray-800">Confirm Delete</h2>
                <p className="text-gray-600 text-center mt-3 text-sm">Once deleted, you cannot recover this scholarship.</p>
                <div className="flex items-center gap-4 mt-6">
                  <button onClick={() => setDeleteSchModal(false)} className="flex-1 py-2 rounded-lg border border-gray-300 bg-gray-100">Cancel</button>
                  <button onClick={() => deleteScholar(selectedSch)} className="flex-1 py-2 rounded-lg bg-red-600 text-white">{delSchLoading ? "Deleting..." : "Confirm"}</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Awards;
