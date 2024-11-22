import { faker } from '@faker-js/faker/locale/vi'
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { Degree, Gender, Role, Semester } from '../schema'
import { Account, Class, Course, Department, Grade, Seminar, Student, Teacher } from '../types'

// #region Constants
const DEPARTMENTS_COUNT = 10
const ACCOUNTS_COUNT = 1000
const CLASSES_COUNT = 100
const COURSES_COUNT = 200
const BATCH_SIZE = 500
// #endregion

// #region Helper functions
// Helper function to get random enum value
const getRandomEnumValue = <T>(enumObj: T): T[keyof T] => {
  const values = Object.values(enumObj as object)
  return values[Math.floor(Math.random() * values.length)] as T[keyof T]
}

const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Optimized to generate multiple codes at once
const generateSequentialCodes = (
  prefix: string,
  startIndex: number,
  count: number,
  length: number
): string[] => {
  if (length < String(startIndex + count).length) {
    throw new Error('Length must be greater than or equal to the maximum number of digits')
  }
  return Array.from(
    { length: count },
    (_, i) => `${prefix}${(startIndex + i).toString().padStart(length, '0')}`
  )
}

// Batch processing helper
const processBatch = async <T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void> => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await processor(batch)
  }
}

// Pre-generate common random values
const preGenerateRandomValues = (count: number) => ({
  dates: Array.from({ length: count }, () => getRandomDate(new Date(2020, 0, 1), new Date())),
  futureDates: Array.from({ length: count }, () => faker.date.future()),
  genders: Array.from({ length: count }, () => getRandomEnumValue(Gender)),
  roles: Array.from({ length: count }, () =>
    faker.helpers.arrayElement([Role.TEACHER, Role.STUDENT])
  ),
})

// Helper function to track memory usage
const logMemoryUsage = () => {
  if (typeof process !== 'undefined') {
    const used = process.memoryUsage()
    console.log('Memory usage:')
    for (const [key, value] of Object.entries(used).filter(([key]) => key !== 'arrayBuffers')) {
      console.log(`${key}: ${Math.round((value / 1024 / 1024) * 100) / 100} MB`)
    }
  }
}
// #endregion

// #region Generate test data
// Generate departments
const generateDepartments = async (count: number = 10): Promise<Department[]> => {
  console.log('Generating departments...')
  const codes = generateSequentialCodes('K', 1, count, 3)
  const randomValues = preGenerateRandomValues(count)

  const departments = Array.from({ length: count }, (_, i) => {
    const createdDate = randomValues.dates[i]
    return {
      id: uuidv4(),
      code: codes[i],
      name: `${faker.company.name()}`,
      detail: faker.lorem.words(10),
      isDeleted: false,
      deletedAt: null,
      createdAt: createdDate,
      updatedAt: randomValues.futureDates[i],
    }
  })

  console.log('Done!')
  return departments
}

// Generate accounts
const generateAccounts = async (count: number = 100): Promise<Account[]> => {
  console.log('Generating accounts...')
  const randomValues = preGenerateRandomValues(count)
  const hashedPassword = await hash('password123', 10) // Hash password once

  const accounts = Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    username: `${faker.internet.username()}${faker.number.int({ min: 1, max: 999 })}`,
    email: `${faker.internet.email({ provider: 'tmu.edu.vn' })}${faker.number.int({ min: 1, max: 999 })}`,
    password: hashedPassword,
    fullName: faker.person.fullName(),
    dob: faker.date.between({ from: '1990-01-01', to: '2003-12-31' }),
    gender: randomValues.genders[i],
    address: faker.location.streetAddress(),
    phone: faker.phone.number({ style: 'national' }),
    role: randomValues.roles[i],
    avatar: faker.image.avatar(),
    isDeleted: false,
    deletedAt: null,
    isFirstLogin: false,
    createdAt: randomValues.dates[i],
    updatedAt: randomValues.futureDates[i],
  }))

  console.log('Done!')
  return accounts
}

