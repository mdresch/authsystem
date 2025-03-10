// scripts/generate-versions.js
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json'); // Adjust path if needed
const versionsFilePath = path.resolve(__dirname, '../lib/versions.js'); // Adjust path if needed

try {
    const packageJson = require(packageJsonPath);

    const versions = {
        nextjs: packageJson.dependencies['next'],
        supabase: packageJson.dependencies['@supabase/supabase-js'],
        tailwindcss: packageJson.devDependencies['tailwindcss'],
        typescript: packageJson.devDependencies['typescript'],
        // Add other dependencies here
    };

    const versionsString = `export const versions = ${JSON.stringify(versions, null, 2)};`;

    fs.writeFileSync(versionsFilePath, versionsString);
    console.log('Generated versions file:', versionsFilePath);
} catch (error) {
    console.error('Error generating versions file:', error);
    process.exit(1); // Exit with an error code
}