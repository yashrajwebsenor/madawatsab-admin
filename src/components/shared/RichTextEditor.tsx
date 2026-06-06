import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { clsx } from "clsx";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
];

const RichTextEditor = ({
  value,
  onChange,
  label,
  placeholder,
  isInvalid,
  errorMessage,
}: RichTextEditorProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-small font-medium text-foreground pb-0.5">
          {label}
        </label>
      )}
      <div
        className={clsx(
          "relative flex flex-col gap-2 rounded-medium transition-colors-opacity",
          isInvalid ? "quill-invalid" : ""
        )}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className={clsx(
            "bg-default-100 hover:bg-default-200 rounded-medium overflow-hidden border-2 border-transparent transition-all",
            isInvalid && "border-danger bg-danger-50 hover:bg-danger-100"
          )}
        />
      </div>
      {isInvalid && errorMessage && (
        <div className="text-tiny text-danger">{errorMessage}</div>
      )}
      <style>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          padding: 8px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 200px;
          font-family: inherit !important;
          font-size: 14px !important;
        }
        .ql-editor {
          min-height: 200px;
        }
        .ql-editor.ql-blank::before {
          color: #a1a1aa !important;
          font-style: normal !important;
        }
        .quill-invalid .ql-toolbar.ql-snow {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
