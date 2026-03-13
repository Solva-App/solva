"use client";

import React from "react";

type ConfirmActionModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger" | "success";
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const toneStyles = {
  default: {
    accent: "#6911b0",
    shadow: "rgba(105, 17, 176, 0.2)",
  },
  danger: {
    accent: "#d62f2f",
    shadow: "rgba(214, 47, 47, 0.2)",
  },
  success: {
    accent: "#16873a",
    shadow: "rgba(22, 135, 58, 0.2)",
  },
} as const;

export default function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  busy = false,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  const currentTone = toneStyles[tone];

  return (
    <div className="overlay" role="presentation" onClick={busy ? undefined : onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="accent" />
        <h2 id="confirm-action-title" className="title">
          {title}
        </h2>
        <p className="message">{message}</p>

        <div className="actions">
          <button type="button" className="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="primary"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(10, 8, 18, 0.4);
          backdrop-filter: blur(8px);
        }

        .dialog {
          width: min(100%, 420px);
          background: linear-gradient(180deg, #ffffff 0%, #f6f1fb 100%);
          border: 1px solid rgba(105, 17, 176, 0.12);
          border-radius: 24px;
          box-shadow: 0 24px 70px ${currentTone.shadow};
          padding: 22px;
        }

        .accent {
          width: 56px;
          height: 6px;
          border-radius: 999px;
          background: ${currentTone.accent};
          margin-bottom: 18px;
        }

        .title {
          margin: 0 0 10px;
          color: #17111f;
          font-size: 1.3rem;
          font-weight: 900;
        }

        .message {
          margin: 0;
          color: rgba(23, 17, 31, 0.72);
          font-size: 0.96rem;
          line-height: 1.6;
        }

        .actions {
          margin-top: 22px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .secondary,
        .primary {
          min-width: 112px;
          height: 44px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }

        .secondary {
          border: 1px solid rgba(23, 17, 31, 0.14);
          background: #fff;
          color: #17111f;
        }

        .primary {
          border: none;
          background: ${currentTone.accent};
          color: #fff;
          box-shadow: 0 14px 28px ${currentTone.shadow};
        }

        .secondary:hover,
        .primary:hover {
          transform: translateY(-1px);
        }

        .secondary:disabled,
        .primary:disabled {
          cursor: not-allowed;
          opacity: 0.65;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 640px) {
          .dialog {
            padding: 20px;
            border-radius: 20px;
          }

          .actions {
            flex-direction: column-reverse;
          }

          .secondary,
          .primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
