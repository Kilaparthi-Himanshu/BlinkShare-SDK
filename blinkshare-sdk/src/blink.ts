import { detectEnvironment } from "./utils/detectEnvironment";

export interface CreateLinkOptions {
    fileUrl: string;
    expiresIn: string;
    maxClicks: number;
}

export interface BlinkOptions {
    apiKey: string;
    baseUrl?: string;
}

export class Blink {
    private apiKey: string;
    private baseUrl: string;

    constructor({ apiKey, baseUrl }: BlinkOptions) {
        if (!apiKey?.startsWith("blink_public_")) {
            throw new Error("Invalid Blink public key");
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl ?? "https://blinkshare.vercel.app/api";
    }

    async createLink(options: CreateLinkOptions) {
        const { fileUrl, expiresIn = "10m", maxClicks = 1 } = options;
        const environment = detectEnvironment();

        const res = await fetch(`${this.baseUrl}/links/createLink`, {
            method: "POST",
            headers: {
                "x-blink-key": this.apiKey,
                "x-blink-env": environment,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fileUrl, expiresIn, maxClicks })
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json() as Promise<{ url: string }>;
    }
}
