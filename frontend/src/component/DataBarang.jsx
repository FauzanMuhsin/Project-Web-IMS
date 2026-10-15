import { Link} from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import {jwtDecode} from 'jwt-decode'
// import {hapusBarang} from "../controller/hapusBarang"
import ListBarang from "./ListBarang"
import Pagination from "./pagination";

const DataBarang = () => {
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
    const [role, setRole] = useState("");
    const hideSidebar = role !== 'admin' 
    
    const changePage = ({selected}) => {
        setPage(selected)
    } 
    console.log(pages);
    async function getData () {
        const token = await axios.get('http://localhost:5000/token')
        const accessToken = token.data.accessToken
        const decoded = jwtDecode(accessToken)
        setRole(decoded.role)
        const response = await axios.get(
            `http://localhost:5000/getBarang?search_query=${keyword}&page=${page}&limit=${limit}`,
            {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        setData(response.data.result)
        setPage(response.data.page)
        setLimit(response.data.limit)
        setRows(response.data.totalRows)
        setPages(response.data.totalPage)
        
    }
    useEffect(() => {
        const init = async () => {
            getData()
        }
        init()
        // @ts-ignore
        // eslint-disable-next-line
    },[page, keyword])

    const searchData = (e) => {
        // agar gk reload
        e.preventDefault();
        // agar mengikuti jumlah dari data yg dicari
        setPage(0);
        setKeyword(query)
    }
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
            {!hideSidebar && <div className="col-md-6 text-end">
                <button className="btn btn-primary">
                    <Link to='/FormBarang' className="btn btn-sm btn-primary">Tambah +</Link>
                </button>
            </div>}
        </div>
        {/* data yg dikirim akan berupa object. jadi harus  */}
        <ListBarang data={data} role={role}/>
        <p> total baris: {rows} halaman: {page + 1} dari  {pages}</p>
        <Pagination pages = {pages} changePage={changePage}/>
        </>
    )
}

export default DataBarang