const generateTeachers = async (
  accounts: Account[],
  departments: Department[]
): Promise<Teacher[]> => {
  console.log('Generating teachers...')
  const teacherAccounts = accounts.filter((acc) => acc.role === Role.TEACHER)
  const codes = generateSequentialCodes('GV', 1, teacherAccounts.length, 4)
  const randomValues = preGenerateRandomValues(teacherAccounts.length)
  const departmentIds = departments.map((d) => d.id)

  const teachers = teacherAccounts.map((account, i) => ({
    id: uuidv4(),
    code: codes[i],
    degree: getRandomEnumValue(Degree),
    major: faker.person.jobArea(),
    accountId: account.id,
    departmentId: faker.helpers.arrayElement(departmentIds),
    createdAt: randomValues.dates[i],
    updatedAt: randomValues.futureDates[i],
  }))

  console.log('Done!')
  return teachers
}

// Generate classes
const generateClasses = async (
  teachers: Teacher[],
  departments: Department[],
  count: number = 10
): Promise<Class[]> => {
  console.log('Generating classes...')
  const codes = generateSequentialCodes('LHP', 1, count, 3)
  const randomValues = preGenerateRandomValues(count)
  const teacherIds = teachers.map((t) => t.id)
  const departmentIds = departments.map((d) => d.id)
  const possibleElements = Array.from({ length: 100 }, () => faker.science.chemicalElement())
  const sections = ['A', 'B', 'C', 'D', 'E']

  const classes = Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    code: codes[i],
    name: `${faker.helpers.arrayElement(possibleElements).symbol} - ${faker.number.int({ min: 1, max: 99 })} - ${faker.helpers.arrayElement(sections)}`,
    maxCap: faker.number.int({ min: 30, max: 50 }),
    teacherId: faker.helpers.arrayElement(teacherIds),
    departmentId: faker.helpers.arrayElement(departmentIds),
    createdAt: randomValues.dates[i],
    updatedAt: randomValues.futureDates[i],
    isDeleted: false,
    deletedAt: null,
  }))

  console.log('Done!')
  return classes
}

// Generate students with optimizations
const generateStudents = async (accounts: Account[], classes: Class[]): Promise<Student[]> => {
  console.log('Generating students...')
  const studentAccounts = accounts.filter((acc) => acc.role === Role.STUDENT)
  const codes = generateSequentialCodes('SV', 1, studentAccounts.length, 4)
  const randomValues = preGenerateRandomValues(studentAccounts.length)
  const classIds = classes.map((c) => c.id)

  const students = studentAccounts.map((account, i) => ({
    id: uuidv4(),
    code: codes[i],
    accountId: account.id,
    classId: faker.helpers.arrayElement(classIds),
    createdAt: randomValues.dates[i],
    updatedAt: randomValues.futureDates[i],
  }))

  console.log('Done!')
  return students
}

// Generate courses with optimizations
const generateCourses = async (count: number = 15): Promise<Course[]> => {
  console.log('Generating courses...')
  const codes = generateSequentialCodes('HP', 1, count, 4)
  const randomValues = preGenerateRandomValues(count)
  const preGeneratedJobTitles = Array.from(
    { length: count },
    () => `${faker.person.jobTitle()} - ${faker.number.int({ min: 1, max: 999 })}`
  )

  const courses = Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    code: codes[i],
    name: preGeneratedJobTitles[i],
    credit: faker.number.int({ min: 1, max: 5 }),
    lesson: faker.number.int({ min: 1, max: 10 }),
    isDeleted: false,
    deletedAt: null,
    createdAt: randomValues.dates[i],
    updatedAt: randomValues.futureDates[i],
  }))

  console.log('Done!')
  return courses
}

// Generate seminars with optimizations
const generateSeminars = async (
  courses: Course[],
  teachers: Teacher[],
  count: number = 30
): Promise<Seminar[]> => {
  console.log('Generating seminars...')
  const codes = generateSequentialCodes('LHP', 1, count, 3)
  const randomValues = preGenerateRandomValues(count)
  const courseIds = courses.map((c) => c.id)
  const teacherIds = teachers.map((t) => t.id)
  const courseNames = courses.map((c) => c.name)

  // Pre-generate years and dates
  const currentYear = faker.date.between({ from: '2020-01-01', to: '2024-12-31' }).getFullYear()
  const yearRange = `${currentYear}-${currentYear + 1}`
  const startDateRange = {
    from: new Date(`${currentYear}-09-01`),
    to: new Date(`${currentYear}-09-15`),
  }
  const endDateRange = {
    from: new Date(`${currentYear + 1}-01-01`),
    to: new Date(`${currentYear + 1}-01-15`),
  }

  // Pre-generate dates for better performance
  const startDates = Array.from({ length: count }, () =>
    faker.date.between({ from: startDateRange.from, to: startDateRange.to })
  )
  const endDates = Array.from({ length: count }, () =>
    faker.date.between({ from: endDateRange.from, to: endDateRange.to })
  )

  const seminars = Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    code: codes[i],
    name: `${faker.helpers.arrayElement(courseNames)}-${(i + 1).toString().padStart(2, '0')}`,
    maxCap: faker.number.int({ min: 20, max: 50 }),
    semester: getRandomEnumValue(Semester),
    year: yearRange,
    startDate: startDates[i],
    endDate: endDates[i],
    courseId: faker.helpers.arrayElement(courseIds),
    teacherId: faker.helpers.arrayElement(teacherIds),
    isDeleted: false,
    deletedAt: null,
    createdAt: randomValues.dates[i],
    updatedAt: randomValues.futureDates[i],
  }))

  console.log('Done!')
  return seminars
}

// Generate grades with batch processing
const generateGrades = async (
  students: Student[],
  seminars: Seminar[],
  count: number = 100
): Promise<Grade[]> => {
  console.log('Generating grades...')
  const grades: Grade[] = []
  const studentIds = students.map((s) => s.id)
  const seminarIds = seminars.map((s) => s.id)

  // Pre-generate random points for better performance
  const generatePoints = (count: number) =>
    Array.from({ length: count }, () => faker.number.float({ min: 0, max: 10, multipleOf: 0.1 }))

  await processBatch(Array.from({ length: count }), BATCH_SIZE, async (batch) => {
    const batchSize = batch.length
    const points = {
      attendance: generatePoints(batchSize),
      first: generatePoints(batchSize),
      second: generatePoints(batchSize),
      final: generatePoints(batchSize),
      exam: generatePoints(batchSize),
    }
    const dates = preGenerateRandomValues(batchSize)

    const batchGrades = batch.map((_, i) => ({
      id: uuidv4(),
      studentId: faker.helpers.arrayElement(studentIds),
      seminarId: faker.helpers.arrayElement(seminarIds),
      attendancePoint: points.attendance[i],
      firstPoint: points.first[i],
      secondPoint: points.second[i],
      finalPoint: points.final[i],
      examPoint: points.exam[i],
      isDeleted: false,
      deletedAt: null,
      createdAt: dates.dates[i],
      updatedAt: dates.futureDates[i],
    }))

    grades.push(...batchGrades)
  })

  console.log('Done!')
  return grades
}

export const generateSeedData = async () => {
  console.log('Starting seed data generation...')
  logMemoryUsage()

  const departments = await generateDepartments(DEPARTMENTS_COUNT)
  logMemoryUsage()

  const accounts = await generateAccounts(ACCOUNTS_COUNT)
  logMemoryUsage()

  // Generate teachers and classes in parallel
  const [teachers, courses] = await Promise.all([
    generateTeachers(accounts, departments),
    generateCourses(COURSES_COUNT),
  ])
  logMemoryUsage()

  const classes = await generateClasses(teachers, departments, CLASSES_COUNT)
  logMemoryUsage()

  const students = await generateStudents(accounts, classes)
  logMemoryUsage()

  // Generate seminars and grades in batches
  const seminars = await generateSeminars(courses, teachers, COURSES_COUNT * 2)
  logMemoryUsage()

  const grades = await generateGrades(students, seminars, students.length * 2)
  logMemoryUsage()

  console.log('Seed data generation completed!')
  return {
    departments,
    accounts,
    teachers,
    classes,
    students,
    courses,
    seminars,
    grades,
  }
}
