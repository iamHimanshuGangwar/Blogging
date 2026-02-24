import React from "react";
import { 
  Code, 
  Server, 
  Database, 
  Layout,
  Zap,
  Package,
  Cloud,
  GitBranch,
  BookOpen
} from "lucide-react";

const TECH_ICONS = {
  react: Layout,
  nodejs: Server,
  node: Server,
  python: Code,
  javascript: Code,
  typescript: Code,
  mongodb: Database,
  postgresql: Database,
  mysql: Database,
  firebase: Cloud,
  aws: Cloud,
  azure: Cloud,
  docker: Package,
  kubernetes: Package,
  git: GitBranch,
  graphql: Zap,
  rest: Zap,
  nextjs: Layout,
  angular: Layout,
  vue: Layout,
  express: Server,
  fastapi: Server,
  django: Server,
  tailwind: Layout,
  supabase: Database,
  redis: Database,
  elasticsearch: Database,
};

const getTechIcon = (tech) => {
  const techLower = tech.toLowerCase();
  for (const [key, Icon] of Object.entries(TECH_ICONS)) {
    if (techLower.includes(key)) {
      return Icon;
    }
  }
  return BookOpen; // Default icon
};

const TechStackTags = ({ technologies = [] }) => {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {technologies.slice(0, 5).map((tech, idx) => {
        const IconComponent = getTechIcon(tech);
        return (
          <div
            key={idx}
            className="tech-tag"
            title={tech}
          >
            <IconComponent size={14} />
            <span>{tech}</span>
          </div>
        );
      })}
      {technologies.length > 5 && (
        <div className="tech-tag opacity-70 cursor-help" title={technologies.slice(5).join(", ")}>
          <span>+{technologies.length - 5} more</span>
        </div>
      )}
    </div>
  );
};

export default TechStackTags;
