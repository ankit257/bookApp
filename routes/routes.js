var User = require('../models/user');
var Book = require('../models/book');
var passport = require('passport');
var http = require('http');
var parser = require('xml2json');

module.exports = function (app, passport) {
	/**
	* API to fetch data from API
	*/
	app.post('/api/getbooksbyname', function (req, res){
		var srchString = req.body.string;
		var pageNo = req.body.pageNo;
		var path = '/search.xml?key=NTcszTsI9kaNDz2J75S3A&q='+srchString+'&page='+pageNo;
		var options = {
		  host: 'www.goodreads.com',
		  port: 80,
		  path: path,
		  method: 'GET'
		}
		cURLRequest(options, function(data){
			res.json({'data' : data})
		});
	});
	/**
	*Route to get book info from Book ID using Goodreads Book ID
	*/
	app.post('/api/getbookinfonearby', function (req, res){
		var format = req.body.format;
		var bookId = req.body.id;
		var coordinates = req.body.coordinates;
		console.log(coordinates);
		Book.findById(bookId, function (err, book){
			User.findNearByWithBook(bookId, coordinates, 50, 1, function (err, users){
				if(err)
					console.log(err);
				var data = {
					book : book,
					users : users
				}
				res.json({'data' : data});
			});
		})
	});
	/**
	*Route to get book info from Book ID using Goodreads Book ID
	*/
	app.post('/api/getbookinfo', function (req, res){
		var format = req.body.format;
		var id = req.body.id;
		var path = '/book/show/'+id+'?format='+format+'&key=NTcszTsI9kaNDz2J75S3A';
		var options = {
		  host: 'www.goodreads.com',
		  port: 80,
		  path: path,
		  method: 'GET'
		}
		cURLRequest(options, function(data){
			var dataJson = JSON.parse(data);
			var isbn = dataJson.GoodreadsResponse.book.isbn13;
			var user = new User();
			if(req.user){
				var userId = req.user._id;
				user.getBookStaus(userId, isbn, function (err, status){
					if(err){
						res.json({'error' : err})
					}
					res.json({'data' : data, 'status' : status})
				});
			}else{
				res.json({'data' : data, 'status' : 'NA'})
			}
		});
	});
	app.post('/api/updatestatus', function (req, res){
		var bookId = req.body.id;
		var status = req.body.status;
		var user = req.user;
		if(user){

		}else{
			//throw login information to client
		}
	});
	app.post('/api/addbook', function (req, res){
		var book = {
			isbn13 	: req.body.isbn13,
			title 	: req.body.title,
			author 	: req.body.author,
			status 	: req.body.status,
			image 	: req.body.image,
		}
		if(book.status == 'OWN'){
			// var user = req.user;
			var userId = req.user._id;
			User.addBook(userId, book, function (err, status){
				if(err)
					res.json({'error' : err})
				res.json({'status' : status})
			})
		}
	});
	/**
	* Route to get Near By Books
	*/
	app.post('/api/getnearby', function (req, res){
		var coordinates = [req.body.longitude, req.body.latitude];
		var pageNo = req.body.pageNo;
		if(!pageNo){
			pageNo = 1;
		}
		User.findNearBy(coordinates, 50, pageNo, function (err, data){
			if(err)
				console.log(err);
			console.log(data);
			res.json({'data' : data});
		});
	});
	/**
	* Route to get Logged in User Object
	*/
	app.post('/api/auth', function (req, res){
		// console.log(req)
		res.json({'req' : req.headers})
	});
	/**
	* Log in User with User Object retrieved from Client Side
	*/
	app.post('/api/login', passport.authenticate('local'), function (req, res) {
	    res.json({'req': req.user});
	});
	/**
	* Form Submit
	*/
	app.post('/api/formsubmit', function (req, res) {
		fs.readFile(req.files.displayImage.path, function (err, data) {
			var newPath = __dirname + "/uploads/uploadedFileName";
			fs.writeFile(newPath, data, function (err) {
			res.redirect("back");
			});
		});
	});
	/**
	* Log out user and destroy Session
	*/
	app.post('/api/logout', function (req, res){
		req.logout();
		res.json({'req': req.user});
	});
	/**
	* Home 
	*/
	app.get('/', function (req, res){
		res.sendFile('www/index.html', { root: app.get('rootDir')});
	});
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
function cURLRequest(options, callback){
	return http.get(options, function (response) {
		var body = '';
		response.on('data', function(d) {
            body += d;
        });
		response.on('end', function(d){
			var json = parser.toJson(body); //Convert XML to JSON
			callback(json);
		});
	})
}

