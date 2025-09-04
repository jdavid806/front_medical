import { useRef, useState } from "react";

export const useFileInput = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (newFile: File | null) => {
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
    }
}
