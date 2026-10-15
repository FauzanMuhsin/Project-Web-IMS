import axios from "axios"
import { Form, Field } from "react-final-form"
import {useParams} from 'react-router-dom'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

// TINGGAL AMBIL DATA DARI DATA SEBELUMNYA BUAT DI TAMPILIN
// VALUE
function FormEdit() {
    const [data, setData] = useState([])
    const { id } = useParams();
    const navigate = useNavigate()


    const getData = async () => { 
        try {
            
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/getProductEdit/${id}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setData(response.data)
            console.log('ini response', response.data);
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
    
    const onSubmit = async (values) => { 
        try {
            const showAlert = await Swal.fire({
                title: "Yakin ingin edit?",
                text: `produk ${values.nama_barang} akan berubah!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Ya, edit",
                cancelButtonText: "Batal",
            })
            
            if (!showAlert.isConfirmed) return
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const formData = new FormData()
            formData.append("nama_barang", values.nama_barang)
            formData.append("satuan", values.satuan)
            formData.append("material", values.material)
            formData.append("harga_jual", values.harga_jual)
            formData.append("harga_beli", values.harga_beli)
            formData.append("stok_minimum", values.stok_minimum)
            formData.append("image", values.image)
            await axios.put(`http://localhost:5000/editProduct/${id}`,formData,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            Swal.fire(
                    "berhasil",
                    "berhasil edit produk",
                    "success"
                )
            console.log('produk berhasil di-edit')
        } catch (error) {
            if(error.response){
                Swal.fire(
                    "error",
                    "gagal edit produk, mungkin lupa ganti foto",
                    "error"
                )
                console.log(error.response.data.details)
            }
        }
        navigate('/DataBarang')
    }
    
    return(
        <>
        <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
                <div class="row mb-3">
                    <label htmlFor="" class="col-sm-2 col-form-label">nama barang</label>
                    <div class="col-sm-10">
                    <Field
                    name="nama_barang"
                    component="input"
                    type="text"
                    class="form-control"
                    defaultValue={data.nama_barang}
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <label htmlFor="" class="col-sm-2 col-form-label">stock minimum</label>
                    <div class="col-sm-10">
                    <Field
                    name="stok_minimum"
                    component="input"
                    type="number"
                    class="form-control"
                    defaultValue={data.stok_minimum}
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <label htmlFor="" class="col-sm-2 col-form-label">satuan</label>
                    <div class="col-sm-10">
                    <Field
                    name="satuan"
                    component="input"
                    type="text"
                    class="form-control"
                    defaultValue={data.satuan}
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <label htmlFor="" class="col-sm-2 col-form-label">harga beli</label>
                    <div class="col-sm-10">
                    <Field
                    name="harga_beli"
                    component="input"
                    type="number"
                    class="form-control"
                    defaultValue={data.harga_beli}
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <label htmlFor="" class="col-sm-2 col-form-label">harga jual</label>
                    <div class="col-sm-10">
                    <Field
                    name="harga_jual"
                    component="input"
                    type="number"
                    class="form-control"
                    defaultValue={data.harga_jual}
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <label htmlFor="" class="col-sm-2 col-form-label">material</label>
                    <div class="col-sm-10">
                    <Field
                    name="material"
                    component="input"
                    type="text"
                    class="form-control"
                    defaultValue={data.material}
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">upload foto</label>
                    <div className="col-sm-10">
                    <Field name="image">
                    {({ input }) => (
                        <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => input.onChange(e.target.files[0])}
                        />
                    )}
                    </Field>
                    </div>
                </div>
                <div>
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                    Submit
                    </button>
                    
                </div>
            </form>
        )}
        />
        </>
    )
}

export default FormEdit