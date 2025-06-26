/*
  # Insert sample data for demonstration

  1. Sample Data
    - Insert demo users
    - Insert sample sources
    - Insert sample ideas
    - Insert sample contents

  2. Notes
    - This data is for demonstration purposes
    - Real applications would have users create their own data
*/

-- Insert sample users
INSERT INTO users (name, email, domain, linkedin_url, twitter_url) VALUES
('John Doe', 'john.doe@example.com', 'technology', 'https://linkedin.com/in/johndoe', 'https://twitter.com/johndoe'),
('Jane Smith', 'jane.smith@example.com', 'marketing', 'https://linkedin.com/in/janesmith', 'https://twitter.com/janesmith'),
('Mike Johnson', 'mike.johnson@example.com', 'finance', 'https://linkedin.com/in/mikejohnson', 'https://twitter.com/mikejohnson')
ON CONFLICT DO NOTHING;

-- Insert sample sources
INSERT INTO sources (user_id, source_type, description, url, key) VALUES
(1, 'Website', 'TechCrunch - Latest technology news', 'https://techcrunch.com', 'Active'),
(1, 'RSS Feed', 'Hacker News RSS feed', 'https://hnrss.org/frontpage', 'Active'),
(2, 'Social Media', 'Marketing expert Twitter account', '@marketingexpert', 'Active'),
(2, 'Website', 'Content Marketing Institute', 'https://contentmarketinginstitute.com', 'Active'),
(3, 'Website', 'Financial Times', 'https://ft.com', 'Active'),
(1, 'Website', 'Wired Magazine', 'https://wired.com', 'Inactive'),
(2, 'RSS Feed', 'Marketing Land RSS', 'https://marketingland.com/feed', 'Active'),
(3, 'Social Media', 'Finance Twitter account', '@financeexpert', 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample ideas
INSERT INTO ideas (user_id, content, priority_score, status) VALUES
(1, 'AI is revolutionizing healthcare with predictive analytics and personalized treatment plans', 0.8, 'new'),
(1, 'The future of remote work: 5 trends shaping the digital workplace', 0.7, 'new'),
(1, 'Blockchain technology beyond cryptocurrency: Real-world applications', 0.6, 'new'),
(2, 'Content marketing strategies that drive engagement in 2024', 0.9, 'new'),
(2, 'Social media algorithms: How to optimize your content for maximum reach', 0.8, 'new'),
(2, 'Email marketing automation: Best practices for nurturing leads', 0.7, 'new'),
(3, 'Sustainable investing: The rise of ESG funds', 0.8, 'new'),
(3, 'Cryptocurrency regulation: What investors need to know', 0.7, 'new'),
(3, 'Personal finance apps: Revolutionizing money management', 0.6, 'new'),
(1, 'Machine learning in cybersecurity: Protecting against evolving threats', 0.9, 'used'),
(2, 'Influencer marketing ROI: Measuring success in the digital age', 0.8, 'used'),
(3, 'The gig economy and retirement planning: New challenges and solutions', 0.7, 'used')
ON CONFLICT DO NOTHING;

-- Insert sample contents
INSERT INTO contents (user_id, idea_id, platform, type, status, content) VALUES
(1, 1, 'linkedin', 'article', 'draft', 'AI is revolutionizing healthcare with predictive analytics and personalized treatment plans. Healthcare providers are now able to predict patient outcomes with unprecedented accuracy...'),
(1, 2, 'twitter', 'tweet', 'ready', 'The future of remote work is here! 🚀 5 key trends shaping the digital workplace: 1) Hybrid models 2) AI-powered collaboration 3) Virtual reality meetings 4) Flexible schedules 5) Results-focused culture #RemoteWork #FutureOfWork'),
(1, 3, 'instagram', 'post', 'draft', 'Blockchain technology is expanding beyond cryptocurrency into real-world applications that could transform industries...'),
(2, 4, 'linkedin', 'article', 'published', 'Content marketing strategies that drive engagement in 2024: Understanding your audience, creating valuable content, and measuring success...'),
(2, 5, 'facebook', 'post', 'ready', 'Cracking the code on social media algorithms! Here are the key factors that determine your content reach and engagement...'),
(2, 6, 'twitter', 'tweet', 'draft', 'Email marketing automation is a game-changer for lead nurturing. Here are the best practices every marketer should know... 🧵'),
(3, 7, 'linkedin', 'article', 'published', 'Sustainable investing and ESG funds are reshaping the investment landscape. Here is what you need to know...'),
(3, 8, 'twitter', 'tweet', 'ready', 'Cryptocurrency regulation is evolving rapidly. Investors need to stay informed about these key developments... #Crypto #Regulation'),
(3, 9, 'instagram', 'post', 'draft', 'Personal finance apps are revolutionizing how we manage money. From budgeting to investing, these tools are making financial literacy accessible to everyone...'),
(1, 10, 'linkedin', 'article', 'published', 'Machine learning is transforming cybersecurity by enabling proactive threat detection and response...'),
(2, 11, 'instagram', 'post', 'published', 'Measuring influencer marketing ROI in the digital age requires new metrics and approaches...'),
(3, 12, 'facebook', 'post', 'published', 'The gig economy presents unique challenges for retirement planning, but also new opportunities...')
ON CONFLICT DO NOTHING;