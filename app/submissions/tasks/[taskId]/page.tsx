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

  const loadSubmissions = useCallback(async () => {
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
    <SideNav>
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
          min-height: 100%;
          background: #ededed;
          padding: 22px 34px;
        }

        .headerRow {
          display: flex;
          align-items: center;
          gap: 14px;
        }

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

        .error {
          color: #b00020;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .spacer {
          height: 18px;
        }

        .table {
          width: 100%;
          margin-top: 10px;
        }

        .row {
          display: grid;
          grid-template-columns: 1.2fr 0.5fr 0.6fr;
          align-items: center;
          padding: 18px 8px;
        }

        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cell.link {
          justify-content: flex-start;
          padding-left: 12px;
        }

        .linkText {
          color: #111;
          font-size: 12px;
          max-width: 240px;
          text-decoration: none;
          word-break: break-word;
          line-height: 1.15;
        }

        .linkText.muted {
          color: rgba(0, 0, 0, 0.4);
        }

        .date {
          font-size: 12px;
          color: #111;
        }

        .actions {
          justify-content: flex-end;
          gap: 28px;
          padding-right: 18px;
        }

        .reject,
        .approve {
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          font-size: 26px;
        }

        .reject {
          color: #d39a4a;
        }

        .approve {
          color: #0c8a2a;
        }

        .reject:disabled,
        .approve:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading,
        .empty {
          padding: 30px 12px;
          color: rgba(0, 0, 0, 0.55);
        }

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
      `}</style>
    </SideNav>
  );
}
