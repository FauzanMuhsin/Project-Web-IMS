import Users from "../models/usermodel.js";
import ActivityLog from "../models/logActivity.js";
import db from "../config/database.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


export const getUser = async(req,res) => {
    try {
        const users =await Users.findOne({
            attributes:['id', 'name', 'email', 'role'],
            where:{
                email: req.email
            }
        });
        res.json(users);
    } catch (error) {
        console.error("LOG ERROR POSTGRES:", error); 
        res.status(500).json({ error: error.message });
    }
}

export const getUser2 = async(req,res) => {
    try {
        const { id } = req.params;

        const Barang =await Users.findOne({
            where:{ id }
        });
        res.json(Barang);
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}

export const getUsers = async(req,res) => {
    try {
        const users =await Users.findAll({
            attributes:['id', 'name', 'email', 'role'],
            where:{
                role: "user"
            }
        });
        res.json(users);
    } catch (error) {
        console.error("LOG ERROR POSTGRES:", error); 
        res.status(500).json({ error: error.message });
    }
}


export const register = async(req,res) => {
    const {name, email,role , password, confPassword} = req.body;
    if (password !== confPassword) return res.status(400).json({msg: "password gak cocok"})
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            name: name,
            email: email,
            role: role,
            password: hashPassword,
        })
        res.json({msg:"register berhasil"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
}

export const login = async(req, res) => {
    const t = await db.transaction()
    try {
        const user = await Users.findOne({
            where:{
                email: req.body.email
            },transaction: t
        })
        if (user === null) {
            return res.status(400).json({msg:"email tidak ditemukan"})
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) return res.status(400).json({msg:"wrong password"})
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        const accessToken = jwt.sign({userId, name, email, role}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign({userId, name, email, role}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        })
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            },transaction: t
        })
        await ActivityLog.create({
            user_name: user.name,
            action: "LOGIN",
            description: `${user.name} telah login`,
        },{transaction: t})
        res.cookie('refreshToken', refreshToken,{
            // untuk nyembunyiin token
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // secure: true
        })
        await t.commit()
        res.json({accessToken})
    } catch (error) {
        await t.rollback()
        console.log(error)
        res.status(404).json({msg:"email tidak ditemukan"})
    }
}

export const logOut = async (req, res) => {
    const t = await db.transaction()
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204);
        const user = await Users.findOne({
            where:{
                refresh_token: refreshToken
            }, transaction:t
        })
        if (!user) return res.sendStatus(204);
        const userId = user.id;
        await Users.update({refresh_token: null},{
            where:{
                id: userId
            }, transaction:t
        })
        await ActivityLog.create({
                user_name: user.name,
                action: "LOGOUT",
                description: `${user.name} telah logout`,
            },{transaction: t})
        res.clearCookie('refreshToken');
        await t.commit()
        return res.sendStatus(200)
    } catch (error) {
        await t.rollback()
        console.log(error)
        res.status(401).json({msg:"gagal logout"})
    }
}

export const editUser = async(req,res) => {

    const { password, confPassword} = req.body;
    // pasworrd nya jangan lupa di hash ketika di edit]
    // buat kondisi ketika gak ingin ganti password gak usah hash password
    if (password !== confPassword) return res.status(400).json({msg: "password gak cocok"})
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    const t = await db.transaction()
    try {
        const user = await Users.findByPk(req.user.userId,{transaction: t});
        const nama = await Users.findOne({where:{ id:req.params.id} , transaction:t})
        await Users.update(
            // tiap parameter punya {} sendiri
            {
                password: hashPassword,
            },
            {
                where:{
                    id: req.params.id,
                },
                transaction: t
            }
        );
        await ActivityLog.create({
            user_name: user.name,
            action: "UPDATE",
            description: `mengganti password akun ${nama.name}`,
        },{transaction: t})

        await t.commit()
        res.json({ msg: "user telah diupdate" });
    } catch (error) {
        await t.rollback()
        console.error("gagal mengedit data", error); 
        res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async(req,res) => {
    const t = await db.transaction()
    try {
        const { id } = req.params;
        const user = await Users.findByPk(req.user.userId,{transaction: t});
        const nama = await Users.findOne({where: {id},transaction:t})
        await Users.destroy({
            where: { id },
            transaction: t
        });
        await ActivityLog.create({
            user_name: user.name,
            action: "DELETE",
            description: `menghapus akun ${nama.name} dengan role ${nama.role}`,
        },{transaction: t})

        await t.commit()
        res.json({ msg: "Barang dihapus" });
    } catch (error) {
        await t.rollback()
        console.error("gagal menghapus data", error); 
        res.status(500).json({ error: error.message });
    }
}