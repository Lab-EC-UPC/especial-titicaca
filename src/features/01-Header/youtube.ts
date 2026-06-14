
export function getYouTubeId(input: string): string {
    const value = input?.trim();
    if (!value) return "";

    const match = value.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (match) return match[1];

    return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : "";
}
