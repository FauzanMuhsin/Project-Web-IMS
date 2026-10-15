import {useNavigate } from "react-router-dom"
import {hapusBarang} from "../controller/hapusBarang"
import { useState } from "react";
import ModalDetail from "./ModalDetail";

function ListBarang ({data, role}) {
    // klo nyimpen data array simpen juga ke array blog => ([])
    const [isOpen, setIsOpen] = useState(false);
    const [barangId, setBarangId] = useState(null);
    const navigate = useNavigate()
    const hideSidebar = role !== 'admin' 

    const goEdit = (id) => {
            navigate(`/FormEdit/${id}`)
    }
    return(
        <>
        <table className="table table-bordered">
        <thead>
            <tr>
                <th scope="col">sku</th>
                <th scope="col">nama</th>
                {/* // ada module untuk nyeting tampilan harga kayak Rp atau dollar dan otomatis naruh koma dll */}
                {/* ada beberapa kolom yg harus dimasukin ke detail agar menghemat ruang */}
                <th scope="col">aksi</th>
            </tr>
        </thead>
        <tbody>
            { data.map((item) =>(
                <tr key={data.id}>
                    <td scope="row" >{item.sku}</td>
                    <td scope="row" >{item.nama_barang}</td>
                    <td scope="row">
                        <div className="col d-flex gap-2 justify-content-center ">
                            <button className="btn btn-primary" onClick={() => {setIsOpen(true),setBarangId(item.id)}}><i className="bi bi-eye-fill"></i></button>
                            {!hideSidebar && <button className="btn btn-warning"  onClick={()=> goEdit(item.id)}><i className="bi bi-pencil-square"></i></button>}
                            {!hideSidebar && <button className="btn btn-danger " onClick={()=> hapusBarang(item.id)} ><i className="bi bi-trash"></i></button>}
                            <ModalDetail barangId={barangId} open={isOpen} onClose={() => setIsOpen(false)}></ModalDetail>
                        </div>
                    </td>
                </tr>    
            ))}
        </tbody>
        </table>
        </>
    )
}

export default ListBarang