import { db } from '../connection'
import { Account, Class, Course, Department, Grade, Seminar, Student, Teacher } from '../schema'
import { generateSeedData } from './fake-data'

async function seedWithTransaction() {
  try {
    console.log('🌱 Starting database seeding with transaction...')

    await db.transaction(async (tx) => {
      const { departments, accounts, teachers, classes, students, courses, seminars, grades } =
        await generateSeedData()

      console.log('💾 Inserting departments...')
      await tx.insert(Department).values(departments)

      console.log('💾 Inserting accounts...')
      await tx.insert(Account).values(accounts)

      console.log('💾 Inserting teachers...')
      await tx.insert(Teacher).values(teachers)

      console.log('💾 Inserting classes...')
      await tx.insert(Class).values(classes)

      console.log('💾 Inserting students...')
      await tx.insert(Student).values(students)

      console.log('💾 Inserting courses...')
      await tx.insert(Course).values(courses)

      console.log('💾 Inserting seminars...')
      await tx.insert(Seminar).values(seminars)

      console.log('💾 Inserting grades...')
      await tx.insert(Grade).values(grades)
    })

    console.log('✅ Seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

await seedWithTransaction()
  .then(() => process.exit())
  .catch(console.error)
