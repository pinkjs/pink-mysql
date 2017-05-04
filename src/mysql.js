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


/*
* 连接数据库的方法
* */
model.connection = function ( config ) {
	this.pool = model.createPool(config);
}

model.query = async function ( sql,value ) {

	return await this.pool.queryAsync(sql,value);
}

model._create = async function (value,tableName ) {
	let sql = `insert into ${tableName} SET ?`;
	let result = await this.query(sql,value);
	return this;
}
model.find = async function ( select = '*', tableName ) {
	this.sql = `select ? from ${tableName}`;
	return this;
}

class Mysql {
	constructor(){

	}
	create(values){
		return model._create(values,this.tableName)
	}
	find(select){
		return model.find(select,this.tableName);
		this.sql = model.sql;
	}
}

module.exports = Mysql;