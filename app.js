//saurabh
//saurabh.simpy@gmail.com

//import json
//mongoimport --db piyus --collection grade --file q1.json

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/piyus')

var db = mongoose.connection

db.on('error',console.error.bind(console, 'connection error'))

//define schema for modelling
var gradeSchema = mongoose.Schema( {
    student_id: Number,
    type: String,
    score: Number
})

var grade = mongoose.model('grade',gradeSchema,'grade')

//for example 
//find someone with id
function findSomeByID(id){
	grade.find({"student_id":id}, function(err,doc){
		if(err){
			console.log('findSome :'+ err)
			return
		}
		console.log('find :'+ doc)
	})
}

var count = 0

//get total count
grade.count({'type':'homework'},function(err,c){
		count = c
		//console.log(c)
	})



	

function findSomeByTypeAndRemove(type){
	grade.find({'type':type},'student_id type score',{sort:{student_id:1,score:1}}, function(err,docs){
		if(err){
			console.log('findSome :'+ err)
			return
		}
		var sid = -1

		docs.forEach(function(doc){
			if(sid != doc.student_id){
					grade.remove({'_id':doc._id},function(err){
						console.log(doc._id+'   '+err)
					});
				}
				sid = doc.student_id
		})
		
	})
}

//excuete once 
//will remove all homework with lowest score
//findSomeByTypeAndRemove('homework')

//test 1
function getCount(){
	grade.count(null,function(err,c){
		console.log('Total :'+c)
	})
}
getCount() //600

//test2
grade
.find()
.sort('-score')
.skip(100)
.limit(1)
.exec(function(err,doc){
	console.log('test 2 : '+doc)
})

//test3
grade
.find()
.select({'student_id':1,'type':1,'score':1,'_id':0})
.sort({'student_id':1,'score':1})
.limit(5)
.exec(function(err,doc){
	console.log('test 3 '+doc)
})

//ans
grade
.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}})
.sort('-average')
.limit(1)
.exec(function(err,doc){
	if(err){
			console.log('findSome :'+ err)
			return
		}
	console.log('______________________Answer_________________________')
	console.log(doc)
	console.log('______________________Answer_________________________')
})
