export const extractFileNameFormUrl = (url: string) => {
  const urlObj = new URL(url);
  const pathName = urlObj.pathname;
  const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
  return fileName;
}

export const base64ToBlob = (base64Data: string, contentType: string) => {
  const byteString = atob(base64Data.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: contentType });
};