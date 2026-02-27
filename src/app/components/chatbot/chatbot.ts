import { Component, signal, ElementRef, AfterViewInit, OnDestroy, HostListener, computed, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChatbotService } from './chatbot.service';

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
    { text: "Hello! I'm Swanny, an AI representitive of Elon. Ask me about Elon's projects, skills, or experience.", isBot: true }
  ]);
  isTyping = signal(false);
  private readonly SYSTEM_PROMPT = "system: You are Swanny and NOT Elon Wong. You are an AI representitive of Elon Wong."
    + "You will be describing Elon Wong in the third person. For example, instead of saying 'I did this', say 'Elon/He did this'."
    + "Help users learn about Elon's projects, skills, and experience. "
    + "You're charming and abit playful. All information received is related to Elon Wong."
    + "You're based on the SwannyAI project by Elon Wong during his final year... You can refer to the context provided for more info";
  private readonly WELCOME_MESSAGE = "Hello! I'm Swanny, an AI representitive of Elon. Ask me about Elon's projects, skills, or experience.";
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

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

  constructor(
    private el: ElementRef,
    private chatbotService: ChatbotService
  ) {
    // Auto-scroll effect
    effect(() => {
      // Monitor messages and isTyping
      this.messages();
      this.isTyping();
      this.scrollToBottom();
    });
  }

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
    const section = document.getElementById('ai-demo'); // Changed target ID
    if (!section) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Simplified expansion logic
        if (entry.isIntersecting) {
          this.isExpanded.set(true);
          this.isOpen.set(true);
        } else {
          this.isExpanded.set(false);
        }
      });
    }, {
      threshold: 0.3 // Changed threshold
    });

    this.observer.observe(section);
  }

  toggleChat() {
    this.isOpen.update(val => !val);
  }

  sendMessage() {
    const text = this.inputMessage().trim();
    if (!text) return;

    // 1. Build context from existing messages (excluding the first welcome message if desired, 
    // but here we include all for consistency with the reference)
    const contextPrompt = this.messages()
      .filter(msg => msg.text !== this.WELCOME_MESSAGE)
      .map(msg => `${msg.isBot ? 'assistant' : 'user'}: ${msg.text}`)
      .join('\n');

    // 2. Construct final prompt matching the reference implementation format
    const fullPrompt = this.SYSTEM_PROMPT + '\n' + (contextPrompt ? contextPrompt + '\n' : '') + 'user: ' + text + '\nassistant:';

    console.log('Sending message with context:', fullPrompt);

    // 3. Update UI with user message
    this.messages.update(msgs => [...msgs, { text, isBot: false }]);
    this.inputMessage.set('');
    this.isTyping.set(true);

    let botMessageIndex = -1;

    // 4. Send the FULL PROMPT to the service
    this.chatbotService.sendMessageStream(fullPrompt).subscribe({
      next: (chunk: string) => {
        if (this.isTyping()) {
          this.isTyping.set(false);
          this.messages.update(msgs => {
            botMessageIndex = msgs.length;
            return [...msgs, { text: chunk, isBot: true }];
          });
        } else {
          this.messages.update(msgs => {
            const updated = [...msgs];
            if (botMessageIndex !== -1) {
              updated[botMessageIndex] = {
                ...updated[botMessageIndex],
                text: updated[botMessageIndex].text + chunk
              };
            }
            return updated;
          });
        }
      },
      error: (err: any) => {
        this.isTyping.set(false);
        this.messages.update(msgs => [
          ...msgs,
          { text: "I'm having trouble connecting to my brain right now. Please try again later!", isBot: true }
        ]);
        console.error('Chatbot error:', err);
      },
      complete: () => {
        this.isTyping.set(false);
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      try {
        if (this.scrollContainer) {
          const element = this.scrollContainer.nativeElement;
          element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }
      } catch (err) { }
    }, 100);
  }
}
