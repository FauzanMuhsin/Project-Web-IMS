import axios from "axios"
import Swal from "sweetalert2"

export const hapusBarang = async (id) => {
    try {
        const result = await Swal.fire({
            title: "Yakin mau hapus?",
            text: "Data ini tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        })
        if (!result.isConfirmed) return

        const token = await axios.get('http://localhost:5000/token')
        const accessToken = token.data.accessToken
        await axios.delete(`http://localhost:5000/hapusBarang/${id}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }})
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        
        console.log('produk berhasil dihapus')
    } catch (error) {
       Swal.fire(
        "error",
        "gagal menghapus data",
        "error"
       )
       console.log(error.response);
    }
    window.location.reload('/DataBarang')
}