"use client";

import React, { useMemo, useRef, useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";

type TaskForm = {
  companyName: string;
  campaign: string;
  campaignTitle: string;
  numberOfDays: string;
  numberOfPersons: string;
  amount: string;
};

type EditableFieldKey = keyof TaskForm;

const DEFAULT_FORM: TaskForm = {
  companyName: "",
  campaign: "",
  campaignTitle: "",
  numberOfDays: "",
  numberOfPersons: "",
  amount: "",
};

type UploadState = {
  logoFile: File | null;
  logoPreview: string | null;
  imageFile: File | null;
  imagePreview: string | null;
};

// ✅ Update these to match your working backend endpoints
const ENDPOINTS = {
  // Save a single text field (recommended)
  patchField: "/api/v1/admin/tasks", // e.g. PATCH /api/v1/admin/tasks  body: { companyName: "..." }

  // Upload logo/image (recommended)
  uploadAssets: "/api/v1/admin/tasks/assets", // e.g. POST multipart FormData
};

export default function TasksPage() {
  const router = useRouter();

  const [form, setForm] = useState<TaskForm>(DEFAULT_FORM);
  const [editing, setEditing] = useState<EditableFieldKey | null>(null);

  const [uploads, setUploads] = useState<UploadState>({
    logoFile: null,
    logoPreview: null,
    imageFile: null,
    imagePreview: null,
  });

  const [savingKey, setSavingKey] = useState<EditableFieldKey | "logo" | "image" | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

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

  function onChange(key: EditableFieldKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleEdit(key: EditableFieldKey) {
    setStatusMsg(null);
    setEditing((prev) => (prev === key ? null : key));
  }

  async function saveField(key: EditableFieldKey) {
    setStatusMsg(null);
    setSavingKey(key);

    try {
      // ✅ If your backend expects a different payload shape, adjust here.
      const body = { [key]: form[key] };

      const res = await fetch(ENDPOINTS.patchField, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save");
      }

      setStatusMsg("Saved");
    } catch (e: any) {
      setStatusMsg(e?.message ?? "Save failed");
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

    // Auto upload immediately (matches admin behavior)
    void uploadAsset(kind, file);
  }

  async function uploadAsset(kind: "logo" | "image", file: File) {
    setSavingKey(kind);

    try {
      const fd = new FormData();
      if (kind === "logo") fd.append("logo", file);
      if (kind === "image") fd.append("campaignImage", file);

      const res = await fetch(ENDPOINTS.uploadAssets, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      setStatusMsg("Uploaded");
    } catch (e: any) {
      setStatusMsg(e?.message ?? "Upload failed");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <SideNav>
      <div className="page">
        {/* Header */}
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

        {/* Subtle status (no big banners; keep UI clean) */}
        {statusMsg ? <div className="status">{statusMsg}</div> : <div className="status spacer" />}

        {/* Body */}
        <div className="grid">
          {/* LEFT FORM */}
          <div className="left">
            {fields.map((f) => {
              const isEditing = editing === f.key;
              const isSaving = savingKey === f.key;

              return (
                <div key={f.key} className="fieldBlock">
                  <div className="label">{f.label}</div>

                  <div className="inputShell">
                    <input
                      className="input"
                      value={form[f.key]}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      readOnly={!isEditing}
                      onBlur={() => {
                        if (isEditing) void saveField(f.key);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isEditing) {
                          (e.currentTarget as HTMLInputElement).blur();
                        }
                      }}
                    />

                    <button
                      type="button"
                      className="pencilBtn"
                      onClick={() => toggleEdit(f.key)}
                      aria-label={isEditing ? "Stop editing" : "Edit"}
                      title={isEditing ? "Stop editing" : "Edit"}
                    >
                      {isSaving ? "…" : "✎"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT APPROVE */}
          <div className="right">
            {/* hidden file inputs */}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange("logo", e.target.files?.[0] ?? null)}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange("image", e.target.files?.[0] ?? null)}
            />

            {/* Logo (circle) */}
            <div className="assetBlock">
              <div className="assetTitle">Logo</div>

              <div className="assetRow">
                <div className="logoCircle">
                  {uploads.logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={uploads.logoPreview} alt="Logo preview" className="imgFill" />
                  ) : null}
                </div>

                <button
                  className="assetPencil"
                  type="button"
                  onClick={() => onPickFile("logo")}
                  aria-label="Upload logo"
                  title="Upload logo"
                >
                  {savingKey === "logo" ? "…" : "✎"}
                </button>
              </div>
            </div>

            {/* Campaign image (square) */}
            <div className="assetBlock">
              <div className="assetTitle">Logo</div>

              <div className="assetRow">
                <div className="logoSquare">
                  {uploads.imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={uploads.imagePreview} alt="Image preview" className="imgFill" />
                  ) : null}
                </div>

                <button
                  className="assetPencil"
                  type="button"
                  onClick={() => onPickFile("image")}
                  aria-label="Upload image"
                  title="Upload image"
                >
                  {savingKey === "image" ? "…" : "✎"}
                </button>
              </div>
            </div>

           <button className="viewBtn" onClick={() => router.push(`/tasks/create`)}>
            View Task
          </button>

          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
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
          position: relative;
          margin-top: 10px;
          margin-bottom: 18px;
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
          display: inline-block;
        }

        .status {
          height: 18px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.55);
          margin-bottom: 8px;
        }
        .status.spacer {
          visibility: hidden;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 28px;
          align-items: start;
        }

        /* LEFT */
        .fieldBlock {
          margin-bottom: 22px;
        }

        .label {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #111;
        }

        .inputShell {
          position: relative;
          height: 56px;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 7px 16px rgba(0, 0, 0, 0.18);
          display: flex;
          align-items: center;
        }

        .input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          padding: 0 56px 0 18px;
          font-size: 16px;
          border-radius: 18px;
          color: #111;
        }

        .pencilBtn {
          position: absolute;
          right: 10px;
          width: 42px;
          height: 42px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #111;
        }

        /* RIGHT */
        .right {
          padding-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .assetBlock {
          width: 100%;
          max-width: 360px;
        }

        .assetTitle {
          font-size: 18px;
          font-weight: 700;
          text-align: right; /* matches screenshot */
          margin-bottom: 12px;
        }

        .assetRow {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
        }

        .logoCircle {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          background: #e9e9e9;
          overflow: hidden;
        }

        .logoSquare {
          width: 92px;
          height: 92px;
          border-radius: 14px;
          background: #e9e9e9;
          overflow: hidden;
        }

        .imgFill {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .assetPencil {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #111;
        }

        .viewBtn {
          margin-top: 8px;
          width: 180px;
          padding: 14px 22px;
          border: none;
          border-radius: 10px;
          background: #5a189a; /* matches UI purple */
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </SideNav>
  );
}
