import axios, { AxiosInstance } from "axios";
import md5 from "js-md5";

export interface SubsonicConfig {
    baseUrl: string;
    username: string;
    password?: string; // Cleartext (legacy)
    token?: string; // Usually used for MD5 hash logic if pre-calculated, but let's stick to generating it.
    salt?: string;
    clientName?: string;
}

export class SubsonicClient {
    public config: SubsonicConfig;
    private axios: AxiosInstance;

    constructor(config: SubsonicConfig) {
        this.config = config;
        this.axios = axios.create({
            baseURL: config.baseUrl,
        });
    }

    private getAuthParams() {
        // Implementing Subsonic Token Auth (v1.13+)
        const salt = Math.random().toString(36).substring(2, 15);
        const password = this.config.password || "";
        
        // TS Error Fix: "This expression is not callable"
        // Cause: Mismatch between @types/js-md5 export definition and actual CommonJS export in some contexts.
        // Fix: Cast to any or function type to bypass TS check. 'js-md5' main export is essentially the hashing function.
        // We use (md5 as any) to treat it as a function. 
        // Note: We do NOT use .create() check here because the function itself has .create property, causing false positives if we just check existence.
        const token = (md5 as any)(password + salt);

        return {
            u: this.config.username,
            t: token,
            s: salt,
            v: "1.16.1", // Compatible version
            c: this.config.clientName || "SoundX",
            f: "json"
        };
    }

    public getCoverUrl(id: string) {
         const params = new URLSearchParams(this.getAuthParams() as any);
         params.append("id", id);
         return `${this.config.baseUrl}/rest/getCoverArt.view?${params.toString()}`;
    }

    public async get<T>(endpoint: string, params: any = {}): Promise<T> {
        const authParams = this.getAuthParams();
        const response = await this.axios.get(`/rest/${endpoint}.view`, {
            params: {
                ...authParams,
                ...params
            }
        });
        
        const data = response.data?.["subsonic-response"];
        if (data && data.status === "failed") {
            throw new Error(data.error?.message || "Subsonic Request Failed");
        }
        return data as T;
    }
    
    // Subsonic is mostly GET, aside from playlists/starring which might be GET too.
    public async post<T>(endpoint: string, params: any = {}, body: any = {}): Promise<T> {
         // Subsonic usually uses GET even for mutations, but supports POST.
         // Pass params in query string for auth.
         const authParams = this.getAuthParams();
          const response = await this.axios.post(`/rest/${endpoint}.view`, body, {
            params: {
                ...authParams,
                ...params
            }
        });
        const data = response.data?.["subsonic-response"];
        if (data && data.status === "failed") {
            throw new Error(data.error?.message || "Subsonic Request Failed");
        }
        return data as T;
    }
}
