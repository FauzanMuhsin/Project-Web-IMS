function DataOrder() {
    return(
        <>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">no</th>
                    <th scope="col">nama</th>
                    <th scope="col">alamat</th>
                    <th scope="col">nama produk</th>
                    <th scope="col">jumlah</th>
                    <th scope="col">total harga</th>
                    <th scope="col">tanggal pesanan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td scope="row">1</td>
                    <td scope="row">arip</td>
                    <td scope="row">maguwo</td>
                    <td scope="row">kabel listrik</td>
                    <td scope="row">2</td>
                    <td scope="row">Rp.100000</td>
                    <td scope="row">12/12/2024</td>
                </tr>
            </tbody>
        </table>
        </>
    )
}

export default DataOrder