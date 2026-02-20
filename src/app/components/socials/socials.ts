import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Activity {
    type: string;
    title: string;
    date: string;
    link: string;
    embedUrl?: string;
    imageUrl?: string;
}

@Component({
    selector: 'app-socials',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './socials.html',
    styleUrl: './socials.css'
})
export class SocialsComponent {
    private sanitizer = inject(DomSanitizer);

    socials = [
        {
            name: 'GitHub',
            icon: 'github',
            url: 'https://github.com/elonWrong',
            description: 'Check out my latest code experiments and open-source contributions.',
            color: 'from-[#24292e] to-[#4078c0]'
        },
        {
            name: 'LinkedIn',
            icon: 'linkedin',
            url: 'https://linkedin.com/in/elonwong',
            description: 'Connect with me for professional inquiries and industry insights.',
            color: 'from-[#0077b5] to-[#00a0dc]'
        }
    ];

    // Placeholder URLs for the demo. User can swap these with real embed URLs.
    featuredActivity: Activity[] = [
        {
            type: 'LinkedIn Post',
            title: 'FedEx Internship 2024 Recap',
            date: 'Jan 30, 2024',
            imageUrl: 'https://media.licdn.com/dms/image/v2/D4E22AQF09vVGcHmtpw/feedshare-shrink_1280/B4EZSza_5VGwAo-/0/1738176988930?e=1773273600&v=beta&t=4_nV4knBzmTYZFQdhgWbBNNDuOXE87r1HBTDmwq2YRo',
            link: 'https://www.linkedin.com/posts/elonwong_fedex-internship-2024-june-september-over-activity-7290442747541372928-PlxX'
        }
    ];

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
