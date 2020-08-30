import { CommunicationService } from "../common/services/Communication";
import { blobToBase64, getImageSizes } from "../utils/file";
import { Logger } from "../common/services/Logger";

declare global {
  interface Window {
    peakcherImageToUpload: string;
  }
}

async function main() {
  const imageUrl = window.peakcherImageToUpload;
  if (typeof imageUrl === "undefined") {
    return;
  }
  const sizes = await getImageSizes(imageUrl);
  const blob = await corsRequest(imageUrl).then((res) => res.blob());
  const base64 = await blobToBase64(blob);
  const file = {
    ...sizes,
    name: imageUrl,
    fileUrl: base64,
    url: imageUrl,
    type: blob.type,
    size: blob.size,
  };
  CommunicationService.uploadFiles({ files: [file], notifyUser: true });
}

main().catch((error) => {
  Logger.warn("Peakcher: Failed to upload image", error);
});

async function corsRequest(url) {
  const corsMirrors = [
    "https://yacdn.org/proxy/",
    "https://cors-anywhere.herokuapp.com/",
    "",
  ];
  return requestMirror();

  async function requestMirror() {
    const mirrorUrl = corsMirrors.pop();
    if (typeof mirrorUrl === "undefined") {
      throw new Error("Failed to load file using CORS proxies");
    }
    try {
      return await fetch(mirrorUrl + url);
    } catch (error) {
      return requestMirror();
    }
  }
}
