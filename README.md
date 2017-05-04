# pink-mysql

pink-mysql是 [pinkjs](https://github.com/pinkjs/pink) 的MySql模块。此模块为可选模块、为pinkjs框架设计,并且结合bluebird的Promise实现异步

功能：

1. 实现基础的AR模型功能。
2. 在连接池的基础上支持事务
3. 可选直接写sql语句的方式，sql统一管理。
4. 每条Sql语句都有log，可以设置开启关闭



# API

1. connection 连接数据库的方法、默认使用连接池的方式。
2. query 异步查询数据库。
3. find  
4. creatre
5. update
6. delete


# 快速开始

配置文件
```js
const Mysql = require('pink-mysql');

//连接数据库
const connection = require('pink-mysql').connection;
connection({
	user:  'root',
	password: '',
	database: 'pinkmysql',
	host: '127.0.0.1',
	charset: 'utf8mb4',
	connectionLimit : 200
});
```

使用模型

```js
const Mysql = require('pink-mysql');
//使用模型
class User extends Mysql{

	constructor(){
		super();
		this.tableName = 'users';
	}

}

let user = new User();

let result = user.find('username')._where({id:{'<':442288}}).order('created_time','desc').limit(2).exec();
//返回Promise对象
result.then((r)=>{
	console.log(r)
})
//得到的结果
[ RowDataPacket { username: 'username' },
  RowDataPacket { username: 'username' } ]

```