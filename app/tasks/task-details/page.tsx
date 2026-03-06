"use client";

import { useSearchParams } from "next/navigation";
import TaskEditor from "@/components/taskEditor";

export default function TasksUploadPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId") ?? undefined;

  return <TaskEditor mode="create" taskId={taskId} />;
}

