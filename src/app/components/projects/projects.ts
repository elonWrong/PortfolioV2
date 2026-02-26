import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  stack: string[];
  link?: string;
  linkText?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'RAG Knowledge Assistant (SwannyAI)',
      description: 'Started of as my final year project, SwannyAI is a specialized multi-agent retrieval-augmented generation system with data chunking built for knowledge retrieval. Uses MCP and RAG approaches to deliver accurate, cited answers.',
      stack: ['Java', 'SpringAI', 'Ollama', 'Chromadb', 'MCP', 'React']
    },
    {
      title: 'Proper deployment of an AI application',
      description: 'Proper deployment of a microservices AI application using Docker, proxy server, and a custom domain.',
      stack: ['Nvidia V100', 'Docker', 'Nginx', 'SpringBoot', 'express.js', 'Node.js']
    },
    {
      title: 'Belimo Chat Assist Project Proposal',
      description: 'A proposed multi-agent framework based on my RAG Knowledge Assistant to streamline access to Belimo’s product documentation and internal business resources.',
      stack: ['Java', 'SpringAI', 'Ollama', 'Chromadb', 'MCP', 'React'],
      link: '#',
      linkText: 'View Project'
    }
  ];
}
