import { AxiosProgressEvent } from "axios";

export interface IUploadFile {
  data: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}
