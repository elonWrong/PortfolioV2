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
      title: 'RAG Knowledge Assistant',
      description: 'A specialized retrieval-augmented generation system built for enterprise documentation. Uses LangChain and Pinecone to deliver accurate, cited answers.',
      stack: ['Python', 'LangChain', 'OpenAI API', 'React']
    },
    {
      title: 'Fine-Tuned Code Llama',
      description: 'Custom fine-tuning of Llama 3 on a proprietary codebase to improve code completion and refactoring suggestions for internal teams.',
      stack: ['PyTorch', 'Hugging Face', 'LoRA']
    },
    {
      title: 'Autonomous Agent Swarm',
      description: 'A framework for multi-agent collaboration where specialized agents (researcher, writer, reviewer) work together to generate content.',
      stack: ['AutoGen', 'Docker', 'FastAPI'],
      link: '#',
      linkText: 'View Project'
    }
  ];
}
