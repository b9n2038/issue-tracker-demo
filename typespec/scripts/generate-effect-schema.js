#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the generated TypeScript types
const typesFile = path.join(__dirname, '../../src/generated/IssueTracker.ts');
const typesContent = fs.readFileSync(typesFile, 'utf8');

// Parse TypeScript types to extract schema information for Effect
function parseTypeScriptForEffect(content) {
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

        // Convert TypeScript types to Effect schema types
        let effectType = 'S.String';
        let constraints = [];

        if (fieldType.includes('number') || fieldType.includes('int32')) {
          effectType = 'S.Number';
          if (fieldName === 'priority') {
            constraints.push('.pipe(S.between(0, 4))'); // 0-4 range for priority
          }
        } else if (fieldType.includes('boolean')) {
          effectType = 'S.Boolean';
        } else if (fieldType === 'IssueState') {
          // Use the predefined enum schema
          effectType = 'IssueStateSchema';
        } else if (enums[fieldType]) {
          // Use the predefined enum schema
          effectType = `${fieldType}Schema`;
        } else if (fieldType.includes('utcDateTime')) {
          effectType = 'S.String'; // Keep as string for now, could use Date schema
          constraints.push('.pipe(S.pattern(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z?$/))'); // ISO date pattern
        } else {
          // String with potential length constraints
          effectType = 'S.String';
          if (fieldName === 'title') {
            constraints.push('.pipe(S.minLength(1), S.maxLength(200))');
          } else if (fieldName === 'description') {
            constraints.push('.pipe(S.maxLength(1000))');
          } else if (fieldName.includes('Id')) {
            constraints.push('.pipe(S.minLength(1), S.maxLength(50))');
          }
        }

        const constraintStr = constraints.length > 0 ? constraints.join('') : '';
        const fieldSchema = isOptional ?
          `${effectType}${constraintStr}.pipe(S.optional)` :
          `${effectType}${constraintStr}`;

        fields[fieldName] = fieldSchema;
      }
    }

    models[modelName] = fields;
  }

  return { enums, models };
}

// Generate Effect schema
function generateEffectSchema(content) {
  console.log('🎯 Generating Effect schema from TypeSpec...');

  const { enums, models } = parseTypeScriptForEffect(content);

  let effectCode = `// Auto-generated Effect Schema from TypeSpec
// This provides runtime validation and type safety

import { Schema as S } from '@effect/schema/Schema';

// Enum Schemas
`;

  // Generate enum schemas
  for (const [enumName, values] of Object.entries(enums)) {
    const literals = values.map(val => `S.Literal("${val}")`).join(', ');
    effectCode += `export const ${enumName}Schema = S.Union(${literals});\n`;
  }

  effectCode += '\n// Model Schemas\n';

  // Generate model schemas
  for (const [modelName, fields] of Object.entries(models)) {
    effectCode += `export const ${modelName}Schema = S.Struct({\n`;
    for (const [fieldName, fieldSchema] of Object.entries(fields)) {
      effectCode += `  ${fieldName}: ${fieldSchema},\n`;
    }
    effectCode += `});\n\n`;

    // Generate type from schema
    effectCode += `export type ${modelName} = S.Schema.Type<typeof ${modelName}Schema>;\n`;
    effectCode += `export type ${modelName}Encoded = S.Schema.Encoded<typeof ${modelName}Schema>;\n\n`;
  }

  // Add validation helpers
  effectCode += `// Validation helpers
export const validate${Object.keys(models)[0]} = S.validateSync(${Object.keys(models)[0]}Schema);
export const validate${Object.keys(models)[1]} = S.validateSync(${Object.keys(models)[1]}Schema);

// Parse helpers (decode from external data)
export const parse${Object.keys(models)[0]} = S.decodeUnknownSync(${Object.keys(models)[0]}Schema);
export const parse${Object.keys(models)[1]} = S.decodeUnknownSync(${Object.keys(models)[1]}Schema);
`;

  return effectCode;
}

// Generate Effect schema
const effectSchema = generateEffectSchema(typesContent);

// Write the file
const outputFile = path.join(__dirname, '../../src/generated/effect-schemas.ts');
fs.writeFileSync(outputFile, effectSchema);

console.log('✅ Generated Effect schema at:', outputFile);