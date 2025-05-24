// src/types.ts
export interface BackendAnalysisResponse {
    suitable_professions: string[];
    vacancies: {
      [key: string]: {
        title: string;
        company: string;
        salary: string;
        link?: string;
      }[];
    };
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
    pdf_links: {
      [key: string]: string;
    };
  }