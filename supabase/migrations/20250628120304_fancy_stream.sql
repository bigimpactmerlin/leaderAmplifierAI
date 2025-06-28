/*
  # Add sample prompts to idea_generation_prompt table

  1. Sample Data
    - Insert sample idea generation prompts
    - Set one as active by default
*/

-- Insert sample prompts
INSERT INTO idea_generation_prompt (name, prompt, status) VALUES
(
  'Technology & Innovation',
  'Generate creative and engaging content ideas for a technology company focused on AI, machine learning, and digital transformation. The ideas should be relevant to business leaders, tech professionals, and entrepreneurs. Focus on trends, insights, practical applications, and thought leadership topics that would resonate with a professional audience on LinkedIn, Twitter, and other business platforms.',
  'active'
),
(
  'Marketing & Growth',
  'Create compelling content ideas for marketing professionals and business growth experts. Focus on digital marketing strategies, customer acquisition, brand building, social media marketing, content marketing, and growth hacking techniques. The content should be actionable, data-driven, and suitable for marketing professionals and business owners.',
  'inactive'
),
(
  'Finance & Investment',
  'Develop insightful content ideas for finance professionals, investors, and business leaders interested in financial markets, investment strategies, personal finance, and economic trends. Include topics about cryptocurrency, sustainable investing, market analysis, and financial planning that would engage finance professionals and investors.',
  'inactive'
),
(
  'Leadership & Management',
  'Generate thought-provoking content ideas focused on leadership development, team management, organizational culture, and business strategy. Target executives, managers, and aspiring leaders with content about leadership skills, team building, change management, and strategic thinking.',
  'inactive'
)
ON CONFLICT DO NOTHING;