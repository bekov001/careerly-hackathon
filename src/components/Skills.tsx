import React, { useState, useMemo } from 'react';

type Props = {
  setUserSkills: (skills: string[]) => void;
  onNext: () => void;
};

// Full list of skills categorized for the component
const allSkills: Record<string, string[]> = {
  'Программирование': [ // Technical
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby',
    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask',
    'Spring Boot', 'ASP.NET', 'Ruby on Rails', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'REST API', 'GraphQL',
    'Unit Testing', 'Integration Testing', 'CI/CD', 'Algorithms', 'Data Structures', 'DevOps',
    'Microservices', 'Frontend Development', 'Backend Development', 'Full-stack Development',
    'Mobile Development (iOS/Android)', 'Game Development', 'Machine Learning', 'Data Science',
    'Cloud Computing', 'Cybersecurity', 'Blockchain', 'WebSockets'
  ],
  'Дизайн и Креатив': [ // Design
    'UI/UX Design', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign',
    'Motion Graphics', 'Graphic Design', 'Web Design', 'Interaction Design', 'Prototyping',
    'Wireframing', 'Typography', 'Color Theory', 'Branding', 'Video Editing', '3D Modeling',
    'Animation', 'Illustration'
  ],
  'Аналитика и Данные': [ // Business / Data Analytics
    'Data Analysis', 'SQL', 'Python (Pandas, NumPy)', 'R', 'Excel', 'Tableau', 'Power BI',
    'Statistical Analysis', 'A/B Testing', 'Data Visualization', 'Big Data', 'Machine Learning',
    'Predictive Modeling', 'Data Warehousing', 'ETL', 'Business Intelligence', 'Econometrics'
  ],
  'Маркетинг и Продажи': [ // Business / Marketing & Sales
    'Digital Marketing', 'SEO', 'SEM (Google Ads)', 'Social Media Marketing', 'Content Marketing',
    'Email Marketing', 'Affiliate Marketing', 'Market Research', 'Sales Strategy',
    'Lead Generation', 'CRM (Salesforce)', 'Copywriting', 'Public Relations', 'Brand Management',
    'Analytics (Google Analytics)', 'E-commerce', 'Customer Relationship Management'
  ],
  'Менеджмент и Коммуникации': [ // Business / Management & Communication
    'Project Management', 'Agile Methodologies', 'Scrum', 'Kanban', 'Risk Management',
    'Stakeholder Management', 'Team Leadership', 'Communication', 'Negotiation',
    'Problem Solving', 'Strategic Planning', 'Time Management', 'Conflict Resolution',
    'Public Speaking', 'Cross-functional Collaboration', 'Business Development'
  ],
  'Общие и Софт-скиллы': [ // Soft Skills
    'Critical Thinking', 'Adaptability', 'Creativity', 'Empathy', 'Active Listening',
    'Teamwork', 'Attention to Detail', 'Organization', 'Self-motivation', 'Resilience',
    'Curiosity', 'Initiative', 'Research', 'Learning Agility', 'Presentation Skills',
    'Negotiation', 'Mentoring', 'Problem Solving', 'Leadership', 'Creative Writing' // Added from image examples
  ]
};

// Mapping from the image's category names to our internal skill categories
const categoryMapping: Record<string, string[]> = {
  'All': Object.keys(allSkills), // 'All' includes all internal categories
  'Technical': ['Программирование'],
  'Soft Skills': ['Общие и Софт-скиллы'],
  'Design': ['Дизайн и Креатив'],
  'Business': ['Аналитика и Данные', 'Маркетинг и Продажи', 'Менеджмент и Коммуникации'],
};

// Define the order of categories to display in the tabs
const categoryTabs = ['All', 'Technical', 'Soft Skills', 'Design', 'Business'];

export default function Skills({ setUserSkills, onNext }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All'); // State for active category tab

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredAndCategorizedSkills = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const result: Record<string, string[]> = {};

    // Determine which internal categories to consider based on the active tab
    const categoriesToConsider = activeCategory === 'All'
      ? Object.keys(allSkills)
      : categoryMapping[activeCategory] || [];

    for (const internalCategory of categoriesToConsider) {
      const skillsInCategory = allSkills[internalCategory] || [];
      const matched = skillsInCategory.filter(skill =>
        skill.toLowerCase().includes(term)
      );
      if (matched.length > 0) {
        result[internalCategory] = matched;
      }
    }
    return result;
  }, [searchTerm, activeCategory]);

  const handleNext = () => {
    setUserSkills(selectedSkills);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Add your skills
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Select the skills you want to highlight. You can search or choose from categories below.
      </p>

      {/* Search Bar and Plus Button */}
      <div className="relative flex items-center mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Magnifying glass icon */}
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Type to search skills..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        {/* Plus button */}
        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-white bg-blue-500 hover:bg-blue-600 rounded-r-lg px-4 py-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {categoryTabs.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ease-in-out
              ${activeCategory === category
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills Display Area */}
      <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar for better visuals */}
        {Object.keys(filteredAndCategorizedSkills).length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No skills found matching your search or category.
          </p>
        ) : (
          Object.entries(filteredAndCategorizedSkills).map(([internalCategory, skills]) => {
            // Determine a display name for the category if needed, otherwise use internal name
            const displayCategoryName = Object.keys(categoryMapping).find(key =>
                (categoryMapping[key].length === 1 && categoryMapping[key][0] === internalCategory) ||
                (key === 'Business' && categoryMapping[key].includes(internalCategory))
            ) || internalCategory; // Fallback to internal name

            // Skip rendering category header if only 'All' is selected and there's only one category result
            const shouldDisplayCategoryHeader = !(activeCategory === 'All' && Object.keys(filteredAndCategorizedSkills).length === 1 && !searchTerm);

            return (
              <div key={internalCategory} className="mb-6">
                {shouldDisplayCategoryHeader && (
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 sticky top-0 bg-white pt-2 pb-1 border-b border-gray-200">
                    {displayCategoryName === 'Программирование' ? 'Technical' :
                     displayCategoryName === 'Дизайн и Креатив' ? 'Design' :
                     displayCategoryName === 'Общие и Софт-скиллы' ? 'Soft Skills' :
                     displayCategoryName === 'Аналитика и Данные' || displayCategoryName === 'Маркетинг и Продажи' || displayCategoryName === 'Менеджмент и Коммуникации' ? 'Business' :
                     internalCategory
                    }
                  </h3>
                )}
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full border text-sm transition ease-in-out flex items-center
                        ${selectedSkills.includes(skill)
                          ? 'bg-blue-500 text-white border-blue-500' // Selected style from image
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                    >
                      {/* Placeholder for icon if needed, e.g., <span className="mr-1">💡</span> */}
                      {selectedSkills.includes(skill) && (
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!selectedSkills.length}
        className={`btn-primary mt-8 w-full py-3 text-lg font-semibold rounded-lg transition-all duration-200 ease-in-out ${
          !selectedSkills.length
            ? 'bg-blue-300 cursor-not-allowed' // Disabled style
            : 'bg-blue-600 hover:bg-blue-700 text-white' // Enabled style
        }`}
      >
        Next ({selectedSkills.length} selected)
      </button>
    </div>
  );
}