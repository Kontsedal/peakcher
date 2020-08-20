import axios from "axios";
import { CONFIG } from "../../config";

export class DropboxService {
  public static authenticate(code: string): Promise<string> {
    return axios
      .post(
        CONFIG.DROPBOX_AUTH_PROXY_URL,
        {
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        return response.data.token;
      });
  }

  public static uploadFile(params: {
    fileName: string;
    onProgress?: (event) => void;
    file: Blob;
    token: string;
    makePublic: boolean;
  }): Promise<{ publicUrl: string; name: string; path: string; size: number }> {
    return axios
      .post("https://content.dropboxapi.com/2/files/upload", params.file, {
        headers: {
          Authorization: `Bearer ${params.token}`,
          "Content-Type": `application/octet-stream`,
          "Dropbox-API-Arg": JSON.stringify({
            path: `/${params.fileName}`,
            mode: "overwrite",
            autorename: false,
            mute: false,
            strict_conflict: false,
          }),
        },
        onUploadProgress: params.onProgress,
      })
      .then(async (response) => {
        if (params.makePublic) {
          return DropboxService.shareFile({
            filePath: `/${params.fileName}`,
            token: params.token,
          });
        }
        return response.data;
      });
  }

  public static async downloadFile<T>({
    fileName,
    token,
  }: {
    fileName: string;
    token: string;
  }): Promise<T> {
    return axios
      .get("https://content.dropboxapi.com/2/files/download", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `application/octet-stream`,
          "Dropbox-API-Arg": JSON.stringify({
            path: `/${fileName}`,
          }),
        },
      })
      .then((res) => res.data);
  }

  public static async createFolderIfDoesntExist({
    path,
    token,
  }: {
    path: string;
    token: string;
  }): Promise<void> {
    const folderExists = await DropboxService.doesPathExist({ path, token });
    if (!folderExists) {
      await DropboxService.createFolder({ path, token });
    }
  }

  public static async doesPathExist({
    path,
    token,
  }: {
    path: string;
    token: string;
  }): Promise<boolean> {
    try {
      await DropboxService.getMetadata({ path, token });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static getMetadata({
    path,
    token,
  }: {
    path: string;
    token: string;
  }): Promise<Record<string, unknown>> {
    const data = {
      path: `/${path}`,
      include_media_info: true,
      include_deleted: false,
      include_has_explicit_shared_members: false,
    };
    return axios
      .post("https://api.dropboxapi.com/2/files/get_metadata", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `application/json`,
        },
      })
      .then((response) => response.data);
  }

  public static deleteFile({
    path,
    token,
  }: {
    path: string;
    token: string;
  }): Promise<void> {
    return axios
      .post(
        "https://api.dropboxapi.com/2/files/delete_v2",
        {
          path,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `application/json`,
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          throw response.data.error;
        }
        return response.data;
      });
  }

  public static createFolder(params: {
    token: string;
    path: string;
  }): Promise<void> {
    return axios
      .post(
        "https://api.dropboxapi.com/2/files/create_folder_v2",
        {
          path: `/${params.path}`,
          autorename: false,
        },
        {
          headers: {
            Authorization: `Bearer ${params.token}`,
            "Content-Type": `application/json`,
          },
        }
      )
      .then((response) => response.data);
  }

  public static shareFile(params: {
    token: string;
    filePath: string;
  }): Promise<{
    publicUrl: string;
    name: string;
    path: string;
    size: number;
  }> {
    return axios
      .post(
        "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        {
          path: params.filePath,
          settings: {
            requested_visibility: "public",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${params.token}`,
            "Content-Type": `application/json`,
          },
        }
      )
      .then((response) => response.data)
      .then((response) => {
        return {
          publicUrl: response.url.replace(/0$/, 1),
          name: response.name,
          path: response.path_lower,
          size: response.size,
        };
      });
  }

  public static getSpaceUsage({
    token,
  }: {
    token: string;
  }): Promise<{
    total: number;
    used: number;
  }> {
    return axios({
      method: "POST",
      url: "https://api.dropboxapi.com/2/users/get_space_usage",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then((response) => {
        return {
          total: response.allocation.allocated,
          used: response.used,
        };
      });
  }
}
