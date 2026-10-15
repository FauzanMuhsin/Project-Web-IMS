import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"

// untuk format tanggal
import dayjs from 'dayjs' 
import "dayjs/locale/id"
dayjs.locale("id")

function Detail () {
    // klo nyimpen data array simpen juga ke array blog => ([])
    const [data, setData] = useState([])
    const { id } = useParams();
    console.log(data);

    async function getData () {
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/detail/${id}`,{
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

    // ada module untuk nyeting tampilan harga kayak Rp atau dollar dan otomatis naruh koma dll
    return(
        <>
        {/* button untuk nambah stock harus diluar */}
        <table className="table table-bordered">
        <thead>
            <tr>
                {/* id, sku dan nama ambil dari tb_barng, selainnya dari tb_stock */}
                <th scope="col">nama</th>
                <th scope="col">tipe</th>
                <th scope="col">stok</th>
                <th scope="col">keterangan</th>
                <th scope="col"> tanggal </th>
            </tr>
        </thead>
        <tbody>
            {data.map((item) =>(
                <tr>
                    <td scope="row">{item.tb_barang.nama_barang}</td>
                    <td scope="row">{item.type}</td>
                    <td scope="row">{item.qty}</td>
                    <td scope="row">{item.keterangan}</td>
                    <td scope="row">{dayjs(item.updatedAt).format("DD MMMM YYYY HH:mm")}</td>
                    </tr>    
             ))} 
        </tbody>
        </table>
        </>
    )
}

export default Detail