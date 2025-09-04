// hooks/useVideoTutorialCategories.ts
import { useState, useEffect } from "react";
import { manualUsuarioVideoService } from "../../../services/api";

interface Video {
  id: number;
  category_id: number;
  title: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  videos: Video[];
}

export const useManualUsuarioVideoCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await manualUsuarioVideoService.getAllCategoriesWithVideos();
      console.log("Respuesta APII:", res);
      setCategories(res?.data || []);
    } catch (error) {
      console.error("Error fetching video tutorial categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: any) => {
    const res = await manualUsuarioVideoService.createCategory(category);
    const newCategory = res.data;
    setCategories((prev) => [...prev, { ...newCategory, videos: [] }]);
    return newCategory;
  };

  const addVideo = async (video: any) => {
    const res = await manualUsuarioVideoService.createVideo(video);
    const newVideo = res.data;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === newVideo.category_id
          ? { ...cat, videos: [...cat.videos, newVideo] }
          : cat
      )
    );
    return newVideo;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    addVideo,
    refetch: fetchCategories,
  };
};
