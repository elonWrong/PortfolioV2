import { Component, signal, ElementRef, AfterViewInit, OnDestroy, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Message {
  text: string;
  isBot: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('0.3s cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(10px) scale(0.95)' }))
      ])
    ])
  ]
})
export class ChatbotComponent implements AfterViewInit, OnDestroy {
  isOpen = signal(false);
  isExpanded = signal(false);
  inputMessage = signal('');
  messages = signal<Message[]>([
    { text: "Hello! I'm an AI representation of Elon. Ask me about my projects, skills, or experience.", isBot: true }
  ]);
  isTyping = signal(false);

  // Track section position for docking
  private sectionRect = signal<DOMRect | null>(null);

  @HostListener('window:scroll')
  onScroll() {
    this.updateSectionRect();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSectionRect();
  }

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    // Initial rect calculation
    setTimeout(() => this.updateSectionRect(), 100);
  }

  private updateSectionRect() {
    const section = document.getElementById('chatbot-dock-target');
    if (section) {
      this.sectionRect.set(section.getBoundingClientRect());
    }
  }

  // Compute dynamic styles for the morpher
  morpherStyles = computed(() => {
    const rect = this.sectionRect();
    const expanded = this.isExpanded();
    const open = this.isOpen();

    if (expanded && rect) {
      // Calculate centering offset within the max-width
      const maxWidth = 1000;
      const contentWidth = Math.min(rect.width, maxWidth);
      const leftOffset = rect.left + (rect.width - contentWidth) / 2;

      return {
        'position': 'fixed',
        'top': `${rect.top}px`,
        'left': `${leftOffset}px`,
        'width': `${contentWidth}px`,
        'height': '600px',
        'border-radius': '2rem'
      };
    } else if (open) {
      // Floating window
      return {
        'position': 'fixed',
        'bottom': '7rem',
        'right': '2rem',
        'width': '384px',
        'height': '500px',
        'border-radius': '1.5rem'
      };
    } else {
      // FAB
      return {
        'position': 'fixed',
        'bottom': '2rem',
        'right': '2rem',
        'width': '3.5rem',
        'height': '3.5rem',
        'border-radius': '9999px'
      };
    }
  });

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    const section = document.getElementById('chatbot-dock-target');
    if (!section) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Only expand if at least 70% of the section is visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          this.isExpanded.set(true);
          this.isOpen.set(true);
        } else if (entry.intersectionRatio < 0.3) {
          // Morph back if visibility drops below 30%
          this.isExpanded.set(false);
        }
      });
    }, {
      threshold: [0.3, 0.7] // Handle both entering and leaving with hysteresis
    });

    this.observer.observe(section);
  }

  toggleChat() {
    this.isOpen.update(val => !val);
  }

  sendMessage() {
    const text = this.inputMessage().trim();
    if (!text) return;

    // Add user message
    this.messages.update(msgs => [...msgs, { text, isBot: false }]);
    this.inputMessage.set('');
    this.isTyping.set(true);

    // Simulate delay and response
    setTimeout(() => {
      this.isTyping.set(false);
      this.messages.update(msgs => [
        ...msgs,
        { text: "I'm having trouble connecting to my brain right now. Please try again later!", isBot: true }
      ]);
    }, 1500);
  }
}
