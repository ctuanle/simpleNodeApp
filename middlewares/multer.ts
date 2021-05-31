import multer from 'multer';

const storage = multer.diskStorage({
    destination : 'data/images/',
    filename : function(req, file, cb) {
        cb(null, Date.now() +'-'+ file.originalname);
    }
})

const upload = multer({storage: storage});

export default upload;