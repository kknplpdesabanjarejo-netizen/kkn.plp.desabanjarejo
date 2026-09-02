import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

// Fetch a public/admin collection. Returns { data, loading, error, refetch }.
export function useResource(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/${path}`);
      setData(res.data.data);
    } catch (e) {
      setError("Unable to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

export function useObject(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api
      .get(`/${path}`)
      .then((r) => active && setData(r.data.data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [path]);
  return { data, loading };
}
