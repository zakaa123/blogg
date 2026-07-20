"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign out";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, logout };
}

interface FirestoreCollectionState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

function serializeConstraints(constraints: QueryConstraint[]): string {
  try {
    return constraints.map((c) => {
      if ("_field" in c && "_op" in c) return `w:${String((c as Record<string, unknown>)._field)}:${(c as Record<string, unknown>)._op}:${JSON.stringify((c as Record<string, unknown>)._value)}`;
      if ("_field" in c && "_direction" in c) return `o:${String((c as Record<string, unknown>)._field)}:${(c as Record<string, unknown>)._direction}`;
      if ("_limit" in c) return `l:${(c as Record<string, unknown>)._limit}`;
      return String(c.type);
    }).join("|");
  } catch {
    return String(constraints.length);
  }
}

function isCancelledError(err: unknown): boolean {
  const code = (err as { code?: string })?.code || "";
  return code === "cancelled" || code === "aborted";
}

export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): FirestoreCollectionState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const constraintsKey = serializeConstraints(queryConstraints);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    const q = query(collection(db, collectionName), ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!mountedRef.current) return;
        const results = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as unknown as T[];
        setData(results);
        setLoading(false);
      },
      (err) => {
        if (!mountedRef.current || isCancelledError(err)) return;
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsKey]);

  return { data, loading, error };
}

interface FirestoreDocState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFirestoreDoc<T extends DocumentData>(
  collectionName: string,
  docId: string
): FirestoreDocState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!mountedRef.current) return;
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as unknown as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        if (!mountedRef.current || isCancelledError(err)) return;
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [collectionName, docId]);

  return { data, loading, error };
}

interface FirestoreCountState {
  count: number;
  loading: boolean;
  error: string | null;
}

export function useFirestoreCount(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): FirestoreCountState {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const constraintsKey = serializeConstraints(queryConstraints);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    const q = query(collection(db, collectionName), ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!mountedRef.current) return;
        setCount(snapshot.size);
        setLoading(false);
      },
      (err) => {
        if (!mountedRef.current || isCancelledError(err)) return;
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsKey]);

  return { count, loading, error };
}
