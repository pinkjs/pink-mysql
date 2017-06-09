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
 * 封装query方法测试环境会输出SQL日志
 * */
if(process.NODE_ENV == undefined || process.NODE_ENV == 'test'){

	model.query = async function ( sql,value ) {
		let formatSql = mysql.format(sql,value);
		if(process.NODE_ENV == undefined || process.NODE_ENV == 'test'){
			console.log(formatSql);
		}
		return await this.pool.queryAsync(sql,value);
	}

}else{

	model.query = async function ( sql,value ) {
		return await this.pool.queryAsync(sql,value);
	}

}

/**
 * 创建数据
 * @param value
 * @param tableName
 * @returns {Promise.<model>}
 * @private
 */
model._create = async function (value,tableName ) {
	let sql = `insert into ${tableName} SET ?`;
	let result = await model.query(sql,value);
	this.insertId = result.insertId;
	return this;
}
model.find =  function ( select, tableName ) {
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

class Mysql {
	constructor(){
		this.sqlStr 	= '';
		this.whereStr = '';
		this.orderStr = '';
		this.limitStr = '';
		this.havingStr = '';
	}

	/**
	 * 创建数据，给出的Object会被解析成SQl的insert语句
	 * @param values
	 * @returns {Promise.<model>}
	 */
	async create(values){
		return await model._create.call(this,values,this.tableName)
	}

	/*
	* 查找数据
	* @param {select} 如 select name form
	* @return {this}
	* */
	find(select){
		let result =  model.find(select,this.tableName);
		this.sqlStr = result;
		return this;
	}

	/**
	 * 执行sql语句，执行之前对sql语句拼装
	 * @returns {Promise}
	 */
	async exec(){
		this.sqlStr += (this.whereStr + this.orderStr + this.limitStr);
		return await model.query(this.sqlStr);
	}

	/**
	 * 组装where条件。支持大于小于等操作
	 * @param obj
	 * @returns {Mysql}
	 * @private
	 */
	_where(obj){
		if(this.sqlStr == undefined){
			throw new Error('not sql');
		}
		if(obj== undefined || Object.keys(obj).length ==0){
			throw new Error('where is null');
		}

		this.whereStr += ` where `;
		for(let k in obj){
			if(typeof obj[k] == 'string'){
				this.whereStr += `${k} = ${obj[k]}`;
				if(Object.keys(obj).length>1){
					this.whereStr += ` and ${k} = ${obj[k]}`;
				}
			}else{
				for ( let condition in obj[k]){
					if(! ['>','<','=','in','like','is not'].includes(condition)){
						throw new Error('where condition not use mysql');
					}
					this.whereStr += `${k} ${condition} ${obj[k][condition]}`;
				}
			}
		}
		return this;
	}

	/**
	 * order by 条件的拼装
	 * @param name
	 * @param type
	 * @returns {Mysql}
	 */
	order(name,type){
		if(this.sqlStr == undefined){
			throw new Error('not sql');
		}
		if( ! (type == 'asc' || type == 'desc') ){
			throw new Error('not type use mysql');
		}

		this.orderStr = ` order by ${name} ${type}`;
		return this;
	}
	limit(start, num){
		if(num == undefined){
			this.limitStr = ` limit ${start}`;
		}else{
			this.limitStr = ` limit ${start} , ${num}`;
		}
		return this;
	}
	having(){
		this.havingStr = ` having `
	}
}

module.exports = Mysql;

/*
 * 连接数据库的方法 配置文件中加载此函数传入配置即可。
 * */
module.exports.connection =  model.connection = function ( config ) {
	model.pool = model.createPool(config);
}
