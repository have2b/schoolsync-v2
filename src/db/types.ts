import { Account, Class, Course, Department, Grade, Seminar, Student, Teacher } from './schema'

type Account = typeof Account.$inferSelect
type Student = typeof Student.$inferSelect
type Teacher = typeof Teacher.$inferSelect
type Department = typeof Department.$inferSelect
type Class = typeof Class.$inferSelect
type Course = typeof Course.$inferSelect
type Seminar = typeof Seminar.$inferSelect
type Grade = typeof Grade.$inferSelect

export type { Account, Class, Course, Department, Grade, Seminar, Student, Teacher }
