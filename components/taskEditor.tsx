"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";

type CreateTaskState = {
  overviewTitle: string;
  overviewBody: string;

  mustInclude: string[];

  contentGuidelinesTitle: string;
  contentGuidelines: string[];

  selectionCriteriaTitle: string;
  selectionCriteriaBody: string;

  howToSubmitTitle: string;
  howToSubmitBody: string;

  // optional if your backend returns it
  creativeImageUrl?: string | null;
};

type EditKey =
  | "overview"
  | "include_0"
  | "include_1"
  | "include_2"
  | "guidelines"
  | "selection"
  | "submit";

const DEFAULT: CreateTaskState = {
  overviewTitle: "Task Overview",
  overviewBody:
    "Create engaging and original content that promotes Product Name, clearly explaining what it does, its benefits, and encouraging people to take action.",
  mustInclude: [
    "Clear mention of the product name",
    "What the product does",
    "At least 3 key benefits",
  ],
  contentGuidelinesTitle: "Content Guidelines",
  contentGuidelines: [
    "Content Type: Video / Image / Text (as specified)",
    "Length: 30–60 seconds (video) OR 150–300 words (text)",
    "Language: English (Pidgin allowed if specified)",
    "Original Content Only (No reposts or plagiarism)",
    "Content must be clear, creative, and well-presented",
  ],
  selectionCriteriaTitle: "Selection Criteria",
  selectionCriteriaBody: "",
  howToSubmitTitle: "How to submit",
  howToSubmitBody: "",
  creativeImageUrl: null,
};

// ✅ Your endpoints
const API = {
  create: "/tasks/create", // POST
  // IMPORTANT: keep the leading slash so calls don't become relative URLs like
  // /tasks/create/tasks/:id (which breaks PATCH/GET and makes clicks look like "nothing happens").
  byId: (id: string) => `/tasks/${id}`, // GET + PATCH + DELETE
};

function mapApiToState(api: any): CreateTaskState {
  // Adjust these mappings ONLY if your backend field names differ.
  return {
    overviewTitle: api?.overviewTitle ?? DEFAULT.overviewTitle,
    overviewBody: api?.overviewBody ?? DEFAULT.overviewBody,
    mustInclude: Array.isArray(api?.mustInclude) ? api.mustInclude : DEFAULT.mustInclude,
    contentGuidelinesTitle:
      api?.contentGuidelinesTitle ?? DEFAULT.contentGuidelinesTitle,
    contentGuidelines: Array.isArray(api?.contentGuidelines)
      ? api.contentGuidelines
      : DEFAULT.contentGuidelines,
    selectionCriteriaTitle:
      api?.selectionCriteriaTitle ?? DEFAULT.selectionCriteriaTitle,
    selectionCriteriaBody:
      api?.selectionCriteriaBody ?? DEFAULT.selectionCriteriaBody,
    howToSubmitTitle: api?.howToSubmitTitle ?? DEFAULT.howToSubmitTitle,
    howToSubmitBody: api?.howToSubmitBody ?? DEFAULT.howToSubmitBody,
    creativeImageUrl: api?.creativeImageUrl ?? null,
  };
}

