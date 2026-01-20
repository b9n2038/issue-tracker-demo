#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the generated TypeScript types
const typesFile = path.join(__dirname, '../../src/generated/IssueTracker.ts');
const typesContent = fs.readFileSync(typesFile, 'utf8');

// Parse TypeScript types to extract schema information for Tinybase
function parseTypeScriptForTinybase(content) {
  // Extract enum definitions
  const enumRegex = /export enum (\w+) \{([^}]+)\}/g;
  const enums = {};
  let enumMatch;
  while ((enumMatch = enumRegex.exec(content)) !== null) {
    const enumName = enumMatch[1];
    const enumBody = enumMatch[2];
    const values = [];
    const valueMatches = enumBody.matchAll(/(\w+)\s*=\s*["']([^"']+)["']/g);
    for (const match of valueMatches) {
      values.push(match[2]); // Use the string value
    }
    enums[enumName] = values;
  }

  // Extract model definitions
  const models = {};
  const modelRegex = /export type (\w+) = \{([^}]+)\}/g;
  let modelMatch;
  while ((modelMatch = modelRegex.exec(content)) !== null) {
    const modelName = modelMatch[1];
    const modelBody = modelMatch[2];

    const fields = {};

    // Parse field definitions
    const fieldLines = modelBody.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
    for (const line of fieldLines) {
      const fieldMatch = line.match(/(\w+)[?]?:\s*([^;]+);?/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        let fieldType = fieldMatch[2].trim().replace(/,$/, ''); // Remove trailing comma
        const isOptional = line.includes('?:') || line.includes('?');

        // Skip id fields as Tinybase handles them automatically
        if (fieldName === 'id') continue;

        // Convert TypeScript types to Tinybase types
        let tinybaseType = 'string';
        let defaultValue = '""';

        if (fieldType.includes('number') || fieldType.includes('int32')) {
          tinybaseType = 'number';
          defaultValue = '0';
        } else if (fieldType.includes('boolean')) {
          tinybaseType = 'boolean';
          defaultValue = 'false';
        } else if (enums[fieldType]) {
          tinybaseType = 'string';
          defaultValue = `"${enums[fieldType][0]}"`; // Use first enum value as default
        }

        fields[fieldName] = {
          type: tinybaseType,
          default: defaultValue
        };
      }
    }

    models[modelName.toLowerCase()] = fields;
  }

  return models;
}

// Parse TypeScript types to extract schema information
function parseTypeScriptTypes(content) {
  const models = {};

  // Extract enum definitions
  const enumRegex = /export enum (\w+) \{([^}]+)\}/g;
  const enums = {};
  let enumMatch;
  while ((enumMatch = enumRegex.exec(content)) !== null) {
    const enumName = enumMatch[1];
    const enumBody = enumMatch[2];
    const values = {};
    const valueMatches = enumBody.matchAll(/(\w+)\s*=\s*["']([^"']+)["']/g);
    for (const match of valueMatches) {
      values[match[1]] = match[2];
    }
    enums[enumName] = values;
  }

  // Extract model definitions
  const modelRegex = /export type (\w+) = \{([^}]+)\}/g;
  let modelMatch;
  while ((modelMatch = modelRegex.exec(content)) !== null) {
    const modelName = modelMatch[1].toLowerCase();
    const modelBody = modelMatch[2];

    if (modelName === 'issue' || modelName === 'project') {
      const fields = {};

      // Parse field definitions
      const fieldLines = modelBody.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
      for (const line of fieldLines) {
        const fieldMatch = line.match(/(\w+)[?]?:\s*([^;]+);?/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          let fieldType = fieldMatch[2].trim();

          // Skip id fields
          if (fieldName === 'id') continue;

          // Convert TypeScript types to Tinybase types
          let tinybaseType = 'string';
          let defaultValue = '""';

          if (fieldType.includes('number') || fieldType.includes('int32')) {
            tinybaseType = 'number';
            defaultValue = '0';
          } else if (fieldType.includes('boolean')) {
            tinybaseType = 'boolean';
            defaultValue = 'false';
          } else if (enums[fieldType]) {
            tinybaseType = 'string';
            defaultValue = `"${Object.values(enums[fieldType])[0]}"`; // Use first enum value as default
          }

          fields[fieldName] = {
            type: tinybaseType,
            default: defaultValue
          };
        }
      }

      models[modelName] = fields;
    }
  }

  return models;
}

// Generate Tinybase schema using AST-based parsing
function generateTinybaseSchemaAST(content) {
  console.log('🔍 Parsing TypeScript types with AST-based approach...');

  const models = parseTypeScriptForTinybase(content);

  let templateOutput = `// Auto-generated Tinybase schema from TypeSpec (Template-based approach)
// This uses string templates to generate schema definitions

`;

  // Define individual schemas
  for (const [modelName, fields] of Object.entries(models)) {
    templateOutput += `export const ${modelName}Schema = {\n`;
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
      templateOutput += `  ${fieldName}: { type: "${fieldConfig.type}", default: ${fieldConfig.default} },\n`;
    }
    templateOutput += `} as const;\n\n`;
  }

  // Create the combined schema
  templateOutput += `export const tinybaseSchemaTemplate = {\n`;
  for (const modelName of Object.keys(models)) {
    templateOutput += `  ${modelName}: ${modelName}Schema,\n`;
  }
  templateOutput += `} as const;\n\n`;

  templateOutput += `// Type-safe schema access
export type TinybaseSchemaTemplate = typeof tinybaseSchemaTemplate;

// Helper function to create Tinybase store configuration
export function createTinybaseConfigTemplate() {
  return {
    tables: tinybaseSchemaTemplate
  };
}
`;

  return templateOutput;
}

// Generate Tinybase schema using template-based approach
function generateTinybaseSchemaTemplate(content) {
  console.log('📝 Generating Tinybase schema with template-based approach...');

  const models = parseTypeScriptForTinybase(content);

  let templateOutput = `// Auto-generated Tinybase schema from TypeSpec (Template-based approach)
// This uses string templates to generate schema definitions

`;

  // Define individual schemas
  for (const [modelName, fields] of Object.entries(models)) {
    templateOutput += `export const ${modelName}Schema = {\n`;
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
      templateOutput += `  ${fieldName}: { type: "${fieldConfig.type}", default: ${fieldConfig.default} },\n`;
    }
    templateOutput += `} as const;\n\n`;
  }

  // Create the combined schema
  templateOutput += `export const tinybaseSchemaTemplate = {\n`;
  for (const modelName of Object.keys(models)) {
    templateOutput += `  ${modelName}: ${modelName}Schema,\n`;
  }
  templateOutput += `} as const;\n\n`;

  templateOutput += `// Type-safe schema access
export type TinybaseSchemaTemplate = typeof tinybaseSchemaTemplate;

// Helper function to create Tinybase store configuration
export function createTinybaseConfigTemplate() {
  return {
    tables: tinybaseSchemaTemplate
  };
}
`;

  return templateOutput;
}

// Generate both versions
const astSchema = generateTinybaseSchemaAST(typesContent);
const templateSchema = generateTinybaseSchemaTemplate(typesContent);

// Write both files
const astOutputFile = path.join(__dirname, '../../src/generated/tinybase-schema-ast.ts');
const templateOutputFile = path.join(__dirname, '../../src/generated/tinybase-schema-template.ts');

fs.writeFileSync(astOutputFile, astSchema);
fs.writeFileSync(templateOutputFile, templateSchema);

console.log('✅ Generated AST-based Tinybase schema at:', astOutputFile);
console.log('✅ Generated Template-based Tinybase schema at:', templateOutputFile);