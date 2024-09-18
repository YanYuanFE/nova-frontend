import { Outlet } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'

function App() {

    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export default App
