import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { deleteUser } from "../controller/hapusUser"

function DataUsers() {
    const [data, setData] = useState([])
    const navigate = useNavigate()

    const goEdit = (id) => {
            navigate(`/FormEditUser/${id}`)
    }
    const getData = async() => {
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get('http://localhost:5000/getUsers',{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setData(response.data)
            console.log(response.data)
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
    }
    useEffect(() => {
                const init = async () => {
                    getData()
                }
                init()
            },[])
    return(
        <>
        <button className="btn btn-primary">
            <Link to='/Register' className="btn btn-sm btn-primary">Tambah +</Link>
        </button><br /><br />
        <table className="table table-bordered">
            <thead>
                <tr>
                    {/* mungkin perlu ditambah alamat, biar klo ada maling tau rumah nya mana */}
                    <th scope="col">nama</th>
                    <th scope="col">email</th>
                    <th scope="col">role</th>
                    <th scope="col">aksi</th>
                </tr>
            </thead>
            <tbody>
            {data.map((item) =>(
                <tr>
                    <td scope="row">{item.name}</td>
                    <td scope="row">{item.email}</td>
                    <td scope="row">{item.role}</td>
                    <td scope="row">
                        <div className="col d-flex gap-2 justify-content-center ">
                            {/* kayaknya klo buat tombol edit diganti untuk ganti password aja */}
                            <button className="btn btn-warning" onClick={()=> goEdit(item.id)}>ganti password</button>
                            <button className="btn btn-danger" onClick={()=> deleteUser(item.id)}><i className="bi bi-trash"></i></button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </>
    )
}

export default DataUsers