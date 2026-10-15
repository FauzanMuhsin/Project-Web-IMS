import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import {jwtDecode} from 'jwt-decode'


export const AdminOnly = ({children}) => {
    const [role, setRole] = useState('')
    const navigate = useNavigate()
    
    async function refreshToken() {
        try {
            const response = await axios.get('http://localhost:5000/token')
            const accessToken = response.data.accessToken
            const decoded = jwtDecode(accessToken)
            setRole(decoded.role)
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
        {role !== 'admin' ? navigate('/dashboard'):{children}}
        </>
    )
}