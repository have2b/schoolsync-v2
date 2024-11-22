import { relations } from 'drizzle-orm'
import {
  boolean,
  date,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

// #region Enums
export const roleEnum = pgEnum('VAITRO', ['SINH VIEN', 'GIANG VIEN', 'QUAN TRI'])
export const genderEnum = pgEnum('GIOITINH', ['NAM', 'NU', 'KHAC'])
export const degreeEnum = pgEnum('HOCVI', [
  'CU NHAN',
  'THAC SI',
  'TIEN SI',
  'PHO GIAO SU',
  'GIAO SU',
])

export const semesterEnum = pgEnum('HOCKY', ['HOC KY I', 'HOC KY II'])

// Type for enum
export const Role = {
  STUDENT: 'SINH VIEN',
  TEACHER: 'GIANG VIEN',
  ADMIN: 'QUAN TRI',
} as const satisfies Record<string, (typeof roleEnum.enumValues)[number]>

export const Gender = {
  MALE: 'NAM',
  FEMALE: 'NU',
  OTHER: 'KHAC',
} as const satisfies Record<string, (typeof genderEnum.enumValues)[number]>

export const Degree = {
  BACHELOR: 'CU NHAN',
  MASTER: 'THAC SI',
  PHD: 'TIEN SI',
  ASSOCIATE_PROF: 'PHO GIAO SU',
  PROFESSOR: 'GIAO SU',
} as const satisfies Record<string, (typeof degreeEnum.enumValues)[number]>

export const Semester = {
  SEMESTER_1: 'HOC KY I',
  SEMESTER_2: 'HOC KY II',
} as const satisfies Record<string, (typeof semesterEnum.enumValues)[number]>

// #endregion

// #region Tables

// Account table
export const Account = pgTable('TAIKHOAN', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('TenTK', { length: 255 }).unique().notNull(),
  email: varchar('Email', { length: 100 }).unique().notNull(),
  password: text('MatKhau').notNull(),
  fullName: varchar('HoTen', { length: 100 }).notNull(),
  dob: date('NgaySinh', { mode: 'date' }).notNull(),
  gender: genderEnum('GioiTinh').default('NAM'),
  address: varchar('DiaChi', { length: 255 }).notNull(),
  phone: varchar('DienThoai', { length: 13 }).unique().notNull(),
  role: roleEnum('Vaitro').default('SINH VIEN'),
  avatar: varchar('Avatar', { length: 255 }),
  isFirstLogin: boolean('LanDauDangNhap').default(true),
  isDeleted: boolean('DaXoa').default(false),
  deletedAt: date('NgayXoa', { mode: 'date' }),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Student table
export const Student = pgTable('SINHVIEN', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('MaSV', { length: 10 }).unique().notNull(),
  accountId: uuid('MaTK').references(() => Account.id),
  classId: uuid('MaLHC').references(() => Class.id),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Teacher table
export const Teacher = pgTable('GIANGVIEN', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('MaGV', { length: 10 }).unique().notNull(),
  degree: degreeEnum('HocVi').default('CU NHAN'),
  major: varchar('ChuyenNganh', { length: 100 }).notNull(),
  accountId: uuid('MaTK').references(() => Account.id),
  departmentId: uuid('MaKhoa').references(() => Department.id),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Department table
export const Department = pgTable('KHOA', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('MaKhoa', { length: 10 }).unique().notNull(),
  name: varchar('TenKhoa', { length: 100 }).unique().notNull(),
  detail: text('MoTa'),
  isDeleted: boolean('DaXoa').default(false),
  deletedAt: date('NgayXoa', { mode: 'date' }),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Class table
export const Class = pgTable('LOPHC', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('MaLHC', { length: 10 }).unique().notNull(),
  name: varchar('TenLHC', { length: 100 }).unique().notNull(),
  maxCap: smallint('SoLuong').notNull(),
  isDeleted: boolean('DaXoa').default(false),
  deletedAt: date('NgayXoa', { mode: 'date' }),
  teacherId: uuid('MaGV').references(() => Teacher.id),
  departmentId: uuid('MaKhoa').references(() => Department.id),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Course table
export const Course = pgTable('HOCPHAN', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('MaHP', { length: 10 }).unique().notNull(),
  name: varchar('TenHP', { length: 100 }).unique().notNull(),
  credit: smallint('SoTC').notNull().default(0),
  lesson: smallint('SoTiet').notNull().default(0),
  isDeleted: boolean('DaXoa').default(false),
  deletedAt: date('NgayXoa', { mode: 'date' }),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Seminar table
export const Seminar = pgTable('LOPHP', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('MaLHP', { length: 10 }).unique().notNull(),
  name: varchar('TenLHP', { length: 100 }).unique().notNull(),
  maxCap: smallint('SoLuong').notNull(),
  semester: semesterEnum('HocKy').notNull().default('HOC KY I'),
  year: varchar('NamHoc', { length: 10 }).notNull(),
  startDate: date('NgayBD', { mode: 'date' }).notNull(),
  endDate: date('NgayKT', { mode: 'date' }).notNull(),
  isDeleted: boolean('DaXoa').default(false),
  deletedAt: date('NgayXoa', { mode: 'date' }),
  courseId: uuid('MaHP').references(() => Course.id),
  teacherId: uuid('MaGV').references(() => Teacher.id),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// Grade table
export const Grade = pgTable('DIEM', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('MaSV').references(() => Student.id),
  seminarId: uuid('MaLHP').references(() => Seminar.id),
  attendancePoint: real('DiemCC').default(0),
  firstPoint: real('DiemKT1').default(0),
  secondPoint: real('DiemKT2').default(0),
  finalPoint: real('DiemTL').default(0),
  examPoint: real('DiemThi').default(0),
  isDeleted: boolean('DaXoa').default(false),
  deletedAt: date('NgayXoa', { mode: 'date' }),
  createdAt: date('NgayTao', { mode: 'date' }).defaultNow(),
  updatedAt: date('NgayCapNhat', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// #endregion

// #region Relations

// Account relations
export const accountRelations = relations(Account, ({ one }) => ({
  student: one(Student, {
    fields: [Account.id],
    references: [Student.accountId],
  }),
  teacher: one(Teacher, {
    fields: [Account.id],
    references: [Teacher.accountId],
  }),
}))

// Student relations
export const studentRelations = relations(Student, ({ one, many }) => ({
  account: one(Account, {
    fields: [Student.accountId],
    references: [Account.id],
  }),
  class: one(Class, {
    fields: [Student.classId],
    references: [Class.id],
  }),
  grades: many(Grade),
}))

// Teacher relations
export const teacherRelations = relations(Teacher, ({ one, many }) => ({
  account: one(Account, {
    fields: [Teacher.accountId],
    references: [Account.id],
  }),
  department: one(Department, {
    fields: [Teacher.departmentId],
    references: [Department.id],
  }),
  classes: many(Class),
  seminars: many(Seminar),
}))

// Department relations
export const departmentRelations = relations(Department, ({ many }) => ({
  teachers: many(Teacher),
  classes: many(Class),
}))

// Class relations
export const classRelations = relations(Class, ({ one, many }) => ({
  department: one(Department, {
    fields: [Class.departmentId],
    references: [Department.id],
  }),
  teacher: one(Teacher, {
    fields: [Class.teacherId],
    references: [Teacher.id],
  }),
  students: many(Student),
}))

// Course relations
export const courseRelations = relations(Course, ({ many }) => ({
  seminars: many(Seminar),
}))

// Seminar relations
export const seminarRelations = relations(Seminar, ({ one, many }) => ({
  course: one(Course, {
    fields: [Seminar.courseId],
    references: [Course.id],
  }),
  teacher: one(Teacher, {
    fields: [Seminar.teacherId],
    references: [Teacher.id],
  }),
  grades: many(Grade),
}))

// Grade relations
export const gradeRelations = relations(Grade, ({ one }) => ({
  student: one(Student, {
    fields: [Grade.studentId],
    references: [Student.id],
  }),
  seminar: one(Seminar, {
    fields: [Grade.seminarId],
    references: [Seminar.id],
  }),
}))
// #endregion
