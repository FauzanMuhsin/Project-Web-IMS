import { Form, Field } from "react-final-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react";
const Login = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('')
    
    const onSubmit = async (values) => {
        try {
             await axios.post('http://localhost:5000/login',values)
            // ini bukan best practice
            navigate('/dashboard');
            window.location.reload('/dashboard') // ini bukan cara terbaik  
            console.log()
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg)
            }
        }
    }
    return(
        <>
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow p-4">
                <h3 className="card-title text-center mb-4">Login</h3>
                <p className="text-center text-danger">{msg}</p>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{}}
                    render={({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <Field
                            className="form-control"
                            name="email"
                            component="input"
                            type="email"
                            placeholder="Enter your email"
                        />
                        </div>
                        <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <Field
                            className="form-control"
                            name="password"
                            component="input"
                            type="password"
                            placeholder="********"
                        />
                        </div>
                        <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            Login
                        </button>
                        </div>
                    </form>
                    )}
                />
                </div>
            </div>
        </div>
    </>
    )
}

export default Login
