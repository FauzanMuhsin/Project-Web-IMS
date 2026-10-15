import ActivityLog from "../models/logActivity.js";

export const logActivity = async(req,res) => {
    try {
        const data = await ActivityLog.findAll({
            attributes:['user_name', 'action', 'description','createdAt'],
            order: [[ 'updatedAt', 'DESC']] 
        })
        res.json(data)
    } catch (error) {
        console.error("ambil data bermasalah", error); 
        res.status(500).json({ error: error.message });
    }
}