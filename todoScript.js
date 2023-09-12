const fs = require('fs');
const path = require('path');

const extractTodos = (filePath) => {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  let todoBlocks = [];
  let isInsideTodo = false;
  let todoBlock = '';

  lines.forEach((line, index) => {
    if (line.includes('// TODO:')) {
      isInsideTodo = true;
      todoBlock = '';  // Reset todoBlock for a new TODO
    }

    if (isInsideTodo) {
      todoBlock += `${line}\n`;
      
      if (line === '' || index === lines.length - 1) {
        todoBlocks.push(todoBlock);
        isInsideTodo = false;
      }
    }
  });

  return { [filePath]: todoBlocks };
};

const main = (inputDir) => {
  let allTodos = {};

  // Recursive function to process a directory and its subdirectories
  const processDir = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        processDir(filePath);
      } else if (stats.isFile() && filePath.endsWith('.js')) {
        const todos = extractTodos(filePath);
        allTodos = { ...allTodos, ...todos };
      }
    });
  };

  // Start processing from the input directory
  processDir(inputDir);

  let markdownContent = '';
  
  for (const [filePath, todoBlocks] of Object.entries(allTodos)) {
    if (todoBlocks.length > 0) {
      markdownContent += `### \`${filePath}\`\n\n`;
      todoBlocks.forEach((block) => {
        markdownContent += `\`\`\`js\n${block}\`\`\`\n\n`;
      });
      markdownContent += '---\n';
    }
  }
  
  fs.writeFileSync('TODOs.md', markdownContent);
};

main(process.argv[2]);
