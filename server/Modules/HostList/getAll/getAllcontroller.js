const GetAllInfo = require('./getAllModel');

const getallinfo = async (req, res) => {
    try {
        const properties = await GetAllInfo.getAllCombinedInfo();
        res.status(200).json({
            success: true,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getHostById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Host ID is required"
            });
        }

        const host = await GetAllInfo.getCombinedInfoById(id);
        
        if (!host) {
            return res.status(404).json({
                success: false,
                message: "Host not found"
            });
        }

        res.status(200).json({
            success: true,
            data: host
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getallinfo,
    getHostById
};
