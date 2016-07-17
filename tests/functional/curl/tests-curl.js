'use strict'

const assert = require('assert');
const http = require('http');
const cp = require('child_process');
const process = require('process');
const request = require('request');
const command = 'curl';

/**
 * @param  String http_req : request http ex: GET/PUT/POST/DELETE 
 * @param  String route : http route ex: http://127.0.0.1/YOUR_ROUTE_HERE
 * @param  Array args : array of curl arguments ex: header... 
 * @param  {Function} done: callback
 * @return none
 */
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

    	const http_request = 'POST'
        const route = 'login';
    	const args = [
    		'-d'
    		, '{"username":"xyz","password":"xyz"}'
    		, '-H'
    		, 'Content-Type: application/json'
    	];
    	//const args = [];

        it('Should exit code 0', (done) => {
        	exec_code(http_request, route, args, done);
        });

        it('Should return exprire/user/token', (done) => {
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

    describe('Get v1/api/event', function(){

        const http_requestB = 'POST';
        const routeB = 'login';
        const argsB = [
            '-d'
            , '{"username":"xyz","password":"xyz"}'
            , '-H'
            , 'Content-Type: application/json'
        ];
        let token = "";
        before('First, login', (done) => {
            exec_res(http_requestB, routeB, argsB, (err, res) => {
                token = res['token'];
                console.log('TOKEN  ',token);
                done();
            });
        });

        it('Then, check if the token has been generated', () => {
            assert.notStrictEqual(token, undefined);
        });

        it('Then, GET api/v1/events : try to access event', (done) => {
            const http_request = 'GET';
            const route = 'api/v1/events';
            const args = ['-H', 'x-access-token:'+token];
            exec_res(http_request, route, args, (err, res) => {
                assert.strictEqual(res, 'getAll', 'GET do not return "getAll"');
                done();
            });
        });

    });




});
