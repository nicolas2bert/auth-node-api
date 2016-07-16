'use strict'

const assert = require('assert');
const http = require('http');
const cp = require('child_process');
const process = require('process');
const request = require('request');
const command = 'curl';

// function exec(done){
// 	console.log('here2');
// 	request('http://www.google.com', function (error, response, body) {
// 		console.log('cococococo');
// 	  if (!error && response.statusCode == 200) {
// 	    console.log(body) // Show the HTML for the Google homepage.
// 	    done();
// 	  }
// 	})
// }

function exec_code(http_req, route, args, done) {
	const allArgs = ['-X', http_req, 'http://127.0.0.1:8000/'+route].concat(args);
	const child = cp.spawn(
		command
		, allArgs
		, {stdio:'inherit'}
	);
	//process.stdout.write('okok');
	child.on('exit', (code) => {
		assert.strictEqual(code, 0, 'Expected exit code (0)');
		done();
	});
}

function exec_res(http_req, route, args, cb) {
	const allArgs = ['-X', http_req, 'http://127.0.0.1:8000/'+route].concat(args);
	const child = cp.spawn(
		command
		, allArgs
		//, {stdio:'inherit'}
	);

	let result = "";
	child.stdout.on('data', function(data) {
        result += data.toString();
    });

    child.on('close', function(code) {
        return cb(null,JSON.parse(result));
    });
}



describe('HTTP', function() {
    describe('Perfect Login', () => {

    	const route = 'login';
    	const http_request = 'POST'
    	const args = [
    		'-d'
    		, '{"username":"xyz","password":"xyz"}'
    		, '-H'
    		, 'Content-Type: application/json'
    	];
    	//const args = [];

        it('Should exit code 0', function(done) {
        	exec_code(http_request, route, args, done);
        });

        it('Should return exprire/user/token', function(done){
        	exec_res(http_request, route, args, (err, res) => {

        		const token = res['token'];
        		const expires = res['expires'];
        		const user = res['user']

        		assert.notStrictEqual(token, undefined);
        		assert.notStrictEqual(expires, undefined);
        		assert.notStrictEqual(user, undefined);

        		//assert.isDefined()
        		done();
        	});
        });

    });
});
