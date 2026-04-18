import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUrl, deleteUrl, fetchUrls, type UrlItem } from "../lib/api";
import { clearAccessToken } from "../lib/auth";

export function HomePage() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [inputUrl, setInputUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUrls().then(setUrls).catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const newUrl = await createUrl(inputUrl);
      setUrls((prev) => [newUrl, ...prev]);
      setInputUrl("");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "エラーが発生しました";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteUrl(id);
    setUrls((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <section className="card">
      <header className="card__header">
        <h1 className="card__title">URL短縮</h1>
        <button
          className="button button--secondary"
          type="button"
          onClick={() => {
            clearAccessToken();
            navigate("/login", { replace: true });
          }}
        >
          ログアウト
        </button>
      </header>

      <form className="form" onSubmit={handleCreate}>
        <div className="field">
          <label className="field__label" htmlFor="url">
            短縮したいURL
          </label>
          <input
            className="field__input"
            id="url"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        {errorMessage ? <div className="alert">{errorMessage}</div> : null}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "送信中…" : "短縮する"}
        </button>
      </form>

      <div className="card__body">
        {urls.length === 0 ? (
          <p>まだURLがありません</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: "12px",
            }}
          >
            {urls.map((u) => (
              <li
                key={u.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <a
                    href={u.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {u.originalUrl}
                  </a>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    短縮URL:{" "}
                    {`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"}/${u.shortCode}`}
                  </div>
                </div>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => handleDelete(u.id)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
