import { useNavigate } from 'react-router-dom'
import { clearAccessToken } from '../lib/auth'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <section className="card">
      <header className="card__header">
        <h1 className="card__title">ログイン済み</h1>
        <p className="card__subtitle">モックでも動きます（`VITE_USE_MOCK=1`）。</p>
      </header>

      <div className="card__body">
        <button
          className="button button--secondary"
          type="button"
          onClick={() => {
            clearAccessToken()
            navigate('/login', { replace: true })
          }}
        >
          ログアウト
        </button>
      </div>
    </section>
  )
}

