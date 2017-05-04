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