export type TaskDraftAssets = {
  logoFile: File | null;
  logoPreview: string | null;
  imageFile: File | null;
  imagePreview: string | null;
};

const EMPTY_DRAFT_ASSETS: TaskDraftAssets = {
  logoFile: null,
  logoPreview: null,
  imageFile: null,
  imagePreview: null,
};

let taskDraftAssets: TaskDraftAssets = { ...EMPTY_DRAFT_ASSETS };

export function getTaskDraftAssets(): TaskDraftAssets {
  return { ...taskDraftAssets };
}

export function setTaskDraftAsset(kind: "logo" | "image", file: File) {
  const previewUrl = URL.createObjectURL(file);

  if (kind === "logo" && taskDraftAssets.logoPreview) {
    URL.revokeObjectURL(taskDraftAssets.logoPreview);
  }

  if (kind === "image" && taskDraftAssets.imagePreview) {
    URL.revokeObjectURL(taskDraftAssets.imagePreview);
  }

  taskDraftAssets =
    kind === "logo"
      ? { ...taskDraftAssets, logoFile: file, logoPreview: previewUrl }
      : { ...taskDraftAssets, imageFile: file, imagePreview: previewUrl };

  return getTaskDraftAssets();
}

export function clearTaskDraftAssets() {
  if (taskDraftAssets.logoPreview) {
    URL.revokeObjectURL(taskDraftAssets.logoPreview);
  }

  if (taskDraftAssets.imagePreview) {
    URL.revokeObjectURL(taskDraftAssets.imagePreview);
  }

  taskDraftAssets = { ...EMPTY_DRAFT_ASSETS };
}
