const imageFields = `
  coverImage {
    alt,
    asset
  }
`;

export const HOME_PAGE_QUERY = `{
  "settings": *[_type == "siteSettings"][0] {
    siteTitle,
    role,
    intro,
    email,
    location,
    availability,
    heroMetrics[]{label, value}
  },
  "featuredProjects": *[_type == "project"] | order(featured desc, year desc, _updatedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    summary,
    role,
    year,
    technologies,
    featured,
    demoUrl,
    repositoryUrl,
    ${imageFields}
  },
  "featuredPapers": *[_type == "researchPaper"] | order(featured desc, publishedAt desc, _updatedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    abstract,
    venue,
    publishedAt,
    authors,
    tags,
    paperUrl,
    "paperFileUrl": paperFile.asset->url,
    codeUrl,
    ${imageFields}
  },
  "featuredLinks": *[_type == "resourceLink"] | order(featured desc, _updatedAt desc)[0...6] {
    _id,
    title,
    url,
    description,
    category,
    featured
  },
  "resume": *[_type == "resume"][0] {
    title,
    summary,
    location,
    email,
    availability,
    skills,
    highlights,
    experience,
    updatedAt,
    "resumeFileUrl": resumeFile.asset->url
  }
}`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(featured desc, year desc, _updatedAt desc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  role,
  year,
  technologies,
  featured,
  demoUrl,
  repositoryUrl,
  ${imageFields}
}`;

export const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)][]{
  "slug": slug.current
}`;

export const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  summary,
  role,
  year,
  technologies,
  featured,
  demoUrl,
  repositoryUrl,
  body,
  ${imageFields}
}`;

export const RESEARCH_PAPERS_QUERY = `*[_type == "researchPaper"] | order(featured desc, publishedAt desc, _updatedAt desc) {
  _id,
  title,
  "slug": slug.current,
  abstract,
  venue,
  publishedAt,
  authors,
  tags,
  paperUrl,
  "paperFileUrl": paperFile.asset->url,
  codeUrl,
  ${imageFields}
}`;

export const RESEARCH_SLUGS_QUERY = `*[_type == "researchPaper" && defined(slug.current)][]{
  "slug": slug.current
}`;

export const RESEARCH_PAPER_QUERY = `*[_type == "researchPaper" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  abstract,
  venue,
  publishedAt,
  authors,
  tags,
  paperUrl,
  "paperFileUrl": paperFile.asset->url,
  codeUrl,
  body,
  ${imageFields}
}`;

export const RESOURCE_LINKS_QUERY = `*[_type == "resourceLink"] | order(featured desc, category asc, title asc) {
  _id,
  title,
  url,
  description,
  category,
  featured
}`;

export const RESUME_QUERY = `*[_type == "resume"][0] {
  title,
  summary,
  location,
  email,
  availability,
  skills,
  highlights,
  experience,
  updatedAt,
  "resumeFileUrl": resumeFile.asset->url
}`;