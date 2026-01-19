#!/usr/bin/env node

import { createTypeSpecLibrary, paramMessage } from "@typespec/compiler";

const libDef = {
  name: "tinybase-emitter",
  diagnostics: {},
  emitter: {
    options: {
      "output-dir": {
        type: "string",
        description: "Output directory for generated files",
        default: "tinybase-schema",
      },
    },
  },
};

export const lib = createTypeSpecLibrary(libDef);
export const { reportDiagnostic, createDiagnostic } = lib;

export function $onEmit(context) {
  const outputDir = context.emitterOutputDir;
  const program = context.program;

  // Generate Tinybase schema from TypeSpec models
  const schema = generateTinybaseSchema(program);

  // Write the schema file
  const filePath = context.joinPaths(outputDir, "tinybase-schema.ts");
  context.writeFile(filePath, schema);
}

function generateTinybaseSchema(program) {
  const schema = {
    project: {},
    issue: {}
  };

  // Walk through all models in the program
  for (const [key, type] of program.models) {
    if (type.kind === "Model" && type.name) {
      const tableName = type.name.toLowerCase();

      if (tableName === "project" || tableName === "issue") {
        const tableSchema = {};

        // Process model properties
        for (const [propName, prop] of type.properties) {
          if (prop.kind === "ModelProperty") {
            const propType = getTinybaseType(prop.type);
            const defaultValue = getDefaultValue(prop.type, prop.default);

            tableSchema[propName] = {
              type: propType,
              ...(defaultValue !== undefined && { default: defaultValue })
            };
          }
        }

        schema[tableName] = tableSchema;
      }
    }
  }

  // Generate the TypeScript code
  return `// Auto-generated Tinybase schema from TypeSpec
export const tinybaseSchema = ${JSON.stringify(schema, null, 2)} as const;

// Type-safe schema access
export type TinybaseSchema = typeof tinybaseSchema;
`;
}

function getTinybaseType(type) {
  switch (type.kind) {
    case "String":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    default:
      // Handle enum types
      if (type.kind === "Enum" || (type.kind === "Union" && type.options)) {
        return "string";
      }
      return "string"; // fallback
  }
}

function getDefaultValue(type, defaultValue) {
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Set sensible defaults based on type
  switch (type.kind) {
    case "String":
      return "";
    case "Number":
      return 0;
    case "Boolean":
      return false;
    default:
      return undefined;
  }
}

export function $lib({}) {
  return lib;
}
<parameter name="filePath">typespec/emitters/tinybase-emitter.ts