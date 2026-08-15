require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Campus = require('../models/Campus');

// New courses to add
const newCourses = [
  {
    name: 'Python Programming',
    description: 'Learn Python programming from basics to advanced',
    modules: [
      { 
        title: 'Python Basics', 
        order: 1, 
        topics: [
          { title: 'Variables and Data Types', order: 1 },
          { title: 'Operators', order: 2 },
          { title: 'Control Flow', order: 3 }
        ] 
      },
      { 
        title: 'Functions & OOP', 
        order: 2, 
        topics: [
          { title: 'Functions', order: 1 },
          { title: 'Classes', order: 2 },
          { title: 'Inheritance', order: 3 }
        ] 
      },
    ],
  },
  {
    name: 'Mobile App Development',
    description: 'Build mobile applications with React Native',
    modules: [
      { 
        title: 'React Native Fundamentals', 
        order: 1, 
        topics: [
          { title: 'Setup & Environment', order: 1 },
          { title: 'Components', order: 2 },
          { title: 'Navigation', order: 3 }
        ] 
      },
    ],
  },
  {
    name: 'Data Science & Analytics',
    description: 'Master data science concepts and tools',
    modules: [
      { 
        title: 'Pandas & NumPy', 
        order: 1, 
        topics: [
          { title: 'Data Manipulation', order: 1 },
          { title: 'Statistical Analysis', order: 2 }
        ] 
      },
    ],
  },
  {
    name: 'UI/UX Design',
    description: 'Design beautiful user interfaces',
    modules: [
      { 
        title: 'Design Principles', 
        order: 1, 
        topics: [
          { title: 'Color Theory', order: 1 },
          { title: 'Typography', order: 2 },
          { title: 'Layout', order: 3 }
        ] 
      },
    ],
  },
];

async function addCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('📚 Adding new courses to the system...\n');

    for (const courseData of newCourses) {
      // Check if course already exists
      let course = await Course.findOne({ name: courseData.name });

      if (course) {
        console.log(`⏭️  Skipped: ${courseData.name} (already exists)`);
      } else {
        course = await Course.create({
          ...courseData,
          status: 'Active',
        });
        console.log(`✅ Added: ${courseData.name}`);

        // Create batch for each campus
        const campuses = await Campus.find({ status: 'Active' });
        for (const campus of campuses) {
          const batchExists = await Batch.findOne({
            name: 'Batch 1',
            course: course._id,
            campus: campus._id,
          });

          if (!batchExists) {
            await Batch.create({
              name: 'Batch 1',
              course: course._id,
              campus: campus._id,
              year: new Date().getFullYear(),
            });
          }
        }
      }
    }

    console.log('\n📊 All courses processed successfully!');

    // List all courses
    const allCourses = await Course.find({ status: 'Active' }).sort({ name: 1 });
    console.log('\n📋 Total courses in system:', allCourses.length);
    console.log('Courses:');
    allCourses.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addCourses();
