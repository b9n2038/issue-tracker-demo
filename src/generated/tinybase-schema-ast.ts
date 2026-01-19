// Auto-generated Tinybase schema from TypeSpec (AST-based approach)
// This uses TypeScript AST parsing to extract schema information

export const tinybaseSchemaAST = {
  "issue": {
    "title": {
      "type": "string",
      "default": "\"\""
    },
    "description": {
      "type": "string",
      "default": "\"\""
    },
    "status": {
      "type": "string",
      "default": "\"\""
    },
    "priority": {
      "type": "number",
      "default": "0"
    },
    "assignee": {
      "type": "string",
      "default": "\"\""
    },
    "projectId": {
      "type": "string",
      "default": "\"\""
    },
    "createdAt": {
      "type": "string",
      "default": "\"\""
    },
    "updatedAt": {
      "type": "string",
      "default": "\"\""
    }
  },
  "project": {
    "name": {
      "type": "string",
      "default": "\"\""
    },
    "description": {
      "type": "string",
      "default": "\"\""
    }
  }
} as const;

// Type-safe schema access
export type TinybaseSchemaAST = typeof tinybaseSchemaAST;

// Helper function to create Tinybase store configuration
export function createTinybaseConfigAST() {
  return {
    tables: tinybaseSchemaAST
  };
}
