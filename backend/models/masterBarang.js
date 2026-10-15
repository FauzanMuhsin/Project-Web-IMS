import { Sequelize } from "sequelize";
import db from "../config/database.js";
import { customAlphabet } from "nanoid";

const generateSKU = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6
)


const { DataTypes } = Sequelize;
// ini biar query insert tanpa ID akan aman
// CREATE EXTENSION IF NOT EXISTS pgcrypto;

const tb_barang = db.define('tb_barang', {
    id: {
        type: DataTypes.UUID,
        // ini klo dari sisi sequelize
        defaultValue: DataTypes.UUIDV4,
        // sedangkan untuk di sql itu gini 
        // gen_random_uuid();
        primaryKey: true
    },
    sku: {
        type: DataTypes.STRING(15),
        unique: true,
        allowNull: false
    },
    nama_barang: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        // allowNull: true
    },
    stok_minimum: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    satuan: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'unit'
    },
    harga_beli: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    harga_jual: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    material: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    freezeTableName: true
});

// sebelumnya pake beforecreate, gak bisa karna ada validasi not null
tb_barang.beforeValidate((product) => {
    product.sku = `PRD-${generateSKU()}`
})

// lifcycle sequelize
// beforeValidate
// → validation
// → afterValidate
// → beforeUpdate
// → UPDATE
// → afterUpdate

export default tb_barang;