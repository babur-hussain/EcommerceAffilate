/**
 * Layout Version History & Bookmarks — localStorage helpers
 *
 * Version History: automatically saved on every "Save Layout" action.
 * Bookmarks: manually saved snapshots with a user note.
 */

// ─── Types ───────────────────────────────────────────────────────────

export interface LayoutVersion {
    id: string;
    timestamp: string;        // ISO string
    json: string;             // raw JSON string
    layoutName: string;
}

export interface LayoutBookmark {
    id: string;
    timestamp: string;        // ISO string
    json: string;             // raw JSON string
    note: string;
    layoutName: string;
}

// ─── Internal helpers ────────────────────────────────────────────────

const MAX_VERSIONS = 50;

function historyKey(layoutId: string) {
    return `layout-history-${layoutId}`;
}

function bookmarkKey(layoutId: string) {
    return `layout-bookmarks-${layoutId}`;
}

function uid(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJSON<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJSON(key: string, value: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
}

// ─── Version History ─────────────────────────────────────────────────

export function saveVersion(
    layoutId: string,
    json: string,
    layoutName: string
): LayoutVersion {
    const versions = readJSON<LayoutVersion[]>(historyKey(layoutId), []);
    const entry: LayoutVersion = {
        id: uid(),
        timestamp: new Date().toISOString(),
        json,
        layoutName,
    };
    versions.unshift(entry);
    // Cap at MAX_VERSIONS
    if (versions.length > MAX_VERSIONS) versions.length = MAX_VERSIONS;
    writeJSON(historyKey(layoutId), versions);
    return entry;
}

export function getVersions(layoutId: string): LayoutVersion[] {
    return readJSON<LayoutVersion[]>(historyKey(layoutId), []);
}

export function deleteVersion(layoutId: string, versionId: string): void {
    const versions = readJSON<LayoutVersion[]>(historyKey(layoutId), []);
    writeJSON(
        historyKey(layoutId),
        versions.filter((v) => v.id !== versionId)
    );
}

export function clearHistory(layoutId: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(historyKey(layoutId));
}

// ─── Bookmarks ───────────────────────────────────────────────────────

export function saveBookmark(
    layoutId: string,
    json: string,
    note: string,
    layoutName: string
): LayoutBookmark {
    const bookmarks = readJSON<LayoutBookmark[]>(bookmarkKey(layoutId), []);
    const entry: LayoutBookmark = {
        id: uid(),
        timestamp: new Date().toISOString(),
        json,
        note,
        layoutName,
    };
    bookmarks.unshift(entry);
    writeJSON(bookmarkKey(layoutId), bookmarks);
    return entry;
}

export function getBookmarks(layoutId: string): LayoutBookmark[] {
    return readJSON<LayoutBookmark[]>(bookmarkKey(layoutId), []);
}

export function deleteBookmark(layoutId: string, bookmarkId: string): void {
    const bookmarks = readJSON<LayoutBookmark[]>(bookmarkKey(layoutId), []);
    writeJSON(
        bookmarkKey(layoutId),
        bookmarks.filter((b) => b.id !== bookmarkId)
    );
}

export function updateBookmarkNote(
    layoutId: string,
    bookmarkId: string,
    newNote: string
): void {
    const bookmarks = readJSON<LayoutBookmark[]>(bookmarkKey(layoutId), []);
    const target = bookmarks.find((b) => b.id === bookmarkId);
    if (target) {
        target.note = newNote;
        writeJSON(bookmarkKey(layoutId), bookmarks);
    }
}
