// Auto-generated Tinybase schema from TypeSpec (Template-based approach)
// This uses string templates to generate schema definitions

export const issueSchema = {
  title: { type: "string", default: "" },
  description: { type: "string", default: "" },
  status: { type: "string", default: "" },
  priority: { type: "number", default: 0 },
  assignee: { type: "string", default: "" },
  projectId: { type: "string", default: "" },
  createdAt: { type: "string", default: "" },
  updatedAt: { type: "string", default: "" },
} as const;

export const projectSchema = {
  name: { type: "string", default: "" },
  description: { type: "string", default: "" },
} as const;

export const tinybaseSchemaTemplate = {
  issue,
  project
} as const;

// Type-safe schema access
export type TinybaseSchemaTemplate = typeof tinybaseSchemaTemplate;

// Helper function to create Tinybase store configuration
export function createTinybaseConfigTemplate() {
  return {
    tables: tinybaseSchemaTemplate
  };
}
