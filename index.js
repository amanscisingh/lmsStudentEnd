const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const moment = require('moment');
const cors = require('cors');

//imports for file upload
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const app = express();

// using body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// using dotenv
require('dotenv').config({ path: './config/.env' })
const URL = process.env.MONGODB_URI.toString();
const PORT = process.env.PORT;

// setting templating engineapp.engine('.hbs', exphbs({helpers:{ formatDate, indexing }, defaultLayout: 'main', extname: '.hbs'}));
function parseToString(input) {
    return input.toString();
};


// format marks assigned
function formatAssignedMarks(marks) {
  let temp;
  if (marks === -1) {
    return 'Not assigned'
  } else {
    return marks  }
}

// handlebars helpers
function formatDate(date, format) {
    if (date === 'NA') {
      return "NA"
    } else {
      return moment(date).format(format)
    }
};

function formatPassword(password) {
  if (password.length === 0) {
    return 'NA';    
  } else {
    return password
  }
}

app.engine('.hbs', exphbs({helpers:{ parseToString, formatDate, formatAssignedMarks, formatPassword}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// setting up public folder
const __dirname__ = path.resolve();
app.use(express.static(path.join(__dirname__, 'public')));

// connecting to db and starting the server
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(PORT, console.log(`Server running on port ${PORT} and DB is connected as Well!!! `))
}).catch((err)=>{
    console.log('Error: ', err.message);
})


// for file UPLOAD
const con = mongoose.createConnection(URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true 
});

con.then( () => { 
    console.log(`Files upload DB is connected as well!!!`) 
})

//INIT gfs
let gfs;
con.once('open', () => {
    //initialize stream
    gfs = Grid(con.db, mongoose.mongo);
    gfs.collection('uploads');
});


//create storage engine
const storage = new GridFsStorage({
    url: URL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
}   
});   

const upload = multer({ storage });

app.use(cors());
app.use(methodOverride('_method'));

// using cokie parser
app.use(cookieParser());

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/studentDashboard', require('./routes/studentDashboard'));
app.use('/api', require('./routes/api'));


app.post('/upload', upload.single('file'), (req, res) => {
    try {
        console.log('post request received');
        res.send({ file: req.file });
    } catch (error) {
        res.send(error);
    }
})

app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }

    // Files exist
    return res.json(files);
});
});


app.get('/open/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
        });
        }

        // // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'application/pdf' || file.contentType === 'application/octet-stream' || file.contentType === 'text/plain') {
        // Read output to browser
            const readstream = gfs.createReadStream(file);
            readstream.pipe(res);
            } else {
            res.status(404).json({
                err: 'Not an image'
        });
        }
    });
});

