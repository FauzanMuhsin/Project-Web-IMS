import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import Pagination from "./pagination";


function DataStock () {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [pages, setPages] = useState(0);
    // @ts-ignore
    // eslint-disable-next-line
    const [rows, setRows] = useState(0);
    // @ts-ignore
    // eslint-disable-next-line
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [totalStock, setTotalStock] = useState([])
    const navigate = useNavigate()

    console.log(data);
    const changePage = ({selected}) => {
        setPage(selected)
    } 

    // acc untuk acumulator dan item mewakili isi dari data
    const total_stok = totalStock.reduce((acc, item) => {
        return acc + Number(item.total_stok)
        // 0 untuk initial value dari acc
    }, 0)

    const goDetail = (id) => {
            navigate(`/Stock/Detail/${id}`)
    }

    const goEdit = () => {
            navigate(`/Stock/FormEditStock`)
    }
    async function getStock () {
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/getStocks`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setTotalStock(response.data.result)
            console.log(response.data)
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
    }
    async function getData () {
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/getStocks?search_query=${keyword}&page=${page}&limit=${limit}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setData(response.data.result)
            setPage(response.data.page)
            setLimit(response.data.limit)
            setRows(response.data.totalRows)
            setPages(response.data.totalPage)
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
                getStock()
            }
            init()
        },[page, keyword])

        const searchData = (e) => {
        // agar gk reload
        e.preventDefault();
        // agar mengikuti jumlah dari data yg dicari
        setPage(0);
        setKeyword(query)
    }
    // ada module untuk nyeting tampilan harga kayak Rp atau dollar dan otomatis naruh koma dll
    return(
        <>
        <div className="row mb-3 align-items-center">
            <div className="col-md-6">
                <form onSubmit={searchData}>
                    <div class="input-group">
                        <input 
                            type="text" 
                            class="form-control" 
                            value={query}
                            placeholder="cari barang atau SKU ..."
                            onChange={(e)=> setQuery(e.target.value)}
                            aria-label="Sizing example input" 
                            aria-describedby="inputGroup-sizing-default"
                            />
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Cari</button>
                    </div>
                </form>
            </div>
            <div className="col-md-6 text-end">
                <button className="btn btn-primary" onClick={()=> goEdit()}> tambah +</button>
            </div>
        </div>
        <table className="table table-bordered">
        <thead>
            <tr>
                {/* id, sku dan nama ambil dari tb_barng, selainnya dari tb_stock */}
                <th scope="col">sku</th>
                <th scope="col">nama</th>
                <th scope="col">total stock</th>
                <th scope="col">aksi</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item) =>(
                <tr>
                    <td scope="row">{item.tb_barang.sku}</td>
                    <td scope="row">{item.tb_barang.nama_barang}</td>
                    <td scope="row">{item.total_stok}</td>
                    <td scope="row">
                        <button 
                        className="btn btn-primary" 
                        style={{ marginRight:'5px' }} 
                        onClick={()=> {
                            goDetail(item.barang_id)
                            console.log(item.barang_id)
                        }
                        }
                        ><i className="bi bi-eye-fill"></i></button>
                    </td>
                </tr>    
             ))} 
        </tbody>
        </table>
        {/* ntar ganti pake controller sendiri */}
        <p> total stok : {total_stok}</p>
        <Pagination pages={pages} changePage={changePage}/>
        </>
    )
}

export default DataStock