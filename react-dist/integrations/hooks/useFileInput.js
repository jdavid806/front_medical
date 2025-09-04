import { useRef, useState } from "react";
export const useFileInput = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = newFile => {
    setFile(newFile);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    if (newFile) {
      setFileUrl(URL.createObjectURL(newFile));
    }
  };
  const previewFile = () => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
  };
  return {
    file,
    fileUrl,
    setFileUrl,
    fileInputRef,
    handleFileChange,
    previewFile
  };
};