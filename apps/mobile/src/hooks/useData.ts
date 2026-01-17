import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';

interface UseDataOptions {
    enabled?: boolean;
}

export function useData<T>(url: string, params?: any, options: UseDataOptions = {}) {
    const { enabled = true } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isRefetching, setIsRefetching] = useState(false);

    // Generate a deterministic cache key
    const getCacheKey = (url: string, params: any) => {
        const sortedParams = params
            ? Object.keys(params).sort().reduce((obj: any, key) => {
                obj[key] = params[key];
                return obj;
            }, {})
            : {};
        return `CACHE_${url}_${JSON.stringify(sortedParams)}`;
    };

    const loadFromCache = useCallback(async () => {
        try {
            const key = getCacheKey(url, params);
            const cached = await AsyncStorage.getItem(key);
            if (cached) {
                setData(JSON.parse(cached));
                return true;
            }
        } catch (e) {
            console.warn('Failed to load from cache', e);
        }
        return false;
    }, [url, params]);

    const fetchData = useCallback(async (isRefresh = false) => {
        if (!enabled) return;

        // If refreshing or first load, set appropriate loading states
        if (isRefresh) {
            setIsRefetching(true);
        } else {
            // Only set main loading if we don't have data yet
            setLoading((prevData) => !prevData);
        }

        try {
            // Hard refresh: Cache busting using timestamp to ensure fresh data
            const requestParams = { ...params };
            if (isRefresh) {
                requestParams._t = Date.now();
            }

            const res = await api.get(url, {
                params: requestParams,
                skipErrorCache: true,
                headers: { 'x-skip-error-cache': 'true' }
            } as any);

            setData(res.data);
            setError(null);

            // Explicitly update cache with the original key to ensure next load is fresh
            // We use the original params (without _t) for the key
            try {
                // We need to access getCacheKey, so we include it in dependencies
                const key = `CACHE_${url}_${JSON.stringify(params
                    ? Object.keys(params).sort().reduce((obj: any, key) => { obj[key] = params[key]; return obj; }, {})
                    : {})}`;
                await AsyncStorage.setItem(key, JSON.stringify(res.data));
            } catch (e) {
                console.warn("Failed to manually update cache", e);
            }

        } catch (err: any) {
            setError(err);
            console.log(`Failed to fetch ${url}`, err.message);
        } finally {
            setLoading(false);
            setIsRefetching(false);
        }
    }, [url, params, enabled]);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            if (!enabled) return;

            // 1. Load from cache immediately
            const hasCache = await loadFromCache();

            // 2. Determine if we still need to show full loading
            // If we found cache, we aren't "loading" in the blocking sense anymore
            if (hasCache && mounted) {
                setLoading(false);
            }

            // 3. Fetch fresh data (Stale-While-Revalidate)
            if (mounted) {
                fetchData();
            }
        };

        init();

        return () => { mounted = false; };
    }, [loadFromCache, fetchData, enabled]);

    const refetch = () => fetchData(true);

    return { data, loading, error, refetch, isRefetching };
}
