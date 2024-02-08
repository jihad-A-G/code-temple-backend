import multer from "multer";
//Specify where to store the app images (the images folder), and how the naming should be.
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb) =>{
        cb(null, `${file.originalname}`);
    }
});

//Types of file that multer could accept and parse.
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload= multer({storage:storage,fileFilter:fileFilter});

export default upload;
