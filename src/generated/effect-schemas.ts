// Auto-generated Effect Schema from TypeSpec
// This provides runtime validation and type safety

import { Schema as S } from '@effect/schema/Schema';

// Enum Schemas
export const IssueStateSchema = S.Union(S.Literal("Backlog"), S.Literal("Todo"), S.Literal("InProgress"), S.Literal("Done"), S.Literal("Cancelled"));

// Model Schemas
export const IssueSchema = S.Struct({
  id: S.String,
  title: S.String.pipe(S.minLength(1), S.maxLength(200)),
  description: S.String.pipe(S.maxLength(1000)).pipe(S.optional),
  status: IssueStateSchema,
  priority: S.Number.pipe(S.between(0, 4)),
  assignee: S.String.pipe(S.optional),
  projectId: S.String.pipe(S.minLength(1), S.maxLength(50)),
  createdAt: S.String,
  updatedAt: S.String,
});

export type Issue = S.Schema.Type<typeof IssueSchema>;
export type IssueEncoded = S.Schema.Encoded<typeof IssueSchema>;

export const ProjectSchema = S.Struct({
  id: S.String,
  name: S.String,
  description: S.String.pipe(S.maxLength(1000)).pipe(S.optional),
});

export type Project = S.Schema.Type<typeof ProjectSchema>;
export type ProjectEncoded = S.Schema.Encoded<typeof ProjectSchema>;

// Validation helpers
export const validateIssue = S.validateSync(IssueSchema);
export const validateProject = S.validateSync(ProjectSchema);

// Parse helpers (decode from external data)
export const parseIssue = S.decodeUnknownSync(IssueSchema);
export const parseProject = S.decodeUnknownSync(ProjectSchema);
