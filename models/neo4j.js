const neo4j = require('neo4j-driver');
const config = require('config');

// const driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j","admin123456"));
const driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j","admin123456"));

module.exports ={
    getSession : function (context) {
        return context.neo4jSession? context.neo4jSession:driver.session();
    }
}