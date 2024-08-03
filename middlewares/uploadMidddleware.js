import multer from 'multer';
import path from 'path';

const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true);
    }else{
        cb(new Error('Only images are allowed'),false);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const upload = multer({ storage:storage,fileFilter:fileFilter}).single('file')


const uploadFile = async(req,res)=>{
    try {
        upload(req,res,(err)=>{
            if(err){
                return res.status(500).send({
                    success:false,
                    message:err.message
                })
            }else{
                res.status(200).send({
                    success:true,
                    message:"Upload Succesfully"
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
} 

export default uploadFile;






