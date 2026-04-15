import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="app">
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  )
}

