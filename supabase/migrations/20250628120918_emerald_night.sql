-- Insert sample content generation prompts
INSERT INTO cotent_generation_prompt (name, prompt, status) VALUES
(
  'Professional LinkedIn Content',
  'Create professional and engaging LinkedIn content based on the provided idea. The content should be suitable for business professionals and thought leaders. Use a professional yet approachable tone, include relevant hashtags, and structure the content to encourage engagement. Keep the content informative, actionable, and valuable to the target audience.',
  'active'
),
(
  'Social Media Posts',
  'Generate engaging social media content for various platforms (Twitter, Facebook, Instagram) based on the given idea. Adapt the tone and format to suit each platform while maintaining brand consistency. Include relevant hashtags, emojis where appropriate, and call-to-action elements to drive engagement.',
  'inactive'
),
(
  'Technical Blog Content',
  'Create detailed technical blog content based on the provided idea. The content should be informative, well-structured with clear headings, and include practical examples or code snippets where relevant. Target developers, engineers, and technical professionals with in-depth explanations and actionable insights.',
  'inactive'
),
(
  'Marketing Copy',
  'Develop compelling marketing copy based on the given idea. Focus on benefits over features, use persuasive language, and include strong calls-to-action. The content should be conversion-focused and tailored to the target audience, whether for email campaigns, landing pages, or promotional materials.',
  'inactive'
)
ON CONFLICT DO NOTHING;