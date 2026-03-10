"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SideNav from "@/components/sideNav";
import TaskNavButton from "@/components/TaskNav";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";

type TaskForm = {
  companyName: string;
  campaign: string;
  campaignTitle: string;
  numberOfDays: string;
  numberOfPersons: string;
  amount: string;
};

type EditableFieldKey = keyof TaskForm;

type UploadState = {
  logoFile: File | null;
  logoPreview: string | null;
  imageFile: File | null;
  imagePreview: string | null;
};

const DEFAULT_FORM: TaskForm = {
  companyName: "",
  campaign: "",
  campaignTitle: "",
  numberOfDays: "",
  numberOfPersons: "",
  amount: "",
};

const axiosInstance = createAxiosInstance();
const TASK_CREATE_DRAFT_KEY = "task-create-draft";

const API = {
  create: `${apis.task}/create`,
  byId: (id: string) => `${apis.task}/${id}`,
};

function extractId(payload: any): string | null {
  return (
    payload?.id ??
    payload?.taskId ??
    payload?._id ??
    payload?.data?.id ??
    payload?.data?.taskId ??
    payload?.data?._id ??
    null
  );
}

function readDraft(): TaskForm {
  if (typeof window === "undefined") return DEFAULT_FORM;

  const raw = window.sessionStorage.getItem(TASK_CREATE_DRAFT_KEY);
  if (!raw) return DEFAULT_FORM;

  try {
    return { ...DEFAULT_FORM, ...(JSON.parse(raw) as Partial<TaskForm>) };
  } catch {
    return DEFAULT_FORM;
  }
}

export default function TaskSetup() {
  const router = useRouter();

  const [form, setForm] = useState<TaskForm>(DEFAULT_FORM);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditableFieldKey | null>(null);
  const [savingKey, setSavingKey] = useState<
    EditableFieldKey | "logo" | "image" | null
  >(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadState>({
    logoFile: null,
    logoPreview: null,
    imageFile: null,
    imagePreview: null,
  });

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const fields = useMemo(
    () =>
      [
        { label: "Company name", key: "companyName" },
        { label: "Campaign", key: "campaign" },
        { label: "Campaign title", key: "campaignTitle" },
        { label: "Number of days", key: "numberOfDays" },
        { label: "Number of persons", key: "numberOfPersons" },
        { label: "Amount", key: "amount" },
      ] as const,
    []
  );

  useEffect(() => {
    setForm(readDraft());
  }, []);

  useEffect(() => {
    return () => {
      if (uploads.logoPreview) URL.revokeObjectURL(uploads.logoPreview);
      if (uploads.imagePreview) URL.revokeObjectURL(uploads.imagePreview);
    };
  }, [uploads.imagePreview, uploads.logoPreview]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(TASK_CREATE_DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  function onChange(key: EditableFieldKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleEdit(key: EditableFieldKey) {
    setStatusMsg(null);
    setEditing((prev) => (prev === key ? null : key));
  }

  async function ensureTaskId() {
    if (taskId) return taskId;

    const response = await axiosInstance.post(API.create, form);
    const id = extractId(response.data);

    if (!id) {
      throw new Error("Task created but no id was returned");
    }

    setTaskId(id);
    return id;
  }

  async function saveField(key: EditableFieldKey) {
    setStatusMsg(null);
    setSavingKey(key);

    try {
      const id = await ensureTaskId();
      await axiosInstance.patch(API.byId(id), { [key]: form[key] });
      setStatusMsg("Saved");
    } catch (e: any) {
      setStatusMsg(e?.response?.data?.message ?? e?.message ?? "Save failed");
    } finally {
      setSavingKey(null);
    }
  }

  function onPickFile(kind: "logo" | "image") {
    setStatusMsg(null);
    if (kind === "logo") logoInputRef.current?.click();
    if (kind === "image") imageInputRef.current?.click();
  }

  function handleFileChange(kind: "logo" | "image", file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatusMsg("Please select an image file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setUploads((prev) => {
      if (kind === "logo" && prev.logoPreview) URL.revokeObjectURL(prev.logoPreview);
      if (kind === "image" && prev.imagePreview) URL.revokeObjectURL(prev.imagePreview);

      return kind === "logo"
        ? { ...prev, logoFile: file, logoPreview: previewUrl }
        : { ...prev, imageFile: file, imagePreview: previewUrl };
    });

    void uploadAsset(kind, file);
  }

  async function uploadAsset(kind: "logo" | "image", file: File) {
    setSavingKey(kind);

    try {
      const id = await ensureTaskId();
      const fd = new FormData();

      if (kind === "logo") {
        fd.append("logo", file);
      }

      if (kind === "image") {
        fd.append("campaignImage", file);
        fd.append("creativeImage", file);
      }

      await axiosInstance.patch(API.byId(id), fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatusMsg("Uploaded");
    } catch (e: any) {
      setStatusMsg(e?.response?.data?.message ?? e?.message ?? "Upload failed");
    } finally {
      setSavingKey(null);
    }
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
              path={taskId ? `/submissions/tasks/${encodeURIComponent(taskId)}` : ""}
              align="right"
              disabled={!taskId}
            />
          </div>
        </div>

        <div className="lineWrap" aria-hidden>
          <span className="dot" />
          <div className="line" />
          <span className="dot" />
        </div>

        {statusMsg ? <div className="status">{statusMsg}</div> : <div className="status spacer" />}

        <div className="layout">
          <div className="leftCol">
            {fields.map((field) => {
              const isEditing = editing === field.key;
              const isSaving = savingKey === field.key;

              return (
                <div key={field.key} className="fieldBlock">
                  <label className="fieldLabel">{field.label}</label>

                  <div className="inputShell">
                    <input
                      className={`fieldInput ${isEditing ? "editable" : ""}`}
                      value={form[field.key]}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      readOnly={!isEditing}
                      onBlur={() => {
                        if (isEditing) void saveField(field.key);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isEditing) {
                          (e.currentTarget as HTMLInputElement).blur();
                        }
                      }}
                      placeholder={isEditing ? `Enter ${field.label.toLowerCase()}` : ""}
                    />

                    <button
                      type="button"
                      className="iconBtn"
                      onClick={() => toggleEdit(field.key)}
                      aria-label={isEditing ? `Stop editing ${field.label}` : `Edit ${field.label}`}
                    >
                      {isSaving ? "..." : <FiEdit2 />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rightCol">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hiddenInput"
              onChange={(e) => handleFileChange("logo", e.target.files?.[0] ?? null)}
            />

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hiddenInput"
              onChange={(e) => handleFileChange("image", e.target.files?.[0] ?? null)}
            />

            <div className="assetCard assetLogoCard">
              <div className="assetTitle">Logo</div>
              <div className="assetRow">
                <div className="logoCircle">
                  {uploads.logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={uploads.logoPreview} alt="Logo preview" className="imgFill" />
                  ) : (
                    <div className="logoPlaceholder">Logo</div>
                  )}
                </div>

                <button
                  type="button"
                  className="assetEditBtn"
                  onClick={() => onPickFile("logo")}
                  aria-label="Upload logo"
                >
                  {savingKey === "logo" ? "..." : <FiEdit2 />}
                </button>
              </div>
            </div>

            <div className="assetCard assetImageCard">
              <div className="assetTitle">Image</div>
              <div className="assetRow">
                <div className="imageSquare">
                  {uploads.imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={uploads.imagePreview} alt="Campaign preview" className="imgFill" />
                  ) : (
                    <div className="imagePlaceholder">Campaign image</div>
                  )}
                </div>

                <button
                  type="button"
                  className="assetEditBtn"
                  onClick={() => onPickFile("image")}
                  aria-label="Upload campaign image"
                >
                  {savingKey === "image" ? "..." : <FiEdit2 />}
                </button>
              </div>
            </div>

            <button
              className="viewTaskBtn"
              type="button"
              onClick={() =>
                router.push(
                  taskId
                    ? `/tasks/task-details?taskId=${encodeURIComponent(taskId)}`
                    : "/tasks/task-details"
                )
              }
            >
              View Task
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          padding: 22px 38px 28px;
          background: #ececec;
          min-height: 100%;
        }

        .headerRow {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .backBtn {
          width: 54px;
          height: 54px;
          border: none;
          background: transparent;
          color: #202020;
          font-size: 2rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          padding: 0;
        }

        .headerTitles {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          column-gap: 12px;
        }

        .headerTitles :global(.hTitle) {
          font-size: 1.95rem;
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
          margin: 8px 4px 12px;
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
          flex: none;
        }

        .status {
          height: 18px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
          margin: 0 4px 6px;
        }

        .status.spacer {
          visibility: hidden;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.65fr);
          gap: 34px;
          align-items: start;
        }

        .leftCol {
          padding: 0 8px;
        }

        .fieldBlock {
          margin-bottom: 18px;
        }

        .fieldLabel {
          display: block;
          font-size: 17px;
          font-weight: 500;
          color: #171717;
          margin-bottom: 10px;
        }

        .inputShell {
          height: 36px;
          border-radius: 18px;
          background: #f8f8f8;
          box-shadow: 0 4px 9px rgba(0, 0, 0, 0.16);
          position: relative;
          display: flex;
          align-items: center;
        }

        .fieldInput {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          outline: none;
          border-radius: 18px;
          padding: 0 52px 0 14px;
          font-size: 15px;
          color: #111;
          cursor: default;
        }

        .fieldInput.editable {
          cursor: text;
          background: #fff;
        }

        .fieldInput::placeholder {
          color: rgba(0, 0, 0, 0.3);
        }

        .iconBtn {
          position: absolute;
          right: 8px;
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          color: #111;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 14px;
          border-radius: 999px;
        }

        .rightCol {
          padding-top: 58px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .hiddenInput {
          display: none;
        }

        .assetCard {
          width: 100%;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .assetLogoCard {
          margin-top: 2px;
        }

        .assetTitle {
          font-size: 17px;
          font-weight: 500;
          color: #111;
          margin-bottom: 12px;
          text-align: right;
          width: 100%;
        }

        .assetRow {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          width: 100%;
        }

        .logoCircle {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          overflow: hidden;
          background: #d91e2b;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
          display: grid;
          place-items: center;
        }

        .logoPlaceholder {
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .imageSquare {
          width: 78px;
          height: 78px;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(145deg, #7a0a0f, #dc1e2c 45%, #5e0508);
          display: grid;
          place-items: center;
        }

        .imagePlaceholder {
          color: #fff;
          text-align: center;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.1;
          padding: 6px;
        }

        .assetEditBtn {
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          color: #111;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 14px;
          border-radius: 999px;
          flex: none;
        }

        .viewTaskBtn {
          margin-top: 10px;
          min-width: 154px;
          height: 48px;
          border: none;
          border-radius: 10px;
          background: #6f14a8;
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 12px rgba(111, 20, 168, 0.25);
        }

        .imgFill {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 1100px) {
          .layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .rightCol {
            padding-top: 4px;
            align-items: flex-start;
          }

          .assetCard {
            align-items: flex-start;
          }

          .assetTitle,
          .assetRow {
            justify-content: flex-start;
            text-align: left;
          }
        }
      `}</style>
    </SideNav>
  );
}
