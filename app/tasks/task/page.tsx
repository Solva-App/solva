"use client";

import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import TaskNavButton from "@/components/TaskNav";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";

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

  const numberOfDays = Number(
    task?.numberOfDays ?? task?.days ?? task?.durationDays ?? 0,
  );
  if (numberOfDays > 0) {
    return `${numberOfDays} ${numberOfDays === 1 ? "day" : "days"} left`;
  }

  return "-";
}

function getSpotsLeftLabel(task: any) {
  if (typeof task?.spotsLeftLabel === "string" && task.spotsLeftLabel.trim()) {
    return task.spotsLeftLabel;
  }

  const totalSpots = Number(
    task?.totalSpots ?? task?.numberOfPersons ?? task?.spots ?? 0,
  );
  const usedSpots = Number(task?.usedSpots ?? 0);
  const spotsLeft = totalSpots - usedSpots;

  return spotsLeft > 0
    ? `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`
    : "-";
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
        task?.sponsorName ??
        task?.companyName ??
        task?.brandName ??
        task?.company?.name ??
        "Company";
      const companyLogoUrl =
        task?.sponsorLogo ??
        task?.companyLogoUrl ??
        task?.logoUrl ??
        task?.logo ??
        task?.company?.logoUrl ??
        null;
      const campaignType =
        task?.type ?? task?.campaignType ?? task?.campaign ?? "Campaign";
      const creativeImageUrl =
        task?.bannerImage ??
        task?.creativeImageUrl ??
        task?.campaignImageUrl ??
        task?.imageUrl ??
        null;
      const timeLeftLabel = getDaysLeftLabel(task);

      return {
        id,
        companyName: String(companyName),
        companyLogoUrl: companyLogoUrl ? String(companyLogoUrl) : null,
        campaignType: String(campaignType),
        title: String(task?.title ?? task?.campaignTitle ?? "Untitled Task"),
        totalPool: parseAmount(
          task?.totalPool ?? task?.rewardPool ?? task?.pool ?? task?.amount,
        ),
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
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-full">
        {/* HEADER */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5427D7]" />

              <p className="text-xs uppercase tracking-[0.3em] text-[#5427D7]">
                Manage Campaigns
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-black md:text-5xl">
                Manage your
                <span className="text-[#5427D7]"> sponsored campaigns</span>
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#666666]">
                View campaigns, monitor submissions, manage rewards, and update
                sponsor details from one clean dashboard.
              </p>
            </div>

            <Button
              onClick={onCreateTask}
              className="h-14 rounded-2xl bg-[#5427D7] px-8 text-base font-semibold text-white hover:bg-[#5427D7]/90"
            >
              Create Campaign
            </Button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* STATES */}
        {loading ? (
          <div className="flex h-[300px] items-center justify-center rounded-3xl border border-[#ECECEC] bg-white text-lg font-medium text-[#666666] shadow-sm">
            Loading campaigns...
          </div>
        ) : cards.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#DADADA] bg-[#FAFAFA] text-center">
            <h3 className="text-2xl font-bold text-black">No campaigns yet</h3>

            <p className="mt-3 max-w-md text-[#666666]">
              Create your first sponsored campaign to start receiving
              submissions.
            </p>

            <Button
              onClick={onCreateTask}
              className="mt-6 h-12 rounded-2xl bg-[#5427D7] px-6 text-white hover:bg-[#5427D7]/90"
            >
              Create Campaign
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#5427D7]/10">
                      {card.companyLogoUrl ? (
                        <img
                          src={card.companyLogoUrl}
                          alt={card.companyName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#5427D7]">
                          {card.companyName.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black">
                        {card.companyName}
                      </h3>

                      <div className="mt-1 inline-flex rounded-full border border-[#5427D7]/20 bg-[#5427D7]/5 px-3 py-1 text-xs font-semibold text-[#5427D7]">
                        {card.campaignType}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete(card.id)}
                    disabled={deletingId === card.id}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                  >
                    {deletingId === card.id ? (
                      "..."
                    ) : (
                      <FiTrash2 className="text-lg" />
                    )}
                  </button>
                </div>

                {/* IMAGE */}
                <div className="mt-6 overflow-hidden rounded-3xl border border-[#ECECEC] bg-[#FAFAFA]">
                  {card.creativeImageUrl ? (
                    <img
                      src={card.creativeImageUrl}
                      alt={card.title}
                      className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-[220px] items-center justify-center text-[#999999]">
                      No Banner Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#777777]">
                        Total Reward Pool
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-[#5427D7]">
                        {formatNaira(card.totalPool)}
                      </h2>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          card.timeLeftColor === "green"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {card.timeLeftLabel}
                      </p>

                      <p className="mt-1 text-sm text-[#666666]">
                        {card.spotsLeftLabel}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-bold leading-snug text-black">
                    {card.title}
                  </h3>

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={() => onViewTask(card.id)}
                      className="h-12 flex-1 rounded-2xl bg-[#5427D7] text-white hover:bg-[#5427D7]/90"
                    >
                      View Campaign
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => onOpenSubmissions(card.id)}
                      className="h-12 flex-1 rounded-2xl border-[#DADADA] bg-white hover:bg-[#F8F8F8]"
                    >
                      Submissions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
