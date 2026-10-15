import axios from "axios"
import { useState, useEffect } from "react"

function Dashboard() {
    const [data, setData] = useState([])
    const [totalStock, setTotalStock] = useState([])
    const [totalStockIn, setTotalStockIn] = useState([])
    const [totalStockOut, setTotalStockOut] = useState([])
    console.log(totalStockIn);

    const total_stok = totalStock.reduce((acc, item) => {
        return acc + Number(item.total_stok)
        // 0 untuk initial value dari acc
    }, 0)
    
    const total_stokIn = totalStockIn.reduce((acc, item) => {
        console.log(item.qty);
        return acc + Number(item.qty)
        // 0 untuk initial value dari acc
    }, 0)
    console.log(total_stokIn);

    const total_stokOut = totalStockOut.reduce((acc, item) => {
        return acc + Number(item.qty)
        // 0 untuk initial value dari acc
    }, 0)

    async function getStockOut () {
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/stockOutDayAgo`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setTotalStockOut(response.data)
            console.log(response.data)
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
    }
    async function getStockIn () {
        try {
            const token = await axios.get('http://localhost:5000/token')
            const accessToken = token.data.accessToken
            const response = await axios.get(`http://localhost:5000/stockInDayAgo`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setTotalStockIn(response.data)
            console.log(response.data)
        } catch (error) {
            if(error.response){
                console.log(error.response.data.msg)
            }
        }
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
            const response = await axios.get(`http://localhost:5000/totalBarang`, {
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
                getStock()
                getStockIn()
                getStockOut()
            }
            init()
            // @ts-ignore
            // eslint-disable-next-line
        },[])
    return(
        <>
         <div className="container mt-4 ms-5">
            <div className="row ms-5">
                <div className="col-md-3" >
                <div className="card text-white bg-dark mb-3 shadow" style={{ minHeight: "150px"}}>
                    <div className="card-body">
                    <h6 className="card-title">total barang</h6>
                    <h2 className="fw-bold">{data}</h2>
                    </div>
                </div>
                </div>

                {/* TOTAL STOK */}
                <div className="col-md-3">
                <div className="card text-white bg-primary mb-3 shadow" style={{ minHeight: "150px"}}>
                    <div className="card-body">
                    <h6 className="card-title">Total Stok</h6>
                    <h2 className="fw-bold">{total_stok}</h2>
                    <small>Akumulasi seluruh barang</small>
                    </div>
                </div>
                </div>

                {/* STOK MASUK */}
                <div className="col-md-3">
                <div className="card text-white bg-success mb-3 shadow" style={{ minHeight: "150px"}}>
                    <div className="card-body">
                    <h6 className="card-title">total stok masuk</h6>
                    <h2 className="fw-bold">+{total_stokIn}</h2>
                    <small>kemarin</small>
                    </div>
                </div>
                </div>

                {/* STOK KELUAR */}
                <div className="col-md-3">
                <div className="card text-white bg-danger mb-3 shadow" style={{ minHeight: "150px"}}>
                    <div className="card-body">
                    <h6 className="card-title"> total stok Keluar</h6>
                    <h2 className="fw-bold">-{total_stokOut}</h2>
                    <small>kemarin</small>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default Dashboard