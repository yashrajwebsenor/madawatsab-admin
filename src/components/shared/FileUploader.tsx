import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud,
  FiX,
  FiImage,
  FiFileText,
  FiVideo,
} from "react-icons/fi";
import { Button } from "@heroui/react";
import REGEX from "@/utils/regex";

type AcceptType = "images" | "videos" | "documents" | "media";

type Props = {
  type: AcceptType;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  className?: string;
  canRemove?: boolean;
};

const FileUploader = ({
  type,
  value,
  onChange,
  className,
  canRemove,
}: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof value === "string" && value) {
      setPreview(value);
      const isVideoUrl =
        value.toLowerCase().includes("video/upload") ||
        value.match(REGEX.VIDEO);
      setIsVideo(!!isVideoUrl);
    } else if (value instanceof File) {
      const isVideoFile = value.type.startsWith("video/");
      setIsVideo(isVideoFile);
      if (value.type.startsWith("image/") || isVideoFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(value);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
      setIsVideo(false);
    }
  }, [value]);

  const accept = {
    images: "image/*",
    videos: "video/*",
    media: "image/*,video/*",
    documents:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }[type];

  const handleFileChange = (file: File | null) => {
    if (file) {
      const isVideoFile = file.type.startsWith("video/");
      setIsVideo(isVideoFile);

      if (file.type.startsWith("image/") || isVideoFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      onChange?.(file);
    } else {
      setPreview(null);
      setIsVideo(false);
      onChange?.(null);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    setPreview(null);
    setIsVideo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.(null);
  };

  const getIcon = () => {
    switch (type) {
      case "images":
        return <FiImage className="text-4xl text-primary" />;
      case "videos":
        return <FiVideo className="text-4xl text-primary" />;
      case "documents":
        return <FiFileText className="text-4xl text-primary" />;
      case "media":
        return <FiUploadCloud className="text-4xl text-primary" />;
      default:
        return <FiUploadCloud className="text-4xl text-primary" />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group rounded-2xl overflow-hidden border-2 border-divider aspect-video bg-content2 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {isVideo ? (
              <video
                src={preview}
                className="w-full h-full object-cover"
                loop
                controls
                playsInline
              />
            ) : type === "images" || (type === "media" && !isVideo) ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                {getIcon()}
                <span className="text-sm font-medium text-default-500">
                  File Selected
                </span>
              </div>
            )}

            {canRemove && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  size="md"
                  className="rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:bg-danger hover:text-white transition-all duration-300"
                  onPress={removeFile}
                >
                  <FiX size={20} />
                </Button>
              </div>
            )}

            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Ready to Upload
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer group
              border-2 border-dashed rounded-2xl p-12
              flex flex-col items-center justify-center gap-5
              transition-all duration-500
              ${
                isDragging
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--heroui-primary-rgb),0.2)]"
                  : "border-divider hover:border-primary/50 hover:bg-default-50/50 hover:shadow-md"
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept={accept}
              aria-label="Upload file"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />

            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-5 rounded-3xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/30 group-hover:shadow-lg">
                <FiUploadCloud size={36} />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Drop your file here
              </p>
              <p className="text-sm text-default-400 font-medium">
                or click to browse from your computer
              </p>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-default-100 border border-divider group-hover:border-primary/30 transition-colors duration-500">
              <p className="text-[10px] text-default-500 uppercase tracking-[0.2em] font-bold">
                {type === "media" ? "IMAGE/VIDEO" : type} ONLY • MAX 10MB
              </p>
            </div>

            {isDragging && (
              <motion.div
                layoutId="outline"
                className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
                initial={false}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
