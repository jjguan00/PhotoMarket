const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const app = express();
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session')
app.use(bodyParser.json());
app.use(express.static( __dirname + '/dist/photoMarket' ));

//Multer's GridFS
const mongoose = require("mongoose");
const multer  = require('multer');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost/photoMarket', { useNewUrlParser: true });
let gfs;
const conn = mongoose.createConnection('mongodb://localhost/photoMarket');

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: 'mongodb://localhost/photoMarket',
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


const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		title: {type: String, required: true , minlength: [4, 'Too Short'], maxlength: 200,},
		desc: {type: String, required: true,  },
		price: {type: Number, required: true, min:1},
		_image: {type: String, required: true},
		_user: {type: Schema.Types.ObjectId, ref: "User", required: true}
	},
	{timestamp: true}
);
mongoose.model('Post', postSchema);
const Post = mongoose.model('Post');

const userSchema = new Schema(
	{
		email: {type: String, required: [true, "E-mail required"] , minlength: [4, 'Too Short'], maxlength: 30, unique: true},
		name: {type: String, required: [true, "name required"],  maxlength: 20},
		password: {type: String, required: true, minlength:7},
		_post: [postSchema]
	},
	{timestamp: true}
);
mongoose.model('User', userSchema);
const User = mongoose.model('User');


app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ["random secret key"],
 
  // Cookie Options
  maxAge: 15 * 60 * 1000 // 15 minutes
}))

app.post('/signUp', function(req,res){
	bcrypt.hash(req.body.password, 10)
	.then(hashed_password => {
		req.body.password = hashed_password
		console.log("You got here.")
			let user = new User(req.body);
			user.save(function(err,user){
			if(err){
				return res.json({error: err})
			}
			else{
			req.session = null;
			return res.json({success:"Successfully saved user."})
		}
		})
	})
	.catch(error => {
		console.log("Error hasing Password.")
		return res.json({error:error})
	});
})

app.post("/logIn", function(req,res){
	console.log("You are at this login 1")
	User.findOne({email: req.body.email}, function(err,user){
		if(err){
			console.log("can't find user")
		}
		else{
			console.log("You are at this login 2")
			bcrypt.compare( req.body.password , user.password)
			.then( result => {
			 	if(result){
			 		req.session.user = user;
					console.log(req.session.user)
					return res.json({data: user});
			 	}
			})
			.catch( error => {
				console.log(error, "This is the error")
				return res.status(401).json('Wrong Password');
			})
		}
	});
	console.log("You are at this login 3")
});

app.get("/checkLogin", function(req,res){
	if(req.session.user){
		return res.json({user: req.session.user})
	}
	else{
		return res.json({error: "You are not log in."})
	}
})

app.post("/createPost", upload.single('image'),function(req,res){
	console.log(req)
	post = Post(req.body);
	post._user = req.session.user._id;
	post._image = req.file.filename
	post.save(function(err, post){
		if(err){
			console.log(err)
			res.json({error:err})
		}
		else{
			User.findOneAndUpdate({_id: req.session.user._id}, { $push: { _post: post  } },{new: true},function(err,user){
				if(err){
					console.log(err)
				}
				else{
					console.log("success")
					console.log(user)
					res.json({user:user, result:post})
				}
			})
		}
	})
})

app.get("/getPosts", function(req,res){
	Post.find({},function(err,posts){
		if(err){
			res.json({error:err})
		}
		else{
			res.json({posts:posts})
		}
	})
})

app.post("/updatePost/:id", function(req,res){
	if(req.session.user){
		Post.findOne({_id: req.params.id}, function(err,post){
			if(err){
				console.log(err)
				res.json({res:err})
			}else{
				if(req.body.title){
					post.title = req.body.title
				}
				if(req.body.price){
					post.price = req.body.price
				}
				if(req.body.desc){
					post.desc = req.body.desc
				}
				console.log(post)
				post.save(function(err){
					if(err){
						console.log(err)
					}
					else{
						console.log("post has been updated")
						res.json({res:"success"})
					}
				})
			}
		})

	}else{
		res.json({res:"You do not have the authority to update."})
	}
})

app.delete("/deletePost/:id", function(req,res){
	console.log("something")
	if(req.session.user){
		Post.findOne({_id: req.params.id}, function(err,post){
			if(err){
				console.log(err, "You have an error finding Post")
			}
			else{
				if(req.session.user._id == post._user){
					console.log(post._image)
					gfs.collection('uploads').remove({ filename: post._image },function(err,obj){
						if(err){
							console.log(err)
						}
						else{
							post.remove(function(err,post){
								if(err){
									console.log(err)
								}
								else{
									User.findOneAndUpdate({_id: req.session.user._id},{$pull: {_post: post}}, {new: true} ,function(err,user){
										if(err){
											console.log(err)
										}
										else{
											console.log("You have successfully removed post and picture")
											res.json({user:user,res:"You have successfully removed post and picture"})
										}
									})
								}
							})
						}
					})
				}
			}
		})
	}else{
		console.log("You didn't log in.")
	}
})
app.get("/logOut", function(req,res){
	if(req.session){
			req.session = null
			console.log(req.session)
			res.json({success:"You have been logged out."})
		}
	else{
		console.log("Not even log in")
		res.json({result: "You are never logged"})
	}
})

app.get('/getImage', (req, res) => {
  gfs.files.find().toArray((err, images) => {
    // Check if files
    if (!images || images.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json({images:images});
  });
});

app.post("/postImage", upload.single('image') ,function(req,res){
	console.log(req.file)
})

app.get('/images/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./dist/photoMarket/index.html"))
});
app.listen(7777, function(){
	console.log("listening to server 7777")
})