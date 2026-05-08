export interface SanityImage {
  alt?: string;
  asset?: {
    _ref?: string;
    url?: string;
  };
}

export interface SiteMetric {
  label: string;
  value: string;
}

export interface SiteSettings {
  siteTitle?: string;
  role?: string;
  intro?: string;
  email?: string;
  location?: string;
  availability?: string;
  heroMetrics?: SiteMetric[];
}

export interface Project {
  _id: string;
  title: string;
  slug?: string;
  summary?: string;
  role?: string;
  year?: string;
  technologies?: string[];
  featured?: boolean;
  demoUrl?: string;
  repositoryUrl?: string;
  coverImage?: SanityImage;
  body?: unknown[];
}

export interface ResearchPaper {
  _id: string;
  title: string;
  slug?: string;
  abstract?: string;
  venue?: string;
  publishedAt?: string;
  authors?: string[];
  tags?: string[];
  featured?: boolean;
  paperUrl?: string;
  paperFileUrl?: string;
  codeUrl?: string;
  coverImage?: SanityImage;
  body?: unknown[];
}

export interface ResourceLink {
  _id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  featured?: boolean;
}

export interface ResumeDocument {
  title?: string;
  summary?: string;
  location?: string;
  email?: string;
  availability?: string;
  skills?: string[];
  highlights?: string[];
  experience?: unknown[];
  resumeFileUrl?: string;
  updatedAt?: string;
}

export interface GitHubRepoSummary {
  name: string;
  url: string;
  stars: number;
  language?: string;
  pushedAt: string;
}

export interface GitHubStats {
  username: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: string[];
  recentRepositories: GitHubRepoSummary[];
}

export interface LeetCodeStats {
  username: string;
  profileUrl: string;
  ranking: number;
  reputation: number;
  starRating: number;
  solvedTotal: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
}

export interface HomePageData {
  settings: SiteSettings | null;
  featuredProjects: Project[];
  featuredPapers: ResearchPaper[];
  featuredLinks: ResourceLink[];
  resume: ResumeDocument | null;
}