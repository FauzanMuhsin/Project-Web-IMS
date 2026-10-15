import {Link} from 'react-router-dom'
import axios from 'axios'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import {jwtDecode} from 'jwt-decode'
import { useLogOut } from '../controller/logOut'

function Sidebar() {
    const [role, setRole] = useState('')
    const [name, setName] = useState('')
    const hideSidebar = role !== 'admin' 

    // ini custom hooks, karena pemanggilan func dari file js mengandung module react 
    const logOut = useLogOut()

    // ini untuk data user login
    async function refreshToken() {
        try {
            const response = await axios.get('http://localhost:5000/token')
            const accessToken = response.data.accessToken
            const decoded = jwtDecode(accessToken)
            setRole(decoded.role)
            setName(decoded.name)
        } catch (error) {
            if(error.response) {
                console.log({msg: error})
            }
        }
    }
    useEffect(() => {
        const init = async () => {
            refreshToken()
        }
        init()
    },[])
    return(
        <>
        <div className="d-flex" style={{ minHeight: '100vh' }}>
      
            {/* SIDEBAR (Kiri) */}
            <div className="bg-dark text-white p-3 shadow" style={{
                    width: '280px', 
                    height: '100vh',    /* Tinggi sidebar 100% layar */
                    position: 'sticky', /* Paku posisinya */
                    top: 0,             /* Mulai nempel dari paling atas */
                    overflowY: 'auto'   /* Kalau menu kebanyakan, sidebarnya bisa di-scroll sendiri */
                 }}>
                <h4 className="text-center mb-4">Inventory App</h4>
                <ul className="nav nav-pills flex-column mb-auto">
                        <li><Link to='/Dashboard'  className="nav-link text-white"> dashboard </Link></li>
                        <li><Link to='/DataBarang' className="nav-link text-white"> data barang </Link> </li> 
                        <li><Link to='/DataStock' className="nav-link text-white"> data stok</Link></li>
                        {!hideSidebar && <li><Link to='/DataUsers' className="nav-link text-white"> informasi user </Link> </li>} 
                        <li><Link to='/LogActivity' className="nav-link text-white"> log aktivitas </Link> </li> 
                </ul>
            </div>

            {/* AREA KANAN (Navbar + Main Content) */}
            <div className="flex-grow-1 bg-light">
                
                {/* NAVBAR */}
                <nav className="navbar sticky-top navbar-expand bg-white border-bottom px-4 shadow-sm">
                <div className="container-fluid">
                    {/* Supaya profil terdorong ke paling kanan, kita pakai ms-auto */}
                    <div className="ms-auto dropdown">
                    <a 
                        href="#" 
                        className="d-flex align-items-center text-decoration-none dropdown-toggle text-dark" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <div className="text-end me-2 d-none d-md-block">
                        <strong className="d-block" style={{ fontSize: '14px' }}>{name}</strong>
                        <small className="text-muted">Administrator</small>
                        </div>
                        <img 
                        src="https://ui-avatars.com/api/?name=Fauzan&background=0D6EFD&color=fff" 
                        alt="profile" 
                        width="40" 
                        height="40" 
                        className="rounded-circle border"
                        />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                        <li><button className="dropdown-item text-danger" onClick={()=> logOut()}>Logout</button></li>
                    </ul>
                    </div>
                </div>
                </nav>

                <div  className='p-4'>
                    {/* ini untuk merender semua child route di dalam outlet */}
                    {/* agar link dalam sidebar dapat berfungsi  */}
                    <Outlet/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Sidebar

