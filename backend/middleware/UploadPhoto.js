import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    // tempat tujuan file disimpan
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    // ini untuk penamaan file nya
    filename: (req, file, cb) => {
        // parameter cb (error, hasil)
        cb(
            null,
            // format penamaan nya tanggal + eksistensi file dari nama asli file
            Date.now() + path.extname(file.originalname)
        )
    }
})

export const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024  // 2 mb
    }   
})