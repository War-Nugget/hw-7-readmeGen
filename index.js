// External packages
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

// Internal modules
const api = require('./utils/api.js');


// Inquirer prompts for userResponses
const questions = [
    {
        type: 'input',
        message: "What is your GitHub username? (No @ needed)",
        name: 'username',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid GitHub username is required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "What is the name of your GitHub repo?",
        name: 'repo',

        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid GitHub repo is required for a badge.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "What is the title of your project?",
        name: 'title',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid project title is required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "Write a description of your project.",
        name: 'description',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid project description is required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "If applicable, describe the steps required to install your project for the Installation section.",
        name: 'installation'
    },
    {
        type: 'input',
        message: "Provide instructions and examples of your project in use for the Usage section.",
        name: 'usage'
    },
    {
        type: 'input',
        message: "If applicable, provide guidelines on how other developers can contribute to your project.",
        name: 'contributing'
    },
    {
        type: 'input',
        message: "If applicable, provide any tests written for your application and provide examples on how to run them.",
        name: 'tests'
    },
    {
        type: 'list',
        message: "Choose a license for your project.",
        choices: ['GNU AGPLv3', 'GNU GPLv3', 'GNU LGPLv3', 'Mozilla Public License 2.0', 'Apache License 2.0', 'MIT License', 'Boost Software License 1.0', 'The Unlicense'],
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


// Main function
async function init() {
    try {

        // Prompt Inquirer questions
        const userResponses = await inquirer.prompt(questions);
        console.log("Your responses: ", userResponses);
        console.log("Thank you for your responses! Fetching your GitHub data next...");
    
        // Call GitHub api for user info
        const userInfo = await api.getUser(userResponses);
        console.log("Your GitHub user info: ", userInfo);
    
        // Pass Inquirer userResponses and GitHub userInfo to generateMarkdown
        console.log("Generating your README next...")
        const markdown = generateMarkdown(userResponses, userInfo);
        console.log(markdown);
    
        // Write markdown to file
        await writeFileAsync('readme.md', markdown);

    } catch (error) {
        console.log(error);
    }
};

init();
function generateMarkdown(userResponses, userInfo) {

    // Generate Table of Contents conditionally based on userResponses
    let draft = `## Table of Contents`;
  
    if (userResponses.installation !== '') { draft += `
    * [Installation](#installation)` };
  
    if (userResponses.usage !== '') { draft += `
    * [Usage](#usage)` };
  
    if (userResponses.contributing !== '') { draft += `
    * [Contributing](#contributing)` };
  
    if (userResponses.tests !== '') { draft += `
    * [Tests](#tests)` };
  
  
    // Generate markdown for the top required portions of the README
    let draftMarkdown = 
    `# ${userResponses.title} by ${userResponses.username}
  
  
    ## Description 
    
    
    ${userResponses.description}
  
    `
  
    // Add Table of Contents to markdown
    draftMarkdown += draft;
   
    // Add License section since License is required to Table of Contents
    draftMarkdown += `
    * [License](#license)`;
    
  
    // Optional Installation section
    if (userResponses.installation !== '') {
    
    draftMarkdown +=
    `
    
    ## Installation
    
    *Steps required to install project and how to get the development environment running:*
    
    ${userResponses.installation}`
    };
    
  
    // Optional Usage section
    if (userResponses.usage !== '') {
    
    draftMarkdown +=
    
    `
    
    ## Usage 
    
    *Instructions and examples for use:*
    
    ${userResponses.usage}`
    };
    
    
    // Optional Contributing section
    if (userResponses.contributing !== '') {
  
    draftMarkdown +=
      
    `
    
    ## Contributing
    
    *If you would like to contribute it, you can follow these guidelines for how to do so.*
    
    ${userResponses.contributing}`
    };
    
  
    // Optional Tests section
    if (userResponses.tests !== '') {
    
    draftMarkdown +=
    `
    
    ## Tests
    
    *Tests for application and how to run them:*
    
    ${userResponses.tests}`
    };
  
  
    // License section is required
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
  
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" width="40%" />
    
    For any questions, please contact me with the information below:
   
    GitHub: [@${userInfo.login}](${userInfo.url})
    `;
  
    // If GitHub email is not null, add to Developer section
    if (userInfo.email !== null) {
    
    draftDev +=
    `
  
    Email: ${userInfo.email}
  
    `};
  
    // Add developer section to markdown
    draftMarkdown += draftDev;
  
    // Return markdown
    return draftMarkdown;
    
  }
  
  module.exports = generateMarkdown;
  
