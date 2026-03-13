"use client";

import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import TaskNavButton from "@/components/TaskNav";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";

type TaskCard = {
  id: string;
  companyName: string;
  companyLogoUrl: string | null;
  campaignType: string;
  title: string;
  totalPool: number;
  creativeImageUrl: string | null;
  timeLeftLabel: string;
  timeLeftColor: "green" | "red";
  spotsLeftLabel: string;
};

const axiosInstance = createAxiosInstance();
const API = {
  list: apis.task,
  byId: (id: string) => `${apis.task}/${id}`,
};

function parseAmount(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatNaira(amount: number) {
  return `NGN ${Math.trunc(amount || 0).toLocaleString("en-NG")}`;
}

function getDaysLeftLabel(task: any) {
  if (typeof task?.timeLeftLabel === "string" && task.timeLeftLabel.trim()) {
    return task.timeLeftLabel;
  }

  if (typeof task?.endDate === "string") {
    const endDate = new Date(task.endDate);
    if (!Number.isNaN(endDate.getTime())) {
      const diffMs = endDate.getTime() - Date.now();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return `${diffDays} ${diffDays === 1 ? "day" : "days"} left`;
      }
    }
  }

  const numberOfDays = Number(task?.numberOfDays ?? task?.days ?? task?.durationDays ?? 0);
  if (numberOfDays > 0) {
    return `${numberOfDays} ${numberOfDays === 1 ? "day" : "days"} left`;
  }

  return "-";
}

