export const modules = [
  {
    id: 'acf-basics',
    title: 'ACF Basics',
    description: 'Understand the core concepts of Advanced Custom Fields.',
    lessons: [
      {
        title: 'Introduction to ACF',
        content: `<h2>What is ACF?</h2><p>Advanced Custom Fields (ACF) is a WordPress plugin that allows you to add extra content fields to your WordPress edit screens.</p><p>These extra content fields are more commonly referred to as Custom Fields and can allow you to build websites faster and educate your clients quicker.</p>`
      },
      {
        title: 'Field Groups and Field Types',
        content: `<h2>Field Groups</h2><p>Field groups are how you organize your custom fields. You can create multiple field groups, each with its own set of fields and location rules.</p><h2>Field Types</h2><p>ACF provides a wide variety of field types, from simple text inputs to complex repeaters and flexible content fields.</p>`
      }
    ],
    practiceProblems: [
      {
        title: 'Create a "Hero Section" Field Group',
        problem: 'Create a new field group called "Hero Section" with two fields: a Text field for the "Headline" and a Text Area field for the "Subheading".',
        solution: `1. Go to Custom Fields > Add New.\n2. Title the field group "Hero Section".\n3. Click "+ Add Field".\n4. Set Field Label to "Headline", Field Name will auto-populate as "headline", Field Type is "Text".\n5. Click "+ Add Field" again.\n6. Set Field Label to "Subheading", Field Name will auto-populate as "subheading", Field Type is "Text Area".\n7. Under "Location", set rules to show this field group if "Post Type" is equal to "Page".\n8. Click "Publish".`,
        feedback: 'This exercise helps you understand the basic workflow of creating field groups and adding simple fields.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary purpose of a Field Group in ACF?',
        options: ['To style fields', 'To organize a set of custom fields', 'To add new post types', 'To store user data'],
        correctAnswer: 1
      }
    ]
  },
];

export const diagnosticQuestions = [
  {
    id: 'd1',
    module: 'acf-basics',
    question: 'Which ACF field type allows you to create a repeatable set of sub-fields?',
    options: ['Text Area', 'Gallery', 'Repeater', 'Flexible Content'],
    correctAnswer: 2
  },
  {
    id: 'd2',
    module: 'acf-basics',
    question: 'Where do you define the rules for where a field group should appear?',
    options: ['In the theme\'s functions.php file', 'Under the "Presentation" settings', 'Under the "Location" settings of the field group', 'In the post editor screen'],
    correctAnswer: 2
  }
];