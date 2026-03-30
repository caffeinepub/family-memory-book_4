import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Memory {
    id: string;
    title: string;
    authorId: Principal;
    date: string;
    blobIds: Array<ExternalBlob>;
    createdAt: bigint;
    tags: Array<string>;
    authorName: string;
    description: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMemory(title: string, description: string, date: string, tags: Array<string>, authorName: string, blobIds: Array<ExternalBlob>): Promise<string>;
    addSampleMemories(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMemory(memoryId: string): Promise<void>;
    getAllUniqueTags(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMemoryById(memoryId: string): Promise<Memory>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllMemories(): Promise<Array<Memory>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMemory(memoryId: string, title: string, description: string, date: string, tags: Array<string>, authorName: string): Promise<void>;
}
