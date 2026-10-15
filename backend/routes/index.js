import express from "express"
import { getUser, register, login, logOut, getUsers, deleteUser, editUser, getUser2} from "../controller/users.js";
import { editProduct, getProduct, getProductEdit, getProducts, hapusDataBarang, tambah_barang, TotalBarang } from "../controller/TableBarang.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { Detail, editStock, getStock,  getStocks,  searchBarang, stockDayAgo, stockOutDayAgo} from "../controller/stock.js";
import { upload } from "../middleware/UploadPhoto.js";
import { logActivity } from "../controller/ActivityLog.js";
const router = express.Router();

router.get('/users',verifyToken, getUser);
router.get('/getUser2/:id',verifyToken, getUser2);
router.get('/getUsers',verifyToken,getUsers);
router.post('/users',verifyToken, register);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logOut);
router.put('/editUser/:id', verifyToken, editUser);
router.delete('/deleteUser/:id', verifyToken, deleteUser);

// TABEL BARANG
router.get('/getBarang', getProducts);
router.get('/totalBarang', verifyToken,TotalBarang);
router.get('/getDetailProduct/:id', getProduct);
router.get('/getProductEdit/:id', getProductEdit);
// klo mau update pake put bukan post
router.put('/editProduct/:id',verifyToken, upload.single("image") , editProduct);
router.post('/tambah_barang',verifyToken, upload.single("image") ,tambah_barang);
router.delete('/hapusBarang/:id',verifyToken, hapusDataBarang);

// STOK BARANG
router.get('/detail/:id', Detail);
router.get('/getStocks',verifyToken, getStocks);
router.get('/getStock/:id', getStock);
router.post('/editStock',verifyToken, editStock);
router.get('/searchBarang', searchBarang);

// LOG AKTIVITAS
router.get('/logActivity',  logActivity);

// DASHBOARD
router.get('/stockInDayAgo',  stockDayAgo);
router.get('/stockOutDayAgo',  stockOutDayAgo);



export default router