import { useEffect, useState } from "react";
import { supabase, supabaseConfigError } from "./supabase";

function Counter() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(
    supabaseConfigError ? "Supabase configuration error." : null
  );

  useEffect(() => {
    if (error || !supabase) return;
    supabase
      .rpc("get_registration_count")
      .then(({ data, error }) => {
        if (error) {
          setError("Failed to load registration count.");
        } else {
          setCount(data as number);
        }
      });
  }, []);

  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-6)",
      }}
    >
      <p className="eyebrow">End Of Days 2026 Hämeenlinna</p>
      <h1
        style={{
          fontSize: "var(--text-3xl)",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Registrations
      </h1>
      {error ? (
        <span className="field-error">{error}</span>
      ) : count === null ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : (
        <p
          style={{
            fontSize: "6rem",
            fontWeight: 700,
            lineHeight: 1,
            margin: 0,
          }}
        >
          {count}
        </p>
      )}
    </div>
  );
}

export default Counter;
