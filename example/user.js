/**
 * Created by zhoujun on 2017/5/4.
 */

const Mysql = require('../');

//连接数据库
const connection = require('../src/mysql').connection;

connection({
	user:  process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PWD || '',
	database:  process.env.MYSQL_DB ||'colorx',
	host:  process.env.MYSQL_HOST ||'127.0.0.1',
	charset: 'utf8mb4',
	connectionLimit : 200
});


//使用模型
class User extends Mysql{

	constructor(){
		super();
		this.tableName = 'users';
	}

	get userinfo(){

	}
}

let user = new User();

//let result = user.find('username')._where({id:{'<':442288}}).order('created_time','desc').limit(2).exec();
//result.then((r)=>{
//	console.log(r)
//})

 user.create({
	device_id: 1112,
	created_time: 1122
}).then((re)=>{
 	//console.log(re);
 	console.log(11);
 	console.log(user.insertId);

 });