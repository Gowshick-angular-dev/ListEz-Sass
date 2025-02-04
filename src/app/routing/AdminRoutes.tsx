import {Routes, Route} from 'react-router-dom'
import { AdminLogin } from '../modules/auth/components/adminLogin'

const AdminRoutes = () => {
    return(
        <Routes>
            <Route path='admin' element={<AdminLogin />} /> 
            <Route index element={<AdminLogin />} />
        </Routes>
    )
}

export {AdminRoutes}