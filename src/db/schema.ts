import { mysqlTable, int, varchar, text, boolean, timestamp, mysqlEnum, float } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const ulogaEnum = mysqlEnum("role", ["STUDENT", "STAFF", "ADMIN"]);

export const statusEnum = mysqlEnum("status", [
  "PENDING",
  "IN_PROGRESS",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
]);

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: ulogaEnum.notNull().default("STUDENT"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const students = mysqlTable("students", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  indexNumber: varchar("index_number", { length: 20 }).notNull().unique(),
  yearOfStudy: int("year_of_study").notNull().default(1),
  phone: varchar("phone", { length: 20 }),
  userId: int("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const staff = mysqlTable("staff", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  userId: int("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const requestTypes = mysqlTable("request_types", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  requiresPayment: boolean("requires_payment").notNull().default(false),
  price: float("price"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const requests = mysqlTable("requests", {
  id: int("id").primaryKey().autoincrement(),
  studentId: int("student_id").notNull().references(() => students.id),
  requestTypeId: int("request_type_id").notNull().references(() => requestTypes.id),
  status: statusEnum.notNull().default("PENDING"),
  purpose: text("purpose"),
  note: text("note"),
  processedBy: int("processed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const documents = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  requestId: int("request_id").notNull().references(() => requests.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, { fields: [users.id], references: [students.userId] }),
  staff: one(staff, { fields: [users.id], references: [staff.userId] }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  requests: many(requests),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(users, { fields: [staff.userId], references: [users.id] }),
}));

export const requestTypesRelations = relations(requestTypes, ({ many }) => ({
  requests: many(requests),
}));

export const requestsRelations = relations(requests, ({ one, many }) => ({
  student: one(students, { fields: [requests.studentId], references: [students.id] }),
  requestType: one(requestTypes, {
    fields: [requests.requestTypeId],
    references: [requestTypes.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  request: one(requests, { fields: [documents.requestId], references: [requests.id] }),
}));
