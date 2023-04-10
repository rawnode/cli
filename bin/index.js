#!/usr/bin/env node

"use strict";

/**
 * @author Ericson S. Weah  <ericson.weah@gmail.com> <https://github.com/eweah>  <+1.385.204.5167>
 *
 * @module CLI
 * @kind class
 *
 * @extends Base
 * @requires Base
 *
 * @classdesc CLI class
 */

 const fs = require('fs');
 const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

class CLI extends require("../modules/base") {

  constructor(...arrayOfObjects) {

    super({ objectMode: true, encoding: "utf-8", autoDestroy: true });

    arrayOfObjects.forEach(option => {
        if(Object.keys(option).length > 0){
            Object.keys(option).forEach((key) => { if(!this[key]) this[key] = option[key];})
        }
    });

    // auto bind methods
    this.autobind(CLI);
    // auto invoke methods
    this.autoinvoker(CLI);
    // add other classes method if methods do not already exist. Argument order matters!
    // this.methodizeProperty(require('../src')())
    //Set the maximum number of listeners to infinity
    this.setMaxListeners(Infinity);
  }


  command(index = 2){
    return process.argv[index]
 }
 async createProject(path = this.path(this.command(3))){
  //git@gitlab.com:node-mvc/ongo/ongo.git

  const { stdout, stderr } = await exec(`bash ./install.sh ${path}`);
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
 }
 async commands(){
  switch(this.command(2)){
      case "new":
        if(this.command(3) && this.command(3).trim().length !== 0){
           if(fs.existsSync(this.path(this.command(3)))) return console.log('project already exists!')
           fs.mkdir(this.path(this.command(3)), {recursive: true, mode: '777'}, error => {
             if(error) return console.log(error.message);
           })
           console.log(this.Red('creating project, please wait ....'));
           await exec(`git clone git@github.com:ongojs/ongojs.git ${this.path(this.command(3))}`);
           process.chdir(this.path(this.command(3)));
           await exec(`git checkout dev`);
          //  await exec(`rm -rdf .git`);
          //  await exec(`npm install`);
          //  await exec(`npm update`);
          //  await exec(`npm link ./`);
          // yarn 
          await exec(`rm -rdf .git`);
          await exec(`yarn `);
          // await exec(`npm update`);
          await exec(`npm link ./`);
          await exec(`ongo make:http-route UserRouter`);
          await exec(`ongo make:tcp-route UserRouter`);
          console.log(this.Green(`Project ${this.path(this.command(3)).split('/')[this.path(this.command(3)).split('/').length - 1]} created!`));
         
        }else{
          return console.log('project name required')
        }
       
        break;
      case "man":
        console.log('make man page');
        break;
      case "help":
        console.log("help man page");
        break;
      default: 
        console.log("invalid command ...");
        break;
  }
}

  init(){
    this.commands();
  }
  /**
   * @name autoinvoked
   * @function
   *
   * @param {Object|Function|Class} className the class whose methods to be bound to it
   *
   * @description auto sets the list of methods to be auto invoked
   *
   * @return does not return anything
   *
   */

     autoinvoked() {
      return ["init"];
    }

}

module.exports = new CLI;