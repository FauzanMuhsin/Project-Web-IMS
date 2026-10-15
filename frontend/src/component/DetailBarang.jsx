import { useEffect, useState } from "react"
import axios from "axios"

const DetailBarang = ({barangId})=> {
    const [data, setData] = useState([])
    const rupiah = new Intl.NumberFormat('id-ID', {
        style:'currency',
        currency:'IDR'
    })
    console.log(data);

    async function getData () {
        try {
            const token = await axios.get('http://localhost:5000/token')
        const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/getDetailProduct/${barangId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setData(response.data)
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
        // @ts-ignore
        // eslint-disable-next-line
    },[barangId])
    return(
        <>
        <div>
            <img
                src={data.image}
                alt="contoh"
            />
        </div><br/>
        <p>satuan barang : {data.nama_barang}</p>
        <p>harga beli : {rupiah.format(data.harga_beli)}</p>
        <p>harga jual : {rupiah.format(data.harga_jual)}</p>
        <p>satuan barang : {data.satuan}</p>
        <p>material : {data.material}</p>
        </>
    )
}

export default DetailBarang