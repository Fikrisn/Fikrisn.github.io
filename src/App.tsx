import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Code, Database, Globe, Sparkles, ExternalLink, Menu, X } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  stargazers_count: number;
  topics: string[];
}

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [repositories, setRepositories] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubStats, setGithubStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalCommits: 0,
    languagesCount: 0,
    publicGists: 0,
    followers: 0
  });

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        
        // Fetch repositories
        const reposResponse = await fetch('https://api.github.com/users/fikrisn/repos?sort=updated&per_page=100');
        const reposData = await reposResponse.json();
        setRepositories(reposData);
        
        // Fetch user profile for additional stats
        const userResponse = await fetch('https://api.github.com/users/fikrisn');
        const userData = await userResponse.json();
        
        // Calculate GitHub statistics
        const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
        const languages = [...new Set(reposData.map((repo: any) => repo.language).filter(Boolean))];
        
        setGithubStats({
          totalRepos: userData.public_repos || reposData.length,
          totalStars: totalStars,
          totalCommits: 150, // This would need GitHub API v4 (GraphQL) for exact count
          languagesCount: languages.length,
          publicGists: userData.public_gists || 0,
          followers: userData.followers || 0
        });
        
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    // Counter animation function
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target as HTMLElement;
            const target = parseInt(counter.getAttribute('data-target') || '0');
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
              if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toString();
                setTimeout(updateCounter, 20);
              } else {
                counter.textContent = target.toString();
              }
            };
            
            updateCounter();
            observer.unobserve(counter);
          }
        });
      });

      counters.forEach(counter => observer.observe(counter));
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialize counter animation after component mounts
    setTimeout(animateCounters, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Filter featured projects to show specific projects
  const featuredProjectNames = ['PBL_SDM', 'microservice-shared-database', 'wepus'];
  const featuredProjects = repositories.filter(repo => 
    featuredProjectNames.some(name => 
      repo.name.toLowerCase().includes(name.toLowerCase()) || 
      repo.name.toLowerCase().replace(/[-_]/g, '').includes(name.toLowerCase().replace(/[-_]/g, ''))
    )
  ).slice(0, 3);
  
  const skills = [
    { name: 'TypeScript', icon: Code, level: 90 },
    { name: 'React', icon: Code, level: 85 },
    { name: 'Bun.sh', icon: Code, level: 80 },
    { name: 'Hono.js', icon: Code, level: 75 },
    { name: 'Laravel', icon: Database, level: 80 },
    { name: 'PostgreSQL', icon: Database, level: 85 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden relative">
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 nav-glass">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Left Navigation Items */}
            <div className="hidden md:flex space-x-8">
              {['about', 'skills'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-all duration-300 hover:text-blue-400 nav-link relative ${
                    activeSection === item ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {item}
                  <span className="nav-link-underline"></span>
                </button>
              ))}
            </div>

            {/* Center Brand Name */}
            <button
              onClick={() => scrollToSection('hero')}
              className="text-xl font-bold text-white nav-brand"
            >
              fkrdev
            </button>
            
            {/* Right Navigation Items */}
            <div className="hidden md:flex space-x-8">
              {['projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-all duration-300 hover:text-blue-400 nav-link relative ${
                    activeSection === item ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {item}
                  <span className="nav-link-underline"></span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/50 backdrop-blur-md">
              <div className="px-6 py-6 space-y-6">
                {['hero', 'about', 'skills', 'projects', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`block w-full text-left capitalize transition-all duration-300 hover:text-blue-400 py-3 px-4 rounded-lg ${
                      activeSection === item ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="text-center px-6 max-w-4xl mx-auto relative z-20">
          <div className="hero-content">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up hero-title">
              <span className="hero-highlight">fkrdev</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200 hero-subtitle">
              Student at Politeknik Negeri Malang | Business Information Systems
            </p>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
              Passionate about creating efficient, scalable solutions through modern web technologies and innovative problem-solving approaches.
            </p>

            <div className="flex justify-center space-x-6 mb-12 animate-fade-in-up animation-delay-600">
              <a 
                href="https://github.com/fikrisn" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://linkedin.com/in/fikri-setiawan" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="mailto:fikri@example.com"
                className="social-link"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            <div className="flex justify-center space-x-4 animate-fade-in-up animation-delay-800">
              <button 
                onClick={() => scrollToSection('projects')}
                className="btn-primary hero-btn"
              >
                View Projects
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="btn-secondary hero-btn"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Section Divider */}
      <div className="section-divider">
        <div className="divider-container">
          <div className="divider-line"></div>
          <div className="divider-dot">
            <div className="divider-dot-inner"></div>
          </div>
          <div className="divider-line"></div>
        </div>
        <div className="divider-glow"></div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">About Me</h2>
          
          {/* Main About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Side - Personal Info */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover-card about-card">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Who I Am</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  I'm a Business Information Systems student at <span className="text-blue-400 font-medium">Politeknik Negeri Malang</span> with a passion for full-stack development.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  I specialize in creating efficient, scalable solutions that bridge the gap between business needs and modern technology.
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover-card about-card">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">What I Do</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  My journey in technology focuses on modern web development using cutting-edge tools like 
                  <span className="text-green-400 font-medium"> Bun.sh</span>, 
                  <span className="text-blue-400 font-medium"> TypeScript</span>, and 
                  <span className="text-purple-400 font-medium"> Laravel</span> to create user-centric applications that deliver real value.
                </p>
              </div>
            </div>

            {/* Right Side - Stats and Achievements */}
            <div className="space-y-6">
              {/* Achievement Stats */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover-card about-card">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">GitHub Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2 counter" data-target={githubStats.totalRepos}>0</div>
                    <p className="text-gray-400">Public Repos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2 counter" data-target={githubStats.totalStars}>0</div>
                    <p className="text-gray-400">Total Stars</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2 counter" data-target={githubStats.languagesCount}>0</div>
                    <p className="text-gray-400">Languages</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2 counter" data-target={githubStats.followers}>0</div>
                    <p className="text-gray-400">Followers</p>
                  </div>
                </div>
              </div>

              {/* Education & Background */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover-card about-card">
                <h3 className="text-2xl font-semibold text-white mb-6">Education & Background</h3>
                <div className="space-y-8">
                  {/* Current Education */}
                  <div className="timeline-item">
                    <div className="flex items-start">
                      <div className="timeline-dot timeline-dot-current"></div>
                      <div className="flex-1 ml-6">
                        <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-6">
                          <div className="flex items-center mb-3">
                            <Globe className="w-6 h-6 text-blue-400 mr-3" />
                            <p className="text-white font-bold text-xl">Business Information Systems</p>
                          </div>
                          <p className="text-blue-400 font-semibold text-lg mb-2">Politeknik Negeri Malang</p>
                          <p className="text-gray-400 mb-3">2022 - Present (Expected 2025) | GPA: 3.8/4.0</p>
                          <div className="space-y-3">
                            <p className="text-gray-300">
                              <span className="text-white font-medium">Focus:</span> System Analysis, Database Design, Enterprise Application Development
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              <div className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-white font-medium text-sm mb-1">Core Subjects</p>
                                <p className="text-gray-400 text-sm">System Analysis & Design, Database Management, Web Programming, Enterprise Architecture</p>
                              </div>
                              <div className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-white font-medium text-sm mb-1">Key Projects</p>
                                <p className="text-gray-400 text-sm">HRM System, Microservice Architecture, E-commerce Platform</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Previous Education */}
                  <div className="timeline-item">
                    <div className="flex items-start">
                      <div className="timeline-dot"></div>
                      <div className="flex-1 ml-6">
                        <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-6">
                          <div className="flex items-center mb-3">
                            <Code className="w-5 h-5 text-green-400 mr-3" />
                            <p className="text-white font-semibold text-lg">Teknik Komputer dan Jaringan</p>
                          </div>
                          <p className="text-green-400 font-medium mb-2">SMK Sore Tulungagung</p>
                          <p className="text-gray-400 mb-3">2019 - 2022 | Computer and Network Engineering</p>
                          <div className="space-y-2">
                            <p className="text-gray-300 text-sm">
                              Comprehensive foundation in computer systems, network infrastructure, and technical troubleshooting.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <div className="bg-gray-700/30 rounded-lg p-3">
                                <p className="text-white font-medium text-sm mb-1">Technical Skills</p>
                                <p className="text-gray-400 text-xs">Network Configuration, Hardware Assembly, System Administration, Troubleshooting</p>
                              </div>
                              <div className="bg-gray-700/30 rounded-lg p-3">
                                <p className="text-white font-medium text-sm mb-1">Programming Foundation</p>
                                <p className="text-gray-400 text-xs">Basic Programming, Database Concepts, Web Development Introduction</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications & Learning */}
                  <div className="timeline-item">
                    <div className="flex items-start">
                      <div className="timeline-dot timeline-dot-learning"></div>
                      <div className="flex-1 ml-6">
                        <div className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <Sparkles className="w-5 h-5 text-purple-400 mr-3" />
                            <p className="text-white font-semibold text-lg">Continuous Learning & Certifications</p>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <Code className="w-4 h-4 text-orange-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Modern JavaScript & TypeScript</p>
                                <p className="text-gray-400 text-sm">Advanced ES6+, TypeScript fundamentals, async programming patterns</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <Database className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Database Design & Optimization</p>
                                <p className="text-gray-400 text-sm">PostgreSQL, MySQL, database normalization, query optimization</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <Globe className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Full Stack Web Development</p>
                                <p className="text-gray-400 text-sm">React, Laravel, RESTful APIs, microservices architecture</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <Code className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Network & System Administration</p>
                                <p className="text-gray-400 text-sm">Building on SMK foundation: server management, network protocols, infrastructure</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Interests & Goals */}
                  <div className="border-l-2 border-gray-700 pl-6 ml-6 mt-8">
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                      <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                      Technical Interests & Future Goals
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold mb-2">Modern Web Development</p>
                            <p className="text-gray-400 text-sm mb-3">
                              Passionate about leveraging cutting-edge technologies like Bun.js runtime for ultra-fast JavaScript applications,
                              combined with Hono.js for lightweight yet powerful API development.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">Bun.js</span>
                              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">Hono.js</span>
                              <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">TypeScript</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Database className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold mb-2">Enterprise System Architecture</p>
                            <p className="text-gray-400 text-sm mb-3">
                              Designing scalable microservices architectures with shared databases, implementing clean API patterns,
                              and creating robust business information systems that solve real-world problems.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">Laravel</span>
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">PostgreSQL</span>
                              <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">Microservices</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold mb-2">Network & Infrastructure Foundation</p>
                            <p className="text-gray-400 text-sm mb-3">
                              Leveraging my SMK TKJ background in computer networks and system administration to build robust,
                              scalable infrastructure solutions and understand full-stack application deployment.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded text-xs">Network Config</span>
                              <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">System Admin</span>
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">Infrastructure</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold mb-2">Performance & Innovation</p>
                            <p className="text-gray-400 text-sm mb-3">
                              Committed to continuous learning and staying at the forefront of technology trends.
                              Currently exploring AI integration, cloud computing, and advanced optimization techniques.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">Performance</span>
                              <span className="px-2 py-1 bg-pink-600/20 text-pink-400 rounded text-xs">Innovation</span>
                              <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded text-xs">Cloud</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover-card about-card text-center"
            >
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Clean Code</h4>
              <p className="text-gray-400">Writing maintainable, efficient, and scalable code that stands the test of time.</p>
            </div>

            <div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover-card about-card text-center"
            >
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Innovation</h4>
              <p className="text-gray-400">Embracing new technologies and creative solutions to solve complex problems.</p>
            </div>

            <div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover-card about-card text-center"
            >
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Performance</h4>
              <p className="text-gray-400">Optimizing applications for speed, efficiency, and exceptional user experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div 
                key={skill.name}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl hover-card skill-card"
              >
                <div className="flex items-center mb-4">
                  <skill.icon className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full skill-bar"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 mt-2">{skill.level}% proficiency</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="mt-4 text-gray-400">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover-card project-card cursor-pointer"
                  onClick={() => window.open(project.html_url, '_blank')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                    <div className="flex space-x-2">
                      <a 
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <Github size={16} />
                      </a>
                      {project.homepage && (
                        <a 
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{project.description || 'No description available'}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                      {project.language}
                    </span>
                    <span className="text-gray-500 text-sm">⭐ {project.stargazers_count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-12">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://github.com/fikrisn"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-large"
            >
              <Github className="w-8 h-8" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://linkedin.com/in/fikri-setiawan"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-large"
            >
              <Linkedin className="w-8 h-8" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="mailto:fikri@example.com"
              className="social-link-large"
            >
              <Mail className="w-8 h-8" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2024 Moch Fikri Setiawan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
