import { Sequelize } from "sequelize";
import db from "../config/database.js";
import tb_barang from "./masterBarang.js";


const { DataTypes } = Sequelize;

const tb_stok = db.define('tb_stok', {
    barang_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        // GUNAKAN ENUM UNTUK MEMBUAT PILIHAN TERBATAS
        type: DataTypes.ENUM('IN', 'OUT', 'ADJUST'),
        allowNull: false,
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

tb_barang.hasMany(tb_stok, {
   foreignKey: 'barang_id',
   onDelete: 'CASCADE',
   onUpdate: 'CASCADE'
})

tb_stok.belongsTo(tb_barang, {
  foreignKey: 'barang_id'
})
// lifcycle sequelize
// beforeValidate
// → validation
// → afterValidate
// → beforeUpdate
// → UPDATE
// → afterUpdate

export default tb_stok;