const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');


const gitAPI = require('./utils/githubAPI.js');


// Inquirer prompts for userResponses =======================================================
const questions = [
    {
        type: 'input',
        message: "What is your GitHub username? (No @ needed)",
        name: 'username',
    },
    {
        type: 'input',
        message: "What is the name of your GitHub repo?",
        name: 'repo'
    },
    {
        type: 'input',
        message: "What is the title of your project?",
        name: 'title',

    },
    {
        type: 'input',
        message: "Write a description of your project.",
        name: 'description',

    },
    {
        type: 'input',
        message: "If needed, describe the steps required to install your project for the Installation section. (Press enter to skip this step)",
        name: 'installation'
    },
    {
        type: 'input',
        message: "Give instructions and examples of your project in use for the Usage section. (Press enter to skip this step)",
        name: 'usage'
    },
    {
        type: 'input',
        message: "If needed, provide guidelines on how other developers can contribute to your project. (Press enter to skip this step)",
        name: 'contributing'
    },
    {
        type: 'input',
        message: "If needed, provide any tests written for your application and provide examples on how to run them. (Press enter to skip this step)",
        name: 'tests'
    },
    {
        type: 'list',
        message: "Choose a license for your project.",
        choices: ['GNU AGPLv3', 'GNU GPLv3', 'GNU LGPLv3', 'Mozilla Public License 2.0', 'Apache License 2.0', 'MIT License'],
        name: 'license'
    }
];

function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, err => {
        if (err) {
          return console.log(err);
        }
      
        console.log("Success! Your README.md file has been generated")
    });
}

const writeFileAsync = util.promisify(writeToFile);



async function init() {
    try {

        // Prompt Inquirer questions =============================================================
        const userResponses = await inquirer.prompt(questions);
        const userInfo = await gitAPI.getUser(userResponses);
        console.log("Working on your README..")
        const markdown = generateMarkdown(userResponses, userInfo);
    
        // Writes the readme file ================================================
        await writeFileAsync('readme.md', markdown);

    } catch (error) {
        console.log(error);
    }
};

init();
function generateMarkdown(userResponses, userInfo) {

    // Generate Table of Contents if user inputs =============================================================
    let tabCont = `## Table of Contents`;
  
    if (!userResponses.installation) 
    { tabCont += ` * (#installation)` };
  
    if (!userResponses.usage) 
    { tabCont += ` * (#usage)` };
  
    if (!userResponses.contributing) 
    { tabCont += ` * (#contributing)` };
  
    if (!userResponses.tests) 
    { tabCont += ` * (#tests)` };
  
  
    // Generate markdown for the top required portions of the README =============================================================
    let draftMarkdown = 
    `# ${userResponses.title} by ${userResponses.username}
  
  
    ## Description 
    
    
    ${userResponses.description}
  
    `
  
    // Add Table of Contents to markdown =============================================================
    draftMarkdown += tabCont;
   
 //Lisence section =============================================================
    draftMarkdown += `
    * [License](#license)`;
    
  
    // Installation section =============================================================
    if (!userResponses.installation) {
    
    draftMarkdown +=
    `
    
    ## Installation
    
    *Steps required to install project and how to get the program running:*
    
    ${userResponses.installation}`
    };
    
  
    //Usage section =============================================================
    if (!userResponses.usage) {
    
    draftMarkdown +=
    
    `
    
    ## Usage 
    
    *Instructions and examples for use:*
    
    ${userResponses.usage}`
    };
    
    
    //Contributing section =============================================================
    if (!userResponses.contributing) {
  
    draftMarkdown +=
      
    `
    
    ## Contributing
    
    *If you would like to contribute it, you can follow these steps for how to do so.*
    
    ${userResponses.contributing}`
    };
    
  
    
    if (!userResponses.tests) {
    
    draftMarkdown +=
    `
    
    ## Tests
    
    *Tests for application and how to run them:*
    
    ${userResponses.tests}`
    };
  
  
    // License section=============================================================
    draftMarkdown +=
    `
    
    ## License
    
    ${userResponses.license}
    `;
  
  
    // Questions / About Developer section
    let draftDev = 
    `
    ---
    
    ## Questions?
  

    
    For any questions, please contact me with the information below:
   
    GitHub: [@${userInfo.login}](${userInfo.url})
    `;
  
    // If GitHub email isn't null, adds it to dev section=========================================================
    if (userInfo.email !== null) {
    
    draftDev +=
    `
  
    Email: ${userInfo.email}
  
    `};
  
    // Add developer section to markdown =======================================================
    draftMarkdown += draftDev;
  
    // Return markdown =======================================================
    return draftMarkdown;
    
  }
  
  module.exports = generateMarkdown;
  
