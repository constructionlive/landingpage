"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";

type BlogEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  onError?: (message: string) => void;
};

function ToolButton({
  label,
  active = false,
  onClick,
  disabled = false,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      onClick={onClick}
      disabled={disabled}
      className={`rounded border px-2 py-1 text-xs transition ${
        active ? "border-do-orange bg-do-orange text-white" : "border-do-border hover:bg-do-bg-light/50"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

export default function BlogEditor({ value, onChange, onUploadImage, onError }: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        autolink: true,
        openOnClick: true,
      }),
      Image,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Placeholder.configure({
        placeholder: "Write your post content...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-72 rounded-b-md border border-t-0 bg-do-bg-card px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  async function handleImageUpload(file: File) {
    try {
      setIsUploadingImage(true);
      const url = await onUploadImage(file);
      if (!editor) return;
      const alt = window.prompt("Enter alt text for this image (for accessibility)", "") ?? "";
      editor.chain().focus().setImage({ src: url, alt: alt.trim() }).run();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed.";
      onError?.(message);
    } finally {
      setIsUploadingImage(false);
    }
  }

  function insertLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function insertYoutubeVideo() {
    if (!editor) return;
    const url = window.prompt("Enter YouTube URL", "https://www.youtube.com/watch?v=");
    if (!url || !url.trim()) return;
    editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
  }

  if (!editor) {
    return <p className="text-sm text-do-text-secondary">Loading editor...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-md border bg-do-bg-card p-2">
        <ToolButton
          label="B"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolButton
          label="I"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolButton
          label="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolButton label="Link" active={editor.isActive("link")} onClick={insertLink} />
        <ToolButton label="YouTube" onClick={insertYoutubeVideo} />
        <ToolButton label="Image URL" onClick={() => {
          const url = window.prompt("Enter image URL", "https://");
          if (!url || !url.trim()) return;
          const alt = window.prompt("Enter alt text (for accessibility)", "") ?? "";
          editor.chain().focus().setImage({ src: url.trim(), alt: alt.trim() }).run();
        }} />
        <ToolButton
          label="Upload Image"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          await handleImageUpload(file);
          event.target.value = "";
        }}
      />
      <EditorContent editor={editor} />
      {isUploadingImage ? (
        <p className="mt-2 text-xs text-do-text-secondary">Uploading image...</p>
      ) : null}
    </div>
  );
}
