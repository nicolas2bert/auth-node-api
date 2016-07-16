const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const rootPath = path.join(__dirname, 'tests', 'functional');

function installDependency(cwd) {

    // check if package.json exist
    const package = path.join(cwd, 'package.json');
    try {
        fs.statSync(package);
    } catch(e) {
        console.log('package.json Not Found', e);
        return false;
    }

    try {
        // retrun all the buffer at once
        cp.execSync('npm install', {
            // curent directory
            stdio: 'inherit',
            cwd : cwd
        });
    } catch(e) {    
        console.log('unable to install',e);
        return false;
    }
    return true;
}

function runTest(cwd,fileName){
    const testFile = path.join(cwd,fileName);
    console.log('testFile', testFile);
    try{
        const test = cp.spawnSync('mocha', [testFile], {
            cwd : cwd,
            stdio: 'inherit',
        });
        return true;
    }catch(e){
        console.log('Test failed ',e);
        return false;
    }
}

function testing(dir) {
	console.log('testing', dir);
    try {
        const masterConfig = require(path.join(rootPath, dir, 'master.json'));
    } catch (e) {
        console.log('matser.json Not Found', e);
        return false;
    }
    return masterConfig.tests.file.reduce( (prev,file) => {

        // current worker directory
        const cwd = path.join(rootPath, dir);

        if (!(installDependency(cwd))){
            return false;
        }

        return prev && runTest(cwd,file);

    }, true);
}

function main() {
    console.log(`reading dirs in ${rootPath}`);

    const dirs = fs.readdirSync(rootPath);
    console.log('dirs', dirs);
    return dirs.reduce((prev, dir) => {
        console.log('prev', prev);
        const testingResp = testing(dir);
        console.log('testing(dir)', testingResp);
    	return prev && testingResp;
    },true);
}

if (main()) {
    console.log('COCORICO');
    //process.exit(0);
}
console.log('CRASH COCORICO');
//process.exit(1);

