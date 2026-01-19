#!/usr/bin/env node

import { createTypeSpecLibrary } from "@typespec/compiler";

const libDef = {
  name: "tinybase-template-emitter",
  diagnostics: {},
  emitter: {
    options: {
      "output-dir": {
        type: "string",
        description: "Output directory for generated files",
        default: "tinybase-schema-template",
      },
    },
  },
};

export const lib = createTypeSpecLibrary(libDef);

export function $onEmit(context) {
  const outputDir = context.emitterOutputDir;
  const program = context.program;

  // Use template-based generation
  const schema = generateTinybaseSchemaFromTemplate(program);

  // Write the schema file
  const filePath = context.joinPaths(outputDir, "tinybase-schema-template.ts");
  context.writeFile(filePath, schema);
}

function generateTinybaseSchemaFromTemplate(program) {
  const tables = [];

  // Extract model information using AST walking
  for (const [key, type] of program.models) {
    if (type.kind === "Model" && type.name) {
      const tableName = type.name.toLowerCase();

      if (tableName === "project" || tableName === "issue") {
        const fields = [];

        // Process model properties
        for (const [propName, prop] of type.properties) {
          if (prop.kind === "ModelProperty") {
            const fieldType = getFieldType(prop.type);
            const defaultVal = getFieldDefault(prop.type, prop.default);
            const isOptional = prop.optional;

            fields.push({
              name: propName,
              type: fieldType,
              default: defaultVal,
              optional: isOptional
            });
          }
        }

        tables.push({
          name: tableName,
          fields: fields
        });
      }
    }
  }

  // Use template to generate code
  return generateTemplate(tables);
}

function getFieldType(type) {
  switch (type.kind) {
    case "String":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    case "Enum":
    case "Union":
      return "string"; // Enums and unions map to strings
    default:
      return "string";
  }
}

function getFieldDefault(type, defaultValue) {
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Type-based defaults
  switch (type.kind) {
    case "String":
      return '""';
    case "Number":
      return "0";
    case "Boolean":
      return "false";
    default:
      return "undefined";
  }
}

function generateTemplate(tables) {
  const tableDefinitions = tables.map(table => {
    const fieldDefinitions = table.fields.map(field => {
      const defaultPart = field.default !== "undefined" ? `, default: ${field.default}` : "";
      return `    ${field.name}: { type: "${field.type}"${defaultPart} }`;
    }).join(',\n');

    return `  ${table.name}: {\n${fieldDefinitions}\n  }`;
  }).join(',\n');

  return `// Auto-generated Tinybase schema from TypeSpec (Template-based)
// This file is generated from the TypeSpec AST using templates

export const tinybaseSchemaTemplate = {
${tableDefinitions}
} as const;

// Type-safe schema access
export type TinybaseSchemaTemplate = typeof tinybaseSchemaTemplate;

// Helper function to create Tinybase store from schema
export function createTinybaseSchema() {
  return tinybaseSchemaTemplate;
}
`;
}

export function $lib({}) {
  return lib;
}
<parameter name="filePath">typespec/emitters/tinybase-template-emitter.ts