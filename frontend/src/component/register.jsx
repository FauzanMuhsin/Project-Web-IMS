import axios from "axios";
import { Form, Field } from "react-final-form"
import {useNavigate} from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()

    const onSubmit = async (values) => {
        const token = await axios.get('http://localhost:5000/token')
        const accessToken = token.data.accessToken
        try {
            await axios.post('http://localhost:5000/users',values,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            navigate('/');
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
    }
    return(
        <>
        <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit,submitting }) => (
            <form onSubmit={handleSubmit} >
                <div class="row mb-3">
                    <div class="col-sm-10">
                    <label class="col-sm-2 col-form-label">nama</label>
                    <Field name="name" className="form-control" component="input" type="text" />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-10">
                    <label class="col-sm-2 col-form-label">email</label>
                    <Field name="email" className="form-control" component="input" type="text" />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-10">
                    <label class="col-sm-2 col-form-label">role</label>
                    <Field name="role" className="form-control" component="input" type="text" />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-10">
                    <label class="col-sm-2 col-form-label">password</label>
                    <Field name="password" className="form-control form-password" component="input" type="password"/>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-10">
                    <label class="col-sm-2 col-form-label">confirm password</label>
                    <Field name="confPassword" className="form-control form-password"  component="input" type="password"/>
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn btn-md btn-primary" disabled={submitting}>
                    kirim
                    </button>
                </div>
            </form>
        )}/>
        </>
    )
}

export default Register



// import React from 'react';
// import { Form, Field } from 'react-final-form';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//     const navigate = useNavigate();

//     const handleRegister = async (values) => {
//         try {
//             // "values" otomatis berisi { name, email, password, confPassword }
//             await axios.post('http://localhost:5000/users', values);
//             navigate("/"); 
//         } catch (error) {
//             if (error.response) {
//                 // Mengirim pesan error dari backend ke penampung [Form.ERROR]
//                 return { [Form.ERROR]: error.response.data.msg };
//             }
//         }
//     };

//     const validate = values => {
//         const errors = {};
//         if (!values.name) errors.name = "Nama wajib diisi";
//         if (!values.email) errors.email = "Email wajib diisi";
//         if (!values.password) errors.password = "Password wajib diisi";
//         if (values.password !== values.confPassword) {
//             errors.confPassword = "Konfirmasi password tidak sesuai";
//         }
//         return errors;
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2>Register Akun</h2>

//             <Form
//                 onSubmit={handleRegister}
//                 validate={validate}
//                 render={({ handleSubmit, submitting, submitError }) => (
//                     <form onSubmit={handleSubmit}>
                        
//                         {/* Menampilkan error dari backend */}
//                         {submitError && <div style={{ color: 'red' }}>{submitError}</div>}

//                         <div>
//                             <label>Nama:</label><br />
//                             <Field name="name" component="input" type="text" placeholder="Nama Lengkap" />
//                             {/* Menampilkan error validasi */}
//                             <Error name="name" />
//                         </div>

//                         <div>
//                             <label>Email:</label><br />
//                             <Field name="email" component="input" type="email" placeholder="Email" />
//                             <Error name="email" />
//                         </div>

//                         <div>
//                             <label>Password:</label><br />
//                             <Field name="password" component="input" type="password" placeholder="******" />
//                             <Error name="password" />
//                         </div>

//                         <div>
//                             <label>Konfirmasi Password:</label><br />
//                             <Field name="confPassword" component="input" type="password" placeholder="******" />
//                             <Error name="confPassword" />
//                         </div>

//                         <br />
//                         <button type="submit" disabled={submitting}>
//                             {submitting ? 'Mengirim...' : 'Daftar Sekarang'}
//                         </button>
//                     </form>
//                 )}
//             />
//         </div>
//     );
// };

// Komponen kecil untuk nampilin pesan error biar gak ngetik berulang
// const Error = ({ name }) => (
//     <Field
//         name={name}
//         subscription={{ touched: true, error: true }}
//         render={({ meta: { touched, error } }) =>
//             touched && error ? <span style={{ color: 'red', fontSize: '12px' }}>{error}</span> : null
//         }
//     />
// );

// export default Register;