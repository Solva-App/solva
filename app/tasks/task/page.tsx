"use client";

import React, { useEffect, useMemo, useState } from "react";
import SideNav from "@/components/sideNav";
import TaskNavButton from "@/components/TaskNav";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "";

function getTasksEndpoint() {
  return API_BASE ? `${API_BASE}/tasks` : "/tasks";
}

function getDeleteEndpoint(id: string) {
  return API_BASE ? `${API_BASE}/tasks/${id}` : `/tasks/${id}`;
}

function parseAmount(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatNaira(amount: number) {
  return `₦ ${Math.trunc(amount || 0).toLocaleString("en-NG")}`;
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
    .map((t: any) => {
      const id = String(
        t?.id ??
          t?._id ??
          t?.taskId ??
          t?.task?.id ??
          t?.task?._id ??
          t?.task?.taskId ??
          ""
      );
      if (!id) return null;

      const numberOfDays = Number(
        t?.numberOfDays ?? t?.days ?? t?.durationDays ?? t?.task?.numberOfDays ?? 0
      );
      const numberOfPersons = Number(
        t?.numberOfPersons ?? t?.spots ?? t?.slots ?? t?.task?.numberOfPersons ?? 0
      );

      const timeLeftLabel =
        t?.timeLeftLabel ??
        (numberOfDays > 0
          ? `${numberOfDays} ${numberOfDays === 1 ? "day" : "days"} left`
          : "—");

      const spotsLeftLabel =
        t?.spotsLeftLabel ??
        (numberOfPersons > 0 ? `${numberOfPersons}+ spot left` : "—");

      const campaignType =
        t?.campaignType ??
        t?.campaign ??
        t?.type ??
        t?.task?.campaignType ??
        t?.task?.campaign ??
        "Campaign";

      const title =
        t?.title ??
        t?.campaignTitle ??
        t?.overviewTitle ??
        t?.task?.title ??
        t?.task?.campaignTitle ??
        "Untitled Task";

      const companyName =
        t?.companyName ??
        t?.brandName ??
        t?.company?.name ??
        t?.task?.companyName ??
        "Company";

      const totalPool = parseAmount(
        t?.totalPool ??
          t?.rewardPool ??
          t?.pool ??
          t?.amount ??
          t?.task?.amount ??
          t?.task?.totalPool
      );

      const companyLogoUrl =
        t?.companyLogoUrl ??
        t?.logoUrl ??
        t?.logo ??
        t?.company?.logoUrl ??
        t?.task?.companyLogoUrl ??
        null;

      const creativeImageUrl =
        t?.creativeImageUrl ??
        t?.campaignImageUrl ??
        t?.imageUrl ??
        t?.creativeUrl ??
        t?.task?.creativeImageUrl ??
        null;

      const timeLeftColor: "green" | "red" =
        t?.timeLeftColor === "green" ||
        (typeof timeLeftLabel === "string" && /\bdays?\b/i.test(timeLeftLabel))
          ? "green"
          : "red";

      return {
        id,
        companyName: String(companyName),
        companyLogoUrl: companyLogoUrl ? String(companyLogoUrl) : null,
        campaignType: String(campaignType),
        title: String(title),
        totalPool,
        creativeImageUrl: creativeImageUrl ? String(creativeImageUrl) : null,
        timeLeftLabel: String(timeLeftLabel),
        timeLeftColor,
        spotsLeftLabel: String(spotsLeftLabel),
      } satisfies TaskCard;
    })
    .filter(Boolean) as TaskCard[];
}

export default function TaskCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const endpoint = useMemo(() => getTasksEndpoint(), []);
  const approveTaskPath = cards[0]
    ? `/submissions/tasks/${encodeURIComponent(cards[0].id)}`
    : "";

  async function loadTasks() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error((await res.text()) || `Failed to load tasks (${res.status})`);
      }

      const json = await res.json();
      setCards(normalizeTasks(json));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load tasks");
      setCards([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function onDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(getDeleteEndpoint(id), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error((await res.text()) || `Delete failed (${res.status})`);
      }

      setCards((prev) => prev.filter((card) => card.id !== id));
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  }

  function onViewTask(taskId: string) {
    router.push(`/tasks/update/${encodeURIComponent(taskId)}`);
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
            <TaskNavButton
              label="Approve Task"
              path={approveTaskPath}
              align="right"
              disabled={!cards[0]}
            />
          </div>
        </div>

        <div className="lineWrap" aria-hidden>
          <span className="dot" />
          <div className="line" />
          <span className="dot" />
        </div>

        {error ? <div className="errorMsg">{error}</div> : <div className="spacer" />}

        <div className="grid">
          {loading ? (
            <div className="state">Loading tasks...</div>
          ) : cards.length === 0 ? (
            <div className="state">No tasks found. Create a task and upload it first.</div>
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

                      <button className="viewBtn" type="button" onClick={() => onViewTask(card.id)}>
                        View Task
                      </button>
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

        .headerTitles :global(.hTitle.right) {
          text-align: center;
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

        .viewBtn {
          border: none;
          background: #6911b0;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          border-radius: 10px;
          min-width: 154px;
          height: 44px;
          padding: 0 18px;
          cursor: pointer;
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
        }
      `}</style>
    </SideNav>
  );
}
