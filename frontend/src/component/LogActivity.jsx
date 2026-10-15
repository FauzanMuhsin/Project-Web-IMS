import { Form, Field } from "react-final-form"
import axios from "axios"
import { useState, useEffect } from "react"
import dayjs from 'dayjs' 
import "dayjs/locale/id"
dayjs.locale("id")

function LogActivity() {
    const [data, setData] = useState([])
    console.log(data);
    
    async function getData () {
        try {
            const response = await axios.get(`http://localhost:5000/logActivity`)
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
        <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">nama pengguna</th>
                        <th scope="col">aksi</th>
                        <th scope="col">deskripsi</th>
                        <th scope="col">tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) =>(
                        <tr key={data.id}>
                            <td scope="row">{item.user_name}</td>
                            <td scope="row">{item.action}</td>
                            <td scope="row">{item.description}</td>
                            <td scope="row">{dayjs(item.createdAt).format("DD MMMM YYYY HH:mm")}</td>
                        </tr>    
                    ))}
                </tbody>
                </table>
        </>
    )
}

export default LogActivity