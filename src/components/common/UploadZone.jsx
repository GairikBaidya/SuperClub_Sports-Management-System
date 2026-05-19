import { useCallback, useRef, useState } from 'react';

/**
 * UploadZone — drag-drop + click file upload with preview.
 * Props:
 *   accept        string  — e.g. "image/*" or ".pdf,image/*"
 *   maxSizeMB     number  — max file size in MB
 *   onFile        fn(File) — called when valid file selected
 *   file          File|null — current file (controlled)
 *   error         string  — error message
 *   label         string  — zone title
 *   multiple      bool    — allow multiple files (default false)
 *   isUploading   bool    — show progress spinner
 */
export default function UploadZone({
  accept = 'image/*,.pdf',
  maxSizeMB = 2,
  onFile,
  file,
  error,
  label = 'Upload Document',
  isUploading = false,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((selected) => {
    if (!selected) return;
    const sizeMB = selected.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      onFile(null, `File exceeds ${maxSizeMB} MB limit. Please choose a smaller file.`);
      return;
    }
    onFile(selected, null);
  }, [maxSizeMB, onFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const isImage = file && file.type?.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div>
      {!file ? (
        <div
          className={`upload-zone ${isDragging ? 'drag-over' : ''}`}
          style={error ? { borderColor: 'rgba(200,16,46,0.4)', background: 'rgba(200,16,46,0.04)' } : {}}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gold-dim)' }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="var(--gold)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Drag & drop or <span className="font-medium" style={{ color: 'var(--gold)' }}>browse</span> · Max {maxSizeMB} MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl p-3 flex items-center gap-3" style={{ border: '1px solid var(--border-dim)', background: 'rgba(255,255,255,0.03)' }}>
          {isUploading && (
            <div className="absolute inset-0 rounded-xl flex items-center justify-center z-10" style={{ background: 'rgba(6,8,16,0.8)' }}>
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          )}
          {/* Preview */}
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              style={{ border: '1px solid var(--border-dim)' }}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.2)' }}>
              <svg className="w-7 h-7" fill="#FF4466" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFile(null, null); }}
            className="flex-shrink-0 p-1.5 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {error && (
        <p className="form-error mt-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
