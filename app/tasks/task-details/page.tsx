import TaskEditor from "@/components/taskEditor";

type TaskDetailsPageProps = {
  searchParams?: {
    taskId?: string | string[];
  };
};

export default function TasksUploadPage({ searchParams }: TaskDetailsPageProps) {
  const taskIdParam = searchParams?.taskId;
  const taskId = Array.isArray(taskIdParam) ? taskIdParam[0] : taskIdParam;

  return <TaskEditor mode="create" taskId={taskId} />;
}