export default function TaskEditor({
  mode,
  taskId: taskIdProp,
}: {
  mode: "create" | "update";
  taskId?: string;
}) {
  const router = useRouter();

  const [data, setData] = useState<CreateTaskState>(DEFAULT);
  const [editing, setEditing] = useState<EditKey | null>(null);
  const [saving, setSaving] = useState<
    EditKey | "image" | "create" | "upload" | null
  >(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "update");

  // When in create mode, we will create once, then redirect to update route and continue patching.
  const [createdId, setCreatedId] = useState<string | null>(null);
  const taskId = mode === "update" ? taskIdProp ?? null : createdId;

  const [creativePreview, setCreativePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const includeCards = useMemo(
    () => data.mustInclude.map((text, idx) => ({ text, idx })),
    [data.mustInclude]
  );

  // ✅ Load task in update mode
  useEffect(() => {
    if (mode !== "update") return;
    if (!taskIdProp) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setMsg(null);

        const res = await fetch(API.byId(taskIdProp), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();

        if (!alive) return;
        setData(mapApiToState(json));
      } catch (e: any) {
        if (!alive) return;
        setMsg(e?.message ?? "Failed to load task");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [mode, taskIdProp]);

  function toggle(key: EditKey) {
    setMsg(null);
    setEditing((prev) => (prev === key ? null : key));
  }

  async function createTaskIfNeeded(opts?: { redirectToUpdate?: boolean }): Promise<string> {
    if (taskId) return taskId;

    setSaving("create");
    setMsg(null);

    const res = await fetch(API.create, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setSaving(null);
      throw new Error((await res.text()) || "Failed to create task");
    }

    const created = await res.json();
    const id =
      created?.id ??
      created?.taskId ??
      created?._id ??
      created?.data?.id ??
      created?.data?.taskId ??
      created?.data?._id;

    if (!id) {
      setSaving(null);
      throw new Error("Task created but no id returned from backend");
    }

    setCreatedId(id);
    setSaving(null);

    // Default: move to update route so everything is now “updating that task”.
    // But when the user clicks Upload (or uploads creative), we MUST NOT redirect
    // away before we finish saving + navigating.
    if (opts?.redirectToUpdate !== false) {
      router.replace(`/tasks/update/${id}`);
    }

    return id;
  }

  async function patchTask(id: string, payload: any) {
    const res = await fetch(API.byId(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error((await res.text()) || "Failed to update task");
  }

  async function patchAll(id: string) {
    await patchTask(id, {
      overviewTitle: data.overviewTitle,
      overviewBody: data.overviewBody,
      mustInclude: data.mustInclude,
      contentGuidelinesTitle: data.contentGuidelinesTitle,
      contentGuidelines: data.contentGuidelines,
      selectionCriteriaTitle: data.selectionCriteriaTitle,
      selectionCriteriaBody: data.selectionCriteriaBody,
      howToSubmitTitle: data.howToSubmitTitle,
      howToSubmitBody: data.howToSubmitBody,
    });
  }

  async function saveSection(key: EditKey) {
    setMsg(null);
    setSaving(key);

    try {
      const id = await createTaskIfNeeded();

      let payload: any = {};

      if (key === "overview") {
        payload = { overviewTitle: data.overviewTitle, overviewBody: data.overviewBody };
      }

      if (key.startsWith("include_")) {
        payload = { mustInclude: data.mustInclude };
      }

      if (key === "guidelines") {
        payload = {
          contentGuidelinesTitle: data.contentGuidelinesTitle,
          contentGuidelines: data.contentGuidelines,
        };
      }

      if (key === "selection") {
        payload = {
          selectionCriteriaTitle: data.selectionCriteriaTitle,
          selectionCriteriaBody: data.selectionCriteriaBody,
        };
      }

      if (key === "submit") {
        payload = {
          howToSubmitTitle: data.howToSubmitTitle,
          howToSubmitBody: data.howToSubmitBody,
        };
      }

      await patchTask(id, payload);
      setMsg("Saved");
    } catch (e: any) {
      setMsg(e?.message ?? "Save failed");
    } finally {
      setSaving(null);
    }
  }

  function pickCreative() {
    imageInputRef.current?.click();
  }

  async function onCreativeSelected(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg("Please select an image file.");
      return;
    }

    // preview
    const preview = URL.createObjectURL(file);
    if (creativePreview) URL.revokeObjectURL(creativePreview);
    setCreativePreview(preview);

    setSaving("image");
    setMsg(null);

    try {
      // Don't redirect away while the user is uploading a creative.
      const id = await createTaskIfNeeded({ redirectToUpdate: false });

      const fd = new FormData();
      fd.append("creativeImage", file); // change key if backend expects another

      const res = await fetch(API.byId(id), {
        method: "PATCH",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) throw new Error((await res.text()) || "Upload failed");

      setMsg("Uploaded");
    } catch (e: any) {
      setMsg(e?.message ?? "Upload failed");
    } finally {
      setSaving(null);
    }
  }

  async function onUpload() {
    setMsg(null);
    setSaving("upload");

    try {
      // Don't redirect away before we can finish saving + navigating.
      const id = await createTaskIfNeeded({ redirectToUpdate: false });

      // save latest values even if user didn’t blur inputs
      await patchAll(id);

      // Pass the taskId so the upload page can load the correct task.
      // If your upload route is dynamic instead (e.g. /tasks/upload/[taskId]),
      // change this to: router.push(`/tasks/upload/${id}`)
      router.push(`/tasks/upload?taskId=${encodeURIComponent(id)}`);
    } catch (e: any) {
      setMsg(e?.message ?? "Upload failed");
    } finally {
      setSaving(null);
    }
  }

  return (
    <SideNav>
      <div className="page">
        <div className="headerRow">
          <button className="backBtn" aria-label="Back" onClick={() => router.back()}>
            ←
          </button>
          <div className="headerTitles">
            <div className="hTitle left">Manage Task</div>
            <div className="hTitle right">Approve Task</div>
          </div>
        </div>

        <div className="lineWrap">
          <span className="dot" />
          <div className="line" />
          <span className="dot" />
        </div>

        {msg ? <div className="status">{msg}</div> : <div className="status spacer" />}

        <div className="grid">
          {/* LEFT COLUMN */}
          <div className="colLeft">
            {/* Task Overview card */}
            <div className="card big">
              <div className="cardHead">
                {editing === "overview" ? (
                  <input
                    className="titleInput"
                    value={data.overviewTitle}
                    onChange={(e) => setData((p) => ({ ...p, overviewTitle: e.target.value }))}
                    onBlur={() => saveSection("overview")}
                  />
                ) : (
                  <div className="cardTitle">{data.overviewTitle}</div>
                )}

                <button className="pencil" onClick={() => toggle("overview")}>
                  {saving === "overview" ? "…" : "✎"}
                </button>
              </div>

              {editing === "overview" ? (
                <textarea
                  className="textArea"
                  value={data.overviewBody}
                  onChange={(e) => setData((p) => ({ ...p, overviewBody: e.target.value }))}
                  onBlur={() => saveSection("overview")}
                />
              ) : (
                <div className="cardText">{data.overviewBody}</div>
              )}
            </div>

            {/* What must include */}
            <div className="card block">
              <div className="blockTitle">What Your Content Must Include</div>

              <div className="includeList">
                {includeCards.map(({ text, idx }) => {
                  const key = `include_${idx}` as EditKey;
                  const isEdit = editing === key;

                  return (
                    <div className="includeItem" key={idx}>
                      {isEdit ? (
                        <input
                          className="includeInput"
                          value={data.mustInclude[idx]}
                          onChange={(e) => {
                            const next = [...data.mustInclude];
                            next[idx] = e.target.value;
                            setData((p) => ({ ...p, mustInclude: next }));
                          }}
                          onBlur={() => saveSection(key)}
                        />
                      ) : (
                        <div className="includeText">{text}</div>
                      )}

                      <button className="miniPencil" onClick={() => toggle(key)}>
                        {saving === key ? "…" : "✎"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Creative image + pencil */}
            <div className="creativeRow">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => onCreativeSelected(e.target.files?.[0] ?? null)}
              />

              <div className="creativeCard">
                {creativePreview || data.creativeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(creativePreview ?? data.creativeImageUrl) as string}
                    alt="Creative preview"
                    className="creativeImg"
                  />
                ) : (
                  <div className="creativePlaceholder" />
                )}
              </div>

              <button className="miniPencil" onClick={pickCreative} aria-label="Upload creative">
                {saving === "image" ? "…" : "✎"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="colRight">
            {/* Content Guidelines */}
            <div className="card big">
              <div className="cardHead">
                {editing === "guidelines" ? (
                  <input
                    className="titleInput"
                    value={data.contentGuidelinesTitle}
                    onChange={(e) =>
                      setData((p) => ({ ...p, contentGuidelinesTitle: e.target.value }))
                    }
                    onBlur={() => saveSection("guidelines")}
                  />
                ) : (
                  <div className="cardTitle muted">{data.contentGuidelinesTitle}</div>
                )}

                <button className="pencil" onClick={() => toggle("guidelines")}>
                  {saving === "guidelines" ? "…" : "✎"}
                </button>
              </div>

              <ul className="bullets">
                {data.contentGuidelines.map((b, i) =>
                  editing === "guidelines" ? (
                    <li key={i}>
                      <input
                        className="bulletInput"
                        value={b}
                        onChange={(e) => {
                          const next = [...data.contentGuidelines];
                          next[i] = e.target.value;
                          setData((p) => ({ ...p, contentGuidelines: next }));
                        }}
                        onBlur={() => saveSection("guidelines")}
                      />
                    </li>
                  ) : (
                    <li key={i}>{b}</li>
                  )
                )}
              </ul>
            </div>

            {/* Selection Criteria */}
            <div className="card small">
              <div className="cardHead">
                <div className="cardTitle">{data.selectionCriteriaTitle}</div>
                <button className="pencil" onClick={() => toggle("selection")}>
                  {saving === "selection" ? "…" : "✎"}
                </button>
              </div>

              {editing === "selection" ? (
                <textarea
                  className="textArea smallArea"
                  value={data.selectionCriteriaBody}
                  onChange={(e) => setData((p) => ({ ...p, selectionCriteriaBody: e.target.value }))}
                  onBlur={() => saveSection("selection")}
                />
              ) : null}
            </div>

            {/* How to submit */}
            <div className="card small">
              <div className="cardHead">
                <div className="cardTitle">{data.howToSubmitTitle}</div>
                <button className="pencil" onClick={() => toggle("submit")}>
                  {saving === "submit" ? "…" : "✎"}
                </button>
              </div>

              {editing === "submit" ? (
                <textarea
                  className="textArea smallArea"
                  value={data.howToSubmitBody}
                  onChange={(e) => setData((p) => ({ ...p, howToSubmitBody: e.target.value }))}
                  onBlur={() => saveSection("submit")}
                />
              ) : null}
            </div>

            <button
              className="uploadBtn"
              onClick={onUpload}
              type="button"
              disabled={saving === "upload"}
            >
              {saving === "upload" ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ This is your create page styles only (no upload-list css mixed in) */}
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
          grid-template-columns: 1fr 1fr;
          gap: 26px;
          align-items: start;
        }

        .colLeft,
        .colRight {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
          padding: 16px 18px;
        }

        .card.big {
          min-height: 140px;
        }

        .card.small {
          padding: 14px 18px;
          border-radius: 14px;
        }

        .cardHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .cardTitle {
          font-weight: 700;
          font-size: 15px;
          color: #111;
        }

        .cardTitle.muted {
          color: rgba(0, 0, 0, 0.5);
          font-weight: 600;
        }

        .pencil {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
        }

        .cardText {
          margin-top: 10px;
          color: rgba(0, 0, 0, 0.55);
          font-size: 14px;
          line-height: 1.35;
        }

        .titleInput {
          border: none;
          outline: none;
          font-weight: 700;
          font-size: 15px;
          width: 100%;
          background: transparent;
        }

        .textArea {
          margin-top: 10px;
          width: 100%;
          min-height: 80px;
          border: none;
          outline: none;
          resize: vertical;
          background: transparent;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          line-height: 1.35;
        }

        .textArea.smallArea {
          min-height: 70px;
        }

        .blockTitle {
          font-weight: 700;
          color: rgba(0, 0, 0, 0.45);
          margin-bottom: 10px;
        }

        .includeList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .includeItem {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .includeText {
          color: rgba(0, 0, 0, 0.55);
          font-weight: 600;
          font-size: 13px;
        }

        .includeInput {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: rgba(0, 0, 0, 0.65);
          font-weight: 600;
          font-size: 13px;
        }

        .miniPencil {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: grid;
          place-items: center;
        }

        .bullets {
          margin-top: 10px;
          padding-left: 18px;
          color: rgba(0, 0, 0, 0.55);
          font-size: 13px;
          line-height: 1.35;
        }

        .bulletInput {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: rgba(0, 0, 0, 0.65);
          font-size: 13px;
          padding: 2px 0;
        }

        .creativeRow {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 12px;
          margin-top: 2px;
        }

        .creativeCard {
          width: 220px;
          height: 110px;
          border-radius: 14px;
          overflow: hidden;
          background: #e9e9e9;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
          display: grid;
          place-items: center;
        }

        .creativePlaceholder {
          width: 100%;
          height: 100%;
          background: #e9e9e9;
        }

        .creativeImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .uploadBtn {
          margin-top: 6px;
          width: 180px;
          align-self: flex-end;
          padding: 14px 22px;
          border: none;
          border-radius: 12px;
          background: #5a189a;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </SideNav>
  );
}