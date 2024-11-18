import { AxiosProgressEvent } from "axios";
import { useEffect, useState } from "react";

export const useUploadProgress = () => {
  const [progressEvent, setProgressEvent] = useState<AxiosProgressEvent | null>(null);
  const [percentCompleted, setPercentCompleted] = useState(0);

  useEffect(() => {
    if(progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / Number(progressEvent.total));
      setPercentCompleted(percentCompleted);
    }
  }, [progressEvent]);

  const resetProgress = () => {
    setPercentCompleted(0);
  }

  return {
    percentCompleted,
    resetProgress,
    onUploadProgress: setProgressEvent
  }
}
