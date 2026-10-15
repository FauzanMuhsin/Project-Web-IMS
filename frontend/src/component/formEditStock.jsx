import axios from "axios";
import { Form, Field } from "react-final-form"
import {useNavigate} from 'react-router-dom'
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const FormEditStock = () => {
    const [data, setData] = useState([])
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    console.log(query);
    console.log(data);

    const getData = async () => { 
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/searchBarang?q=${query}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setData(response.data)
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
    }
    useEffect(() => {
        // const init = async () => {   
            setTimeout(() => {
            getData()
        }, 2000);
        // }
        // init()
    },[query])

    const onSubmit = async (values, form) => {
        try {
            const result = await Swal.fire({
                title: "Yakin ingin mengubah stok?",
                text: `stok produk ${values.nama_barang} akan berubah!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Ya, ubah",
                cancelButtonText: "Batal",
            })
            if (!result.isConfirmed) return
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            await axios.post(`http://localhost:5000/editStock`,values,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            Swal.fire(
                "berhasil",
                "berhasil mengubah stok",
                "success"
            )
            navigate('/DataStock');
        } catch (error) {
            if(error.response){
                Swal.fire(
                    "error",
                    "gagal mengubah stok",
                    "error"
                )
                console.log(error.response)
            }
        }
        form.reset()
    }
    return(
        <>
        {/* <p>{data.tb_barang.nama_barang}</p> */}
        <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit,submitting , form}) => (
            <form onSubmit={handleSubmit} >
                <div className="row mb-3">
                    <div className="col-sm-10">
                    <label className="col-sm-2 col-form-label"> nama barang </label>
                    <Field 
                        name="nama_barang" 
                        component="input" 
                        type="text"
                    >
                        {({ input }) => (
                            <input
                            {...input}
                            className="form-control"
                            placeholder="Nama barang"
                            onChange={(e) => {
                                input.onChange(e)
                                setQuery(e.target.value); // WAJIB
                            }}
                        />
                    )}
                    </Field>
                    <div>
                        <ul className="list-group position-absolute">
                            {data.map((item) => (
                                <li
                                key={item.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    // isi field form
                                    form.change("nama_barang", item.nama_barang)
                                    form.change("barang_id", item.id)

                                    // update state
                                    setQuery(item.nama_barang)
                                    setData([])
                                }}
                                >
                                {item.nama_barang}
                                </li>
                            ))}
                            </ul>
                    </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10">
                    <Field 
                    name="barang_id" 
                    className="form-control"
                    component="input" 
                    type="hidden" 
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10">
                    <label className="col-sm-2 col-form-label"> quantity </label>
                    <Field 
                    name="qty" 
                    className="form-control"
                    component="input" 
                    type="number" 
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-10">
                    <label class="col-sm-2 col-form-label"> type </label>
                    <Field 
                    name="type" 
                    className="form-select" 
                    component="select" 
                    type="text" 
                    >
                        <option  value="">--option method--</option>
                        <option  value="IN">IN</option>
                        <option  value="OUT">OUT</option>
                        <option  value="ADJUST">ADJUST</option>
                    </Field>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10">
                    <label className="col-sm-2 col-form-label"> keterangan </label>
                    <Field 
                    name="keterangan" 
                    className="form-control"
                    component="input" 
                    type="text" 
                    />
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn btn-md btn-primary" disabled={submitting}>
                    Submit
                    </button>
                </div>
            </form>
        )}/>
        </>
    )
}

export default FormEditStock