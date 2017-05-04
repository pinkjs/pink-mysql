/**
 * Created by zhoujun on 2017/5/4.
 */

var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Mysql = require('../src/mysql');

describe('mysql', function() {
	it('find() should return 0 if no items are passed in', function() {
		var mysql = new Mysql([]);
		mysql.tableName = 'user'
		Promise.resolve(mysql.find());
		expect(mysql.sql).to.equal('select * from user');
	});
});