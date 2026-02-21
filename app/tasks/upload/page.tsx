"use client";

import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";

type TaskCard = {
  id: string;
  companyName: string;
  companyLogoUrl?: string | null;
  campaignType: "Video Campaign" | "Image Campaign" | "Text Campaign";
  title: string;

  totalPool: number;
  creativeImageUrl?: string | null;

  // display values
  timeLeftLabel: string;
  timeLeftColor: "green" | "red";
  spotsLeftLabel: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Defensive: helps you see the problem immediately if env isn’t set
function assertBaseUrl() {
  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is missing. Create .env.local and restart the dev server."
    );
  }
}

const ENDPOINTS = {
  list: () => {
    assertBaseUrl();
    return `${BASE_URL}/tasks`;
  },
  delete: (id: string) => {
    assertBaseUrl();
    return `${BASE_URL}/tasks/${id}`;
  },
};

function formatNaira(n: number) {
  const s = Math.trunc(n || 0).toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.substring(Math.max(i - 3, 0), i));
  }
  return `₦ ${parts.join(",")}`;
}

/**
 * Normalize backend responses into TaskCard[]
 * Supports:
 *  - [] (array)
 *  - { data: [] }
 *  - { tasks: [] }
 */
function normalizeTasksToCards(payload: any): TaskCard[] {
  const arr =
    Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.tasks) ? payload.tasks : [];

  return arr.map((t: any): TaskCard => {
    const id = String(
      t?.id ??
        t?.taskId ??
        t?._id ??
        t?.task?.id ??
        t?.task?.taskId ??
        t?.task?._id ??
        ""
    );
    const companyName = String(t?.companyName ?? t?.brandName ?? t?.company?.name ?? "—");

    // campaign type fallback
    const rawType = String(t?.campaignType ?? t?.type ?? "Text Campaign");
    const campaignType: TaskCard["campaignType"] =
      rawType === "Video Campaign" || rawType === "Image Campaign" || rawType === "Text Campaign"
        ? rawType
        : "Text Campaign";

    const title = String(t?.title ?? t?.name ?? "Untitled Task");
    const totalPool = Number(t?.totalPool ?? t?.rewardPool ?? t?.pool ?? 0);

    return {
      id,
      companyName,
      companyLogoUrl: t?.companyLogoUrl ?? t?.logoUrl ?? t?.company?.logoUrl ?? null,
      campaignType,
      title,
      totalPool,
      creativeImageUrl: t?.creativeImageUrl ?? t?.creativeUrl ?? t?.imageUrl ?? null,

      // If your backend has these, you can replace these display placeholders
      timeLeftLabel: t?.timeLeftLabel ?? "—",
      timeLeftColor: t?.timeLeftColor === "red" ? "red" : "green",
      spotsLeftLabel: t?.spotsLeftLabel ?? "—",
    };
  }).filter((x: TaskCard) => !!x.id); // remove items without ids
}

export default function TasksUploadPage() {
  const router = useRouter();
  const [data, setData] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setErr(null);

      try {
        const res = await fetch(ENDPOINTS.list(), {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to load tasks (${res.status})`);
        }

        const json = await res.json();
        const cards = normalizeTasksToCards(json);

        if (mounted) {
          setData(cards);
        }
      } catch (e: any) {
        if (mounted) {
          setErr(e?.message ?? "Failed to load tasks");
          setData([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  async function onDelete(id: string) {
    try {
      const res = await fetch(ENDPOINTS.delete(id), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Delete failed (${res.status})`);
      }

      setData((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      setErr(e?.message ?? "Failed to delete task");
    }
  }

function onViewTask(taskId: string) {
    router.push(`/tasks/update/${encodeURIComponent(taskId)}`);
  }

  return (
    <SideNav>
      <div className="page">
        {/* Header */}
        <div>
          <div className="headerRow">
            <button className="backBtn" aria-label="Back" onClick={() => router.back()}>
              ←
            </button>

            <div className="headerTitles">
              <div className="hTitle left">Manage Task</div>
              <div className="hTitle right">Approve Task</div>
            </div>
          </div>

          {/* Line with dots */}
          <div className="lineWrap">
            <span className="dot left" />
            <div className="line" />
            <span className="dot right" />
          </div>
        </div>

        <div className="grid">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : err ? (
            <div className="loading">{err}</div>
          ) : data.length === 0 ? (
            <div className="loading">No tasks found.</div>
          ) : (
            data.map((t) => (
              <div key={t.id} className="cardWrap">
                <div className="card">
                  {/* top row */}
                  <div className="topRow">
                    <div className="brandRow">
                      <div className="brandLogo">
                        {t.companyLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.companyLogoUrl} className="imgFill" alt="logo" />
                        ) : null}
                      </div>
                      <div className="brandName">{t.companyName}</div>
                    </div>

                    <div className="pool">
                      <div className="poolLabel">Total pool</div>
                      <div className="poolValue">{formatNaira(t.totalPool)}</div>
                    </div>
                  </div>

                  <div className="pill">{t.campaignType}</div>

                  <div className="titleRow">
                    <div className="taskTitle">{t.title}</div>

                    <div className="creative">
                      {t.creativeImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.creativeImageUrl} className="imgFill" alt="creative" />
                      ) : (
                        <div className="creativePh" />
                      )}
                    </div>
                  </div>

                  <div className="metaRow">
                    <span className={`time ${t.timeLeftColor}`}>{t.timeLeftLabel}</span>
                    <span className="spots">{t.spotsLeftLabel}</span>
                  </div>

                  <button className="viewBtn" onClick={() => onViewTask(t.id)}>
                    View Task
                  </button>
                </div>

                <button className="trash" aria-label="Delete" onClick={() => onDelete(t.id)}>
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
          padding: 22px 26px;
        }

        .headerRow {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .backBtn {
          border: none;
          background: transparent;
          font-size: 34px;
          cursor: pointer;
          line-height: 1;
          padding: 0 4px;
        }

        .headerTitles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          align-items: center;
        }

        .hTitle {
          font-size: 26px;
          font-weight: 800;
          color: #111;
        }

        .hTitle.left {
          text-align: left;
        }

        .hTitle.right {
          text-align: center;
        }

        .lineWrap {
          margin-top: 10px;
          margin-bottom: 14px;
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

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 26px;
        }

        .loading {
          padding: 40px;
          color: rgba(0, 0, 0, 0.6);
          font-weight: 600;
        }

        .cardWrap {
          position: relative;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.2);
          padding: 18px 18px 16px;
          min-height: 210px;
        }

        .topRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
        }

        .brandRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brandLogo {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: #eee;
          overflow: hidden;
          flex: none;
        }

        .brandName {
          font-weight: 800;
          font-size: 26px;
          line-height: 1;
        }

        .pool {
          text-align: right;
        }

        .poolLabel {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.55);
          font-weight: 600;
        }

        .poolValue {
          font-size: 28px;
          font-weight: 900;
          color: #5a189a;
          margin-top: 2px;
        }

        .pill {
          margin-top: 10px;
          width: fit-content;
          padding: 2px 16px;
          border: 1px solid rgba(0, 0, 0, 0.35);
          border-radius: 6px;
          color: rgba(0, 0, 0, 0.35);
          font-weight: 700;
        }

        .titleRow {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .taskTitle {
          font-weight: 800;
          color: #111;
          max-width: 260px;
        }

        .creative {
          width: 82px;
          height: 82px;
          border-radius: 12px;
          overflow: hidden;
          background: #eee;
          flex: none;
        }

        .creativePh {
          width: 100%;
          height: 100%;
          background: #eee;
        }

        .metaRow {
          margin-top: 14px;
          display: flex;
          gap: 20px;
          align-items: center;
          font-weight: 700;
        }

        .time.green {
          color: #1a8f3a;
        }

        .time.red {
          color: #c01818;
        }

        .spots {
          color: #111;
        }

        .viewBtn {
          margin-top: 18px;
          border: none;
          background: #5a189a;
          color: #fff;
          font-weight: 800;
          padding: 14px 22px;
          border-radius: 12px;
          width: 170px;
          cursor: pointer;
        }

        .trash {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -34px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 24px;
          color: red;
        }

        .imgFill {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </SideNav>
  );
}