function getSpotsLeftLabel(task: any) {
  if (typeof task?.spotsLeftLabel === "string" && task.spotsLeftLabel.trim()) {
    return task.spotsLeftLabel;
  }

  const totalSpots = Number(task?.totalSpots ?? task?.numberOfPersons ?? task?.spots ?? 0);
  const usedSpots = Number(task?.usedSpots ?? 0);
  const spotsLeft = totalSpots - usedSpots;

  return spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left` : "-";
}

function normalizeTasks(payload: any): TaskCard[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.tasks)
    ? payload.tasks
    : Array.isArray(payload?.data?.tasks)
    ? payload.data.tasks
    : [];

  return list
    .map((task: any) => {
      const id = String(task?.id ?? task?._id ?? task?.taskId ?? "");
      if (!id) return null;

      const companyName =
        task?.sponsorName ?? task?.companyName ?? task?.brandName ?? task?.company?.name ?? "Company";
      const companyLogoUrl =
        task?.sponsorLogo ?? task?.companyLogoUrl ?? task?.logoUrl ?? task?.logo ?? task?.company?.logoUrl ?? null;
      const campaignType = task?.type ?? task?.campaignType ?? task?.campaign ?? "Campaign";
      const creativeImageUrl =
        task?.bannerImage ?? task?.creativeImageUrl ?? task?.campaignImageUrl ?? task?.imageUrl ?? null;
      const timeLeftLabel = getDaysLeftLabel(task);

      return {
        id,
        companyName: String(companyName),
        companyLogoUrl: companyLogoUrl ? String(companyLogoUrl) : null,
        campaignType: String(campaignType),
        title: String(task?.title ?? task?.campaignTitle ?? "Untitled Task"),
        totalPool: parseAmount(task?.totalPool ?? task?.rewardPool ?? task?.pool ?? task?.amount),
        creativeImageUrl: creativeImageUrl ? String(creativeImageUrl) : null,
        timeLeftLabel,
        timeLeftColor: /\bdays?\b/i.test(timeLeftLabel) ? "green" : "red",
        spotsLeftLabel: getSpotsLeftLabel(task),
      } satisfies TaskCard;
    })
    .filter(Boolean) as TaskCard[];
}

function getErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message ?? error?.message ?? fallback;
}

export default function TaskCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(API.list);
        if (!cancelled) {
          setCards(normalizeTasks(response.data));
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(getErrorMessage(e, "Failed to load tasks"));
          setCards([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  async function onDelete(id: string) {
    setDeletingId(id);
    setError(null);

    try {
      await axiosInstance.delete(API.byId(id));
      setCards((prev) => prev.filter((card) => card.id !== id));
    } catch (e: any) {
      setError(getErrorMessage(e, "Failed to delete task"));
    } finally {
      setDeletingId(null);
    }
  }

  function onViewTask(taskId: string) {
    router.push(`/tasks/update/${encodeURIComponent(taskId)}`);
  }

  function onOpenSubmissions(taskId: string) {
    router.push(`/submissions/tasks/${encodeURIComponent(taskId)}`);
  }

  function onCreateTask() {
    router.push("/tasks/create");
  }

  return (
    <SideNav>
      <div className="page">
        <div className="headerRow">
          <button className="backBtn" aria-label="Back" onClick={() => router.back()}>
            <FiArrowLeft />
          </button>

          <div className="headerTitles">
            <TaskNavButton label="Manage Task" path="/tasks" align="left" />
            <div className="headerSpacer" aria-hidden />
          </div>
        </div>

        <div className="lineWrap" aria-hidden>
          <span className="dot" />
          <div className="line" />
          <span className="dot" />
        </div>

        <div className="actionsRow">
          <button className="createBtn" type="button" onClick={onCreateTask}>
            Create Task
          </button>
        </div>

        {error ? <div className="errorMsg">{error}</div> : <div className="spacer" />}

        <div className="grid">
          {loading ? (
            <div className="state">Loading tasks...</div>
          ) : cards.length === 0 ? (
            <div className="state">No tasks found. Use Create Task to start a new one.</div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="cardWrap">
                <div className="card">
                  <div className="topRow">
                    <div className="brandRow">
                      <div className="brandLogo">
                        {card.companyLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.companyLogoUrl} alt={`${card.companyName} logo`} className="imgFill" />
                        ) : (
                          <span className="brandInitial">
                            {card.companyName.trim().charAt(0).toUpperCase() || "C"}
                          </span>
                        )}
                      </div>

                      <div className="brandMeta">
                        <div className="brandName">{card.companyName}</div>
                        <div className="campaignPill">{card.campaignType}</div>
                      </div>
                    </div>

                    <div className="poolBlock">
                      <div className="poolLabel">Total pool</div>
                      <div className="poolValue">{formatNaira(card.totalPool)}</div>
                    </div>
                  </div>

                  <div className="contentRow">
                    <div className="leftInfo">
                      <div className="taskTitle">{card.title}</div>
                      <div className="metaRow">
                        <span className={`time ${card.timeLeftColor}`}>{card.timeLeftLabel}</span>
                        <span className="spots">{card.spotsLeftLabel}</span>
                      </div>

                      <div className="buttonRow">
                        <button className="viewBtn" type="button" onClick={() => onViewTask(card.id)}>
                          View Task
                        </button>
                        <button className="submissionBtn" type="button" onClick={() => onOpenSubmissions(card.id)}>
                          Submissions
                        </button>
                      </div>
                    </div>

                    <div className="creativeWrap">
                      {card.creativeImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.creativeImageUrl} alt="Task creative" className="imgFill" />
                      ) : (
                        <div className="creativePlaceholder">Image</div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="trashBtn"
                  type="button"
                  aria-label="Delete task"
                  onClick={() => onDelete(card.id)}
                  disabled={deletingId === card.id}
                >
                  {deletingId === card.id ? "..." : <FiTrash2 />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100%;
          background: #ededed;
          padding: 22px 28px 30px;
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

        .headerTitles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          align-items: center;
        }

        .headerTitles :global(.hTitle) {
          font-size: 2rem;
          font-weight: 900;
          color: #111;
          line-height: 1.1;
        }

        .headerTitles :global(.hTitle.left) {
          text-align: left;
        }

        .headerSpacer {
          width: 100%;
        }

        .lineWrap {
          margin: 8px 2px 14px;
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

        .actionsRow {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }

        .createBtn {
          border: none;
          background: #6911b0;
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          border-radius: 10px;
          min-width: 148px;
          height: 42px;
          padding: 0 18px;
          cursor: pointer;
        }

        .errorMsg {
          color: #b00020;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .spacer {
          height: 18px;
          margin-bottom: 4px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 14px;
          align-items: start;
        }

        .state {
          grid-column: 1 / -1;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
          padding: 20px;
          color: rgba(0, 0, 0, 0.6);
          font-weight: 600;
        }

        .cardWrap {
          position: relative;
          padding-bottom: 20px;
        }

        .card {
          background: #efefef;
          border-radius: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.18);
          padding: 20px 18px 16px;
          min-height: 252px;
        }

        .topRow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .brandRow {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }

        .brandLogo {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          overflow: hidden;
          background: #7e19c9;
          display: grid;
          place-items: center;
          flex: none;
        }

        .brandInitial {
          color: #fff;
          font-weight: 800;
          font-size: 14px;
        }

        .brandMeta {
          min-width: 0;
        }

        .brandName {
          font-size: 1.05rem;
          font-weight: 900;
          color: #111;
          line-height: 1.1;
          margin-bottom: 6px;
          word-break: break-word;
        }

        .campaignPill {
          width: fit-content;
          max-width: 170px;
          border: 1px solid rgba(0, 0, 0, 0.35);
          color: #7bb783;
          border-radius: 5px;
          padding: 1px 14px 2px;
          font-size: 12px;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background: rgba(255, 255, 255, 0.35);
        }

        .poolBlock {
          text-align: right;
          flex: none;
        }

        .poolLabel {
          color: rgba(0, 0, 0, 0.7);
          font-size: 14px;
          margin-bottom: 2px;
        }

        .poolValue {
          color: #5d12a8;
          font-weight: 900;
          font-size: 1.05rem;
          line-height: 1.05;
        }

        .contentRow {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
        }

        .leftInfo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          flex: 1;
        }

        .taskTitle {
          color: #111;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 18px;
          word-break: break-word;
        }

        .metaRow {
          display: flex;
          align-items: center;
          gap: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .time {
          font-size: 14px;
        }

        .time.green {
          color: #2ca04c;
        }

        .time.red {
          color: #ff221a;
        }

        .spots {
          color: #111;
          font-size: 14px;
        }

        .buttonRow {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .viewBtn,
        .submissionBtn {
          border-radius: 10px;
          min-width: 154px;
          height: 44px;
          padding: 0 18px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
        }

        .viewBtn {
          border: none;
          background: #6911b0;
          color: #fff;
        }

        .submissionBtn {
          border: 1px solid rgba(0, 0, 0, 0.16);
          background: #fff;
          color: #111;
        }

        .creativeWrap {
          width: 80px;
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          background: #ddd;
          flex: none;
          align-self: center;
        }

        .creativePlaceholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: rgba(0, 0, 0, 0.4);
          font-weight: 700;
          font-size: 12px;
          background: #e0e0e0;
        }

        .trashBtn {
          position: absolute;
          left: 50%;
          bottom: -2px;
          transform: translateX(-50%);
          border: none;
          background: transparent;
          color: #ff1200;
          width: 30px;
          height: 22px;
          display: grid;
          place-items: center;
          cursor: pointer;
          font-size: 18px;
        }

        .trashBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .imgFill {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .actionsRow {
            justify-content: flex-start;
          }
        }
      `}</style>
    </SideNav>
  );
}
