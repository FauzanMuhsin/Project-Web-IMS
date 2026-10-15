import { Op, where } from "sequelize";
import path from 'path'
import fs from 'fs'
import tb_barang from "../models/masterBarang.js";
import ActivityLog from "../models/logActivity.js";
import Users from "../models/usermodel.js";
import db from "../config/database.js";

export const tambah_barang = async (req,res) => {
    const t = await db.transaction();
    const image = req.file.filename; 
    const {nama_barang, stok_minimum, satuan, harga_beli, harga_jual, material} = req.body;

    try {
        const user = await Users.findByPk(req.user.userId,{transaction: t});
        await tb_barang.create({
            nama_barang: nama_barang,
            stok_minimum: stok_minimum,
            satuan: satuan,
            harga_beli: harga_beli, 
            harga_jual: harga_jual, 
            material: material,
            image: image,
        },{transaction: t})
        await ActivityLog.create({
            user_name: user.name,
            action: "CREATE",
            description: `menambah barang ${nama_barang}`,
        },{transaction: t})

        // untuk menyimpan transaksi(analogi)
        await t.commit()
        res.json({msg:"barang telah masuk"})
    } catch (error) {
        // ini untuk membatalkan transaksi(analogi)
        await t.rollback()
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
}

export const TotalBarang = async (req,res) => {
    try {
        const totalRows = await tb_barang.count();
        res.json(totalRows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
}



// ====================
// ---INI PAGINATION---
// ====================
export const getProducts = async(req,res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await tb_barang.count({
        where:{
            [Op.or]: [{nama_barang:{
                [Op.like]: '%'+search+'%'
            }},{sku:{
                [Op.like]: '%'+search+'%'
            }}]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await tb_barang.findAll({
        where:{
            [Op.or]: [{nama_barang:{
                [Op.like]: '%'+search+'%'
            }},{sku:{
                [Op.like]: '%'+search+'%'
            }}],
        },
        // ambil data mulai dari data tertentu
        offset: offset,
        // ambil beberapa data awal saja
        limit: limit,
        order: [['updatedAt', 'DESC']] 
    })

    res.json({
        result: result,
        page: page,
        limit: limit,
        totalPage: totalPage,
        totalRows: totalRows
    })
    // const Barang =await tb_barang.findAll({
    //     order: [['updatedAt', 'DESC']]
    // });
    // res.json(Barang);
}

export const getProduct = async(req,res) => {
    try {
        const id  = req.params.id;

        const Barang =await tb_barang.findOne({
            attributes:['nama_barang','harga_jual', 'harga_beli', 'material', 'satuan', 'image'],
            where:{id: id}
        });
        const result = {
            nama_barang: Barang.nama_barang,
            harga_beli: Barang.harga_beli,
            harga_jual: Barang.harga_jual,
            material: Barang.material,
            satuan: Barang.satuan,
            image: `${req.protocol}://${req.get("host")}/images/${Barang.image}`
        };
        res.json(result);
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}
export const getProductEdit = async(req,res) => {
    try {
        const id  = req.params.id;
        const Barang =await tb_barang.findOne({
            where:{id: id}
        });

        res.json(Barang);
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}

export const hapusDataBarang = async(req,res) => {
    // ini inti dari transaction
    // GUNAKAN KETIKA TERDAPAT 2+ LEBIH OPERASI DATABASE
    const t = await db.transaction();

    try {
    const { id } = req.params;

    // dapetin file yg bersangkutan di local lalu hapus agar gak ada sampah
    // biar disk gak makin penuh kata gpt di yutup jelasin depan nya doang fufu
    const barang = await tb_barang.findOne({
      where: {id}
    });

    if (!barang) {
      return res.status(404).json({ msg: "Barang tidak ditemukan" });
    }

    // path file
    // sebenernya bisa langsung pake string tapi rawan error jika beda device
    // tiap koma hanya mewakili tiap folder saja hasil akhirnya berupa path lengkap
    if (barang.image !== null ) {
        const filePath = path.join(
          process.cwd(), //root
          "public/images", //nama folder
          barang.image //nama file
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
    }

    // hapus file jika ada
        const user = await Users.findByPk(req.user.userId, { transaction: t });
        await tb_barang.destroy({
            where: { id },
            transaction: t
        });
        await ActivityLog.create({
            user_name: user.name,
            action: "DELETE",
            description: `menghapus produk ${barang.nama_barang}`,
        },{transaction: t})

        await t.commit()

        res.json({ msg: "Barang dihapus" });
    } catch (error) {
        // ini untuk rollback/ membatalkanseluruh operasi apbila ada salah satu gagal
        await t.rollback();
        console.error("gagal menghapus data", error); 
        res.status(500).json({ error: error.message });
    }
}

// untuk update ya hapus + tambah gitu karna ada refrensi file harus hapus file sebelumnya
export const editProduct = async(req,res) => {
    const {nama_barang, stok_minimum, satuan, harga_beli, harga_jual, material} = req.body;
    const { id } = req.params;
    const image = req.file.filename;
    const t = await db.transaction()


    try {
        const barang = await tb_barang.findOne({
        where: {id}, transaction: t
        });
        console.log(barang);

        if (!barang) {
            return res.status(404).json({ msg: "Barang tidak ditemukan" });
        }

        if (req.file && barang.image) {
            const oldFilePath = path.join(
                process.cwd(),
                "public/images",
                barang.image
            );

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await tb_barang.update(
            {
                nama_barang: nama_barang,
                stok_minimum: stok_minimum,
                satuan: satuan,
                harga_beli: harga_beli, 
                harga_jual: harga_jual, 
                material: material,
                image: image
            },
            {
                where:{
                    id: req.params.id,
                },transaction: t
            }

        );
        const user = await Users.findByPk(req.user.userId,{transaction: t});
        await ActivityLog.create({
            user_name: user.name,
            action: "UPDATE",
            description: `mengedit produk ${nama_barang}`,
        },{transaction: t})

        await t.commit()
        res.json({ msg: "Barang diupdate" });
    } catch (error) {
        await t.rollback()
        console.error("gagal menghapus data", error); 
        res.status(500).json({ error: error.message });
    }
}


