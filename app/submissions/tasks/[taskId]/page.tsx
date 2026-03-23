"use client";

import React, { useCallback, useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

type Submission = {
  id: string;
  link: string;
  createdAt: string | null;
};

const axiosInstance = createAxiosInstance();
const API = {
  listByTask: (taskId: string) => `${apis.submission}/task/${taskId}`,
  byId: (id: string) => `${apis.submission}/${id}`,
  approve: (id: string) => `${apis.submission}/approve/${id}`,
  reject: (id: string) => `${apis.submission}/reject/${id}`,
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function readText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function pickText(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = readText(record[key]);
    if (value) return value;
  }
  return "";
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asRecord(payload);
  const data = asRecord(root.data);

  if (Array.isArray(root.data)) return root.data as unknown[];
  if (Array.isArray(root.submissions)) return root.submissions as unknown[];
  if (Array.isArray(data.submissions)) return data.submissions as unknown[];
  if (Array.isArray(data.data)) return data.data as unknown[];

  return [];
}

function normalizeSubmission(item: unknown): Submission | null {
  const record = asRecord(item);
  const nestedSubmission = asRecord(record.submission);
  const source = Object.keys(nestedSubmission).length ? nestedSubmission : record;

  const id = pickText(source, ["id", "_id", "submissionId"]);
  if (!id) return null;

  const link =
    pickText(source, ["link", "url", "submissionLink", "proofUrl", "referenceUrl", "attachmentUrl"]) ||
    pickText(asRecord(source.proof), ["url", "link"]) ||
    pickText(asRecord(source.attachment), ["url", "link"]);

  return {
    id,
    link,
    createdAt:
      pickText(source, ["submittedAt", "createdAt", "dateSubmitted", "updatedAt"]) || null,
  };
}

function formatDate(raw: string | null) {
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message ?? error?.message ?? fallback;
}

export default function ApproveTaskPage() {
  const router = useRouter();
  const params = useParams<{ taskId: string }>();
  const taskIdParam = params?.taskId;
  const taskId = Array.isArray(taskIdParam) ? taskIdParam[0] : taskIdParam;

  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  /**
   * ✅ FIX: apiFetch now uses buildHeaders()
   */
  async function apiFetch(url: string, init: RequestInit = {}) {
    return fetch(url, {
      ...init,
      headers: buildHeaders(init.headers),
      // ✅ remove credentials to avoid CORS credential rules
      // credentials: "include",
    });
  }
  async function load() {
    console.log("load() called. taskId =", taskId);
=======
  const loadSubmissions = useCallback(async () => {
>>>>>>> 9ca3d16 (Submissions completed.)
    if (!taskId) {
      setRows([]);
      setLoading(false);
      setError("Missing task id.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(API.listByTask(taskId));
      const normalized = extractList(response.data)
        .map((item) => normalizeSubmission(item))
        .filter(Boolean) as Submission[];

      setRows(normalized);
    } catch (requestError: any) {
      setRows([]);
      setError(getErrorMessage(requestError, "Failed to load submissions"));
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  async function onAction(type: "approve" | "reject", submissionId: string) {
    setBusyId(submissionId);
    setError(null);

    try {
      await axiosInstance.get(API.byId(submissionId));
      await axiosInstance.patch(type === "approve" ? API.approve(submissionId) : API.reject(submissionId), {});
      toast.success(type === "approve" ? "Submission approved" : "Submission rejected");
      await loadSubmissions();
    } catch (requestError: any) {
      const message = getErrorMessage(
        requestError,
        type === "approve" ? "Approve failed" : "Reject failed"
      );
      setError(message);
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="page">
        <div className="headerRow">
          <button className="backBtn" aria-label="Back" onClick={() => router.back()}>
            <FiArrowLeft />
          </button>
          <div className="title">Approve Task</div>
        </div>

        <div className="lineWrap" aria-hidden>
          <span className="dot" />
          <div className="line" />
          <span className="dot" />
        </div>

        {error ? <div className="error">{error}</div> : <div className="spacer" />}

        <div className="table">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="empty">No submissions yet.</div>
          ) : (
            rows.map((submission) => {
              const isBusy = busyId === submission.id;

              return (
                <div className="row" key={submission.id}>
                  <div className="cell link">
                    {submission.link ? (
                      <a className="linkText" href={submission.link} target="_blank" rel="noreferrer">
                        {submission.link}
                      </a>
                    ) : (
                      <span className="linkText muted">No link</span>
                    )}
                  </div>

                  <div className="cell date">{formatDate(submission.createdAt)}</div>

                  <div className="cell actions">
                    <button
                      className="reject"
                      type="button"
                      disabled={isBusy}
                      onClick={() => onAction("reject", submission.id)}
                    >
                      {isBusy ? "..." : "Reject"}
                    </button>
                    <button
                      className="approve"
                      type="button"
                      disabled={isBusy}
                      onClick={() => onAction("approve", submission.id)}
                    >
                      {isBusy ? "..." : "Approve"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
<<<<<<< HEAD
          padding: 22px 34px;
        }
=======
          min-height: 100%;
          background: #ededed;
          padding: 22px 34px;
        }

>>>>>>> 9ca3d16 (Submissions completed.)
        .headerRow {
          display: flex;
          align-items: center;
          gap: 14px;
        }
<<<<<<< HEAD
        .backBtn {
          border: none;
          background: transparent;
          font-size: 34px;
          cursor: pointer;
          line-height: 1;
          padding: 0 4px;
        }
        .title {
          font-size: 26px;
          font-weight: 800;
          color: #111;
        }
        .lineWrap {
          margin-top: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .line {
          flex: 1;
          height: 2px;
          background: rgba(0, 0, 0, 0.35);
          margin: 0 14px;
        }
        .dot {
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 999px;
        }
=======

        .backBtn {
          border: none;
          background: transparent;
          color: #1c1c1c;
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
        }

        .title {
          font-size: 2rem;
          font-weight: 900;
          color: #111;
          line-height: 1.1;
        }

        .lineWrap {
          margin-top: 8px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .line {
          flex: 1;
          height: 2px;
          background: rgba(0, 0, 0, 0.34);
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.52);
        }

>>>>>>> 9ca3d16 (Submissions completed.)
        .error {
          color: #b00020;
          font-size: 13px;
          margin-bottom: 10px;
<<<<<<< HEAD
          white-space: pre-wrap;
        }
        .spacer {
          height: 18px;
        }
=======
        }

        .spacer {
          height: 18px;
        }

>>>>>>> 9ca3d16 (Submissions completed.)
        .table {
          width: 100%;
          margin-top: 10px;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .row {
          display: grid;
          grid-template-columns: 1.2fr 0.5fr 0.6fr;
          align-items: center;
          padding: 18px 8px;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .cell.link {
          justify-content: flex-start;
          padding-left: 12px;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .linkText {
          color: #111;
          font-size: 12px;
          max-width: 240px;
          text-decoration: none;
          word-break: break-word;
<<<<<<< HEAD
        }
        .linkText.muted {
          color: rgba(0, 0, 0, 0.4);
        }
        .linkText:hover {
          text-decoration: underline;
        }
=======
          line-height: 1.15;
        }

        .linkText.muted {
          color: rgba(0, 0, 0, 0.4);
        }

>>>>>>> 9ca3d16 (Submissions completed.)
        .date {
          font-size: 12px;
          color: #111;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .actions {
          justify-content: flex-end;
          gap: 28px;
          padding-right: 18px;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .reject,
        .approve {
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          font-size: 26px;
        }
<<<<<<< HEAD
        .reject {
          color: #d39a4a;
        }
        .approve {
          color: #0c8a2a;
        }
=======

        .reject {
          color: #d39a4a;
        }

        .approve {
          color: #0c8a2a;
        }

>>>>>>> 9ca3d16 (Submissions completed.)
        .reject:disabled,
        .approve:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
<<<<<<< HEAD
=======

>>>>>>> 9ca3d16 (Submissions completed.)
        .loading,
        .empty {
          padding: 30px 12px;
          color: rgba(0, 0, 0, 0.55);
        }
<<<<<<< HEAD
=======

        @media (max-width: 780px) {
          .page {
            padding: 18px 18px 24px;
          }

          .title {
            font-size: 1.55rem;
          }

          .row {
            grid-template-columns: 1fr;
            gap: 10px;
            justify-items: flex-start;
            padding: 18px 0;
          }

          .cell,
          .cell.link,
          .actions {
            justify-content: flex-start;
            padding-left: 0;
            padding-right: 0;
          }

          .actions {
            gap: 18px;
          }

          .reject,
          .approve {
            font-size: 22px;
          }
        }
>>>>>>> 9ca3d16 (Submissions completed.)
      `}</style>
    </>
  );
}
