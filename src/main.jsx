import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminApp from './admin/AdminApp'
import { StoreProvider, usePath } from './store'
import './styles.css'
import './styles-v2.css'

function Root() {
  const [path, go] = usePath()
  return path.startsWith('/admin') ? <AdminApp path={path} go={go} /> : <App path={path} go={go} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <Root />
    </StoreProvider>
  </React.StrictMode>
)
