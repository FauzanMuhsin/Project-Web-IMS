import axios from "axios"
import Swal from "sweetalert2"

export const deleteUser = async (id) => {
    try {
        const result = await Swal.fire({
                    title: "Yakin mau hapus?",
                    text: "akun ini tidak bisa dikembalikan!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Ya, hapus",
                    cancelButtonText: "Batal",
                })
                if (!result.isConfirmed) return
        // inget pake backtick
        const token = await axios.get('http://localhost:5000/token')
        const accessToken = token.data.accessToken
        await axios.delete(`http://localhost:5000/deleteUser/${id}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

        Swal.fire("Terhapus!", "akun berhasil dihapus.", "success");
        window.location.reload("/DataUsers")
        console.log('produk berhasil dihapus')
    } catch (error) {
        if(error.response){
            Swal.fire(
                    "error",
                    "gagal menghapus akun",
                    "error"
                   )
            console.log(error.response.data.msg)
        }
    }
}