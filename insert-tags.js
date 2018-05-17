const fs = require("fs");
const path = require("path");

const insertString = (index, content, string) => {
    return content.slice(0, index) + string + content.slice(index);
}

const indexPath = path.resolve(__dirname, "docs/index.html");

// get current file contents
let content = fs.readFileSync(indexPath);

// get end of head location and insert link tag
const headIndex = content.indexOf("</head>");
content = insertString(headIndex, content, "\n<link href=\"./assets/css/style.css\" rel=\"stylesheet\">\n\n");

// get end of body location and insert script tag
const bodyIndex = content.indexOf("</body>");
content = insertString(bodyIndex, content, "\n<script src=\"./service-worker-registration.js\"></script>\n\n");

// write contents back to file
fs.writeFileSync(indexPath, content);

