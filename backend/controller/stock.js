import tb_stok from "../models/stockBarang.js";
import tb_barang from "../models/masterBarang.js";
import Users from "../models/usermodel.js";
import ActivityLog from "../models/logActivity.js";
import { Op, where } from "sequelize";
import { Sequelize } from "sequelize";
import { raw } from "express";
import db from "../config/database.js";

export const editStock = async (req,res) => {
    const {barang_id, qty, type, keterangan} = req.body;
    const t = await db.transaction()

    try {
        // sebelumnya gw mikirnya gini => if(type == "IN") return qty;
        const normalizeQty = (qty, type) => {
            // math.abs adalah value absolut
            if (type === "IN") return Math.abs(Number(qty));
            if (type === "OUT") return -Math.abs(Number(qty));
            if (type === "ADJUST") return Number(qty);
            return 0;
        };
        const user = await Users.findByPk(req.user.userId,{transaction: t});
        await tb_stok.create({
            barang_id: barang_id,
            qty: normalizeQty(qty, type),
            type: type,
            keterangan: keterangan,
        },{transaction: t})
        await ActivityLog.create({
            user_name: user.name,
            action: "UPDATE",
            description: `mengedit produk ${req.body.nama_barang} dengan tipe ${type}`
        },{transaction: t})

        await t.commit()
        res.json({msg:"data stock telah masuk"})
    } catch (error) {
        await t.rollback()
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
}

export const Detail = async(req,res) => {
    try {
        const id  = req.params.id;
        // pakai kurung siku biar klo misal punya relasi tabel banyak bisa langsung di panggil semua
        // klo gak pake nanti error expect array
        const Barang =await tb_stok.findAll({
            attributes: ['keterangan' ,'type' ,'qty',"updatedAt"],
            include: [{
                model: tb_barang,
                attributes: ['id', 'nama_barang']
            }],
            order: [['updatedAt', 'DESC']],
            where: {barang_id: id}
        }
    );
        res.json(Barang);
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}

export const getStock = async(req,res) => {
    try {
        const Barang =await tb_stok.findOne({
            where:{
                id: req.params.id
            }
        },
        {
        include: [{
            model: tb_barang,
            attributes: ['id','sku', 'nama_barang']
        }]
    });
        res.json(Barang);
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}

export const searchBarang = async (req, res) => {
    // Itu namanya object destructuring (fitur ES6).
    const { q } = req.query;

    if (!q) return res.json([]);

    const data = await tb_barang.findAll({
        attributes:["id", "nama_barang"],
        where: {
        nama_barang: {
            // iLike itu case-insensitive dan hanya postgre, klo Like itu sensitive dan global
            [Op.iLike]: `%${q}%`
        }
        },
        limit: 5
    });

    res.json(data);
};

// ===========================
// SELESAIN BUAT DASHBOARD!!!!
// ===========================
// harus nya berdasarkan qty negatif dan qty postif
export const stockDayAgo = async (req, res) => {
    try {
        
        const start = new Date();
        // ambil hari kemarin
        start.setDate(start.getDate() - 1);
        // dan set mulai dari jam 00:00
        start.setHours(0, 0, 0, 0);
        
        const end = new Date();
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        
        const dataKemarin = await tb_stok.findAll({
            where: {
                type: "IN",
                createdAt: {
                    [Op.between]: [start, end],
                },
            },
        });

        console.log(dataKemarin);
        res.json(dataKemarin);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};
export const stockOutDayAgo = async (req, res) => {
    try {
        
        const start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date();
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        
        const dataKemarin = await tb_stok.findAll({
            where: {
                type: "OUT",
                createdAt: {
                    [Op.between]: [start, end],
                },
            },
        });

        console.log(dataKemarin);
        res.json(dataKemarin);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// ================
// ---PAGINATION---
// ================
export const getStocks = async(req,res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search_query || "";
        const offset = limit * page;
            const totalData =await tb_stok.findAll({
                attributes: ['barang_id',
                    [
                        Sequelize.literal(`
                            SUM(
                                CASE
                                    WHEN type = 'IN' THEN qty
                                    WHEN type = 'OUT' THEN -qty
                                    WHEN type = 'ADJUST' THEN qty
                                END
                            )
                            `),
                            'total_stok'
                    ]
                ],
                // tinggal kasih where nya ap
            include: [{
                model: tb_barang,
                attributes: ['sku', 'nama_barang'],
                where:{
                            [Op.or]: [{nama_barang:{
                                [Op.like]: '%'+search+'%'
                            }},{sku:{
                                [Op.like]: '%'+search+'%'
                            }}]
                        }
            }],
            group: ['tb_stok.barang_id', 'tb_barang.id']
            // WAJIB kalau pakai aggregate + include
            // raw => biar hasil lebih bersih aja. pilihan boss
            // raw: true
        });
        const totalRows = totalData.length;
        const totalPage = Math.ceil(totalRows / limit);
        const result =await tb_stok.findAll({
                attributes: ['barang_id',
                    [
                        Sequelize.literal(`
                            SUM(
                                CASE
                                    WHEN type = 'IN' THEN qty
                                    WHEN type = 'OUT' THEN -qty
                                    WHEN type = 'ADJUST' THEN qty
                                END
                            )
                            `),
                            'total_stok'
                    ]
                ],
                // tinggal kasih where nya ap
            include: [{
                model: tb_barang,
                attributes: ['sku', 'nama_barang'],
                where:{
                            [Op.or]: [{nama_barang:{
                                [Op.like]: '%'+search+'%'
                            }},{sku:{
                                [Op.like]: '%'+search+'%'
                            }}]
                        }
            }],
            // ambil data mulai dari data tertentu
            offset: offset,
            // ambil beberapa data awal saja
            limit: limit,
            group: ['tb_stok.barang_id', 'tb_barang.id']
        });
        res.json({
            result: result,
            page: page,
            limit: limit,
            totalPage: totalPage,
            totalRows: totalRows
        })
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}



