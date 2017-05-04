/**
 * Created by zhoujun on 2017/4/17.
 */
'use strict'
const mysql = require('mysql');

Promise = require('bluebird');

const Pool  = require('mysql/lib/Pool');

const Connection = require('mysql/lib/Connection');

Promise.promisifyAll([Pool,Connection]);

const model = Object.create(mysql);


model.query = async function ( sql,value ) {
	let formatSql = mysql.format(sql,value);
	console.log(formatSql);
	return await this.pool.queryAsync(sql,value);
}

model._create = async function (value,tableName ) {
	let sql = `insert into ${tableName} SET ?`;
	let result = await this.query(sql,value);
	return this;
}
model.find = async function ( select, tableName ) {
	let sql = ''
	if(select == undefined){
		sql = `select * from ${tableName}`;
	}else{
		sql = `select ? from ${tableName}`;
	}
	sql = mysql.format(sql,[select]);
	//let result = await this.query(this.sql,[select]);
	return sql;
}

model.where  = function ( obj ) {

}

model.exec = function (  ) {
	
}

class Mysql {
	constructor(){
		this.sqlStr 	= '';
		this.whereStr = '';
		this.orderStr = '';
		this.limitStr = '';
	}
	async create(values){
		return await model._create(values,this.tableName)
	}
	async find(select){
		let result = await model.find(select,this.tableName);
		this.sqlStr = result;
		return this;
	}
	/*
	* 执行sql语句，执行之前对sql语句拼装
	* */
	async exec(){
		this.sqlStr += (this.whereStr + this.orderStr + this.limitStr);
		return await model.query(this.sqlStr);
	}
	where(obj){
		if(this.sqlStr == undefined){
			throw new Error('not sql');
		}
		this.whereStr += ` where`;

		for(let k in obj){
			this.whereStr += `${k} = ${obj[k]}`;
			if(Object.keys(obj).length>1){
				this.sqwhereStrl += ` and ${k} = ${obj[k]}`;
			}
		}
		return this;
	}

	order(name,type){
		if(this.sqlStr == undefined){
			throw new Error('not sql');
		}

		this.orderStr = ` order by ${name} ${type}`;
	}
	limit(start, num){
		if(num == undefined){
			this.limitStr = `limit ${start}`;
		}else{
			this.limitStr = `limit ${start} , ${num}`;
		}
	}
	having(){

	}
}

module.exports = Mysql;

/*
 * 连接数据库的方法
 * */
module.exports.connection =  model.connection = function ( config ) {
	model.pool = model.createPool(config);
}
