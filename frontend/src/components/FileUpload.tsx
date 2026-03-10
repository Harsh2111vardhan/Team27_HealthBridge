import { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept: string;
  label: string;
  icon: "pdf" | "image";
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileUpload({ accept, label, icon, file, onFileChange }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) onFileChange(f);
    },
    [onFileChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) onFileChange(f);
    },
    [onFileChange]
  );

  const IconComponent = icon === "pdf" ? FileText : ImageIcon;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {file ? (
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={() => onFileChange(null)} className="text-muted-foreground hover:text-danger transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
          onClick={() => document.getElementById(`file-${label}`)?.click()}
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">{accept === ".pdf" ? "PDF files" : "JPG, PNG images"}</p>
          <input id={`file-${label}`} type="file" accept={accept} className="hidden" onChange={handleChange} />
        </div>
      )}
    </div>
  );
}
