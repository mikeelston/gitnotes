#!/usr/bin/env node
// "use strict";
const fs      = require('fs');
const path    = require('path');
const table   = require('markdown-table')
const program = require('commander');
const Git     = require("nodegit");
const moment  = require("moment");
moment.suppressDeprecationWarnings = true;

var gitRepoPath  = '';
var outputFile   = '';
var sinceDate    = '';
var commitsArray = [];

program
.arguments('<gitrepo>')
.arguments('<output>')
.option('-s, --since <since>', 'Only show commits since date provided e.g."2019-01-01 12:00:00"')
.action(function(gitrepo,output,since) {
  gitRepoPath = gitrepo;
  outputFile  = output;
  sinceDate   = ""
  if(typeof program.since !== 'undefined'){
    sinceDate = moment(program.since).isValid() ? moment(program.since).format() : '';
  }
  // console.log(`${gitrepo} -> ${output} --since ${sinceDate}`);
})
.parse(process.argv);

if(gitRepoPath != '' && outputFile != ''){
  let thisPath = path.resolve(gitRepoPath);
  Git.Repository.open(thisPath)
  .then( repo => {
    return repo.getHeadCommit();
  })
  .then( headCommits => {
    var history = headCommits.history();
    history.on("commit", function(commit) {
      // console.log(moment(sinceDate).format());
      // console.log(moment(commit.date()).format())
      let startDate = moment(commit.date());
      let endDate   = moment(sinceDate);
      
      
      if( sinceDate !== ''  && startDate.diff(endDate) > 0){
        // console.log(`${endDate} | ${startDate} | ${startDate.diff(endDate, 'days')}`)
        // console.log(`date limit: ${startDate.format()}`)
        var author = commit.author();
        var thisCommit = {
          date      : moment(commit.date()),
          committer : `${author.name()} <${author.email()}>`,
          message   : commit.message()
        }
        // console.log(thisCommit)
        commitsArray.push(thisCommit)
      }else if(sinceDate == ''){
        // console.log("No Limits")
        var author = commit.author();
        commitsArray.push({
          date      : moment(commit.date()),
          committer : `${author.name()} <${author.email()}>`,
          message   : commit.message()
        })
      }else{
        // console.log("Nothing to Do")
      }
      // console.log(commitsArray)
    });
    history.on('end', function(commits) {
      // console.log(commits)
      createNotes(commitsArray)
    });

    // Start emitting events.
    history.start();

  })

}else{

}
function createNotes(data){
  // console.log(title)
  let thisMarkDown = '';
  // console.log("--------------------------------------------------")
  let apitable = [["Timestamp", "User Stories","Committer", "Comments"]]
  data.forEach(function(d,i){
    let thisStories = d.message.match(/#[0-9]+/g)
    let thisrow = []
    thisrow.push(d.date);
    thisrow.push( (thisStories == null ? '' : thisStories.join(", ")) );
    thisrow.push(d.committer.replace(/\n/g," ").replace(/#[0-9]+/g," ") )
    thisrow.push(d.message.replace(/\n/g," ").replace(/#[0-9]+/g," ") )
    apitable.push(thisrow)
      // console.log(unixTimeConvert(i.committer.date)," ",i.message)  
    // }
  })
  fs.writeFile(path.resolve(outputFile), table(apitable), function(err) {
    if(err) {
      console.log("Error writting file");
      console.log(err);
    } else {
      console.log("Done");
      // console.log(path.resolve(__dirname,'../../configreload.tmp'));
    }
  });  // console.log(table(apitable))

}
