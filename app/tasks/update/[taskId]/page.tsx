"use client";

import { useParams } from "next/navigation";
import TaskEditor from "@/components/taskEditor"; // adjust path if needed

export default function Page() {
  const params = useParams<{ taskId: string }>();
  return <TaskEditor mode="update" taskId={params.taskId} />;
}

