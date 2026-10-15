import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ActivityLog = db.define('activity_logs', {
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: true 
});

export default ActivityLog;
