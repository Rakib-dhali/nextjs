import { IVideo } from "@/models/video.model";

export type VideoFormData = Omit<IVideo, "id" | "url" | "createdAt">;
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(endPoint: string, options?: FetchOptions): Promise<T> {
    const { method = "GET", body, headers = {} } = options || {};
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    const res = await fetch(`/api/${endPoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error((await res.text()) || "API request failed");
    }

    return res.json();
  }

  async getVideos() {
    return this.fetch("/videos");
  }
  async createVideo(data: IVideo) {
    return this.fetch("/videos", {
      method: "POST",
      body: data,
    });
  }
}

export const apiClient = new ApiClient();
