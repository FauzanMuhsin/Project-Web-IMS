import { Form, Field } from "react-final-form"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import axios from 'axios'



function FormTambah() {
    const navigate = useNavigate()
    // pake format untuk input harga. pake useState lalu format agara bisa menampilkan harga

    const showAlert = (values) => {
        Swal.fire({
            title: "Berhasil!",
            text: `Produk ${values.nama_barang} berhasil disimpan`,
            icon: "success",
            confirmButtonText: "OK"
        });
        };
    const onSubmit = async (values, form) => {
        try {
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
            await axios.post('http://localhost:5000/tambah_barang', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            showAlert(values)
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
        form.reset()
        navigate('/DataBarang')
    }
    return(
        <>
        <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit, submitting}) => (
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">nama barang</label>
                    <div className="col-sm-10">
                    <Field
                    name="nama_barang"
                    component="input"
                    type="text"
                    className="form-control"
                    required
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">stock minimum</label>
                    <div className="col-sm-10">
                    <Field
                    name="stok_minimum"
                    component="input"
                    type="number"
                    className="form-control"
                    required
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">satuan</label>
                    <div className="col-sm-10">
                    <Field
                    name="satuan"
                    component="input"
                    type="text"
                    className="form-control"
                    required
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">harga beli</label>
                    <div className="col-sm-10">
                    <Field
                    name="harga_beli"
                    component="input"
                    type="number"
                    className="form-control"
                    required
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">harga jual</label>
                    <div className="col-sm-10">
                    <Field
                    name="harga_jual"
                    component="input"
                    type="number"
                    className="form-control"
                    required
                    />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="" className="col-sm-2 col-form-label">material</label>
                    <div className="col-sm-10">
                    <Field
                    name="material"
                    component="input"
                    type="text"
                    className="form-control"
                    required
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

export default FormTambah