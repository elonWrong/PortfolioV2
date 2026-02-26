import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface PostStats {
    reactions: number;
    comments: number;
}

interface Activity {
    type: string;
    authorName: string;
    authorRole: string;
    date: string;
    link: string;
    caption: string;
    images: string[];
    stats?: PostStats;
    embedUrl?: string;
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

    profileSkills = [
        'Angular', 'Spring Boot', 'LLMs', 'RAG', 'TypeScript', 'Java', 'Docker', 'PostgreSQL'
    ];

    // To add a new post, copy this object structure and fill in your details.
    featuredActivity: Activity[] = [
        {
            type: 'LinkedIn Post',
            authorName: 'Elon W.',
            authorRole: 'FSML Project · Full-Stack Junior Developer',
            date: 'Jan 30, 2024',
            link: 'https://www.linkedin.com/posts/elonwong_fedex-internship-2024-june-september-over-activity-7290442747541372928-PlxX',
            caption: `FedEx Internship 2024 (June – September) — Over and out! 🛫\n\nIt has been an incredible 3 months working at FedEx as a Software Engineering Intern. I got to work on real-world systems, collaborate with brilliant engineers, and experience the scale of global logistics tech firsthand.\n\nHighlights:\n🚀 Shipped features used by thousands of operations staff\n📦 Learned how tech powers the movement of millions of packages daily\n🤝 Built lasting connections with mentors and teammates\n\nThankful for the opportunity. Onwards! #FedEx #Internship #SoftwareEngineering`,
            images: [
                'https://media.licdn.com/dms/image/v2/D4E22AQF09vVGcHmtpw/feedshare-shrink_1280/B4EZSza_5VGwAo-/0/1738176988930?e=1773273600&v=beta&t=4_nV4knBzmTYZFQdhgWbBNNDuOXE87r1HBTDmwq2YRo',
                'https://media.licdn.com/dms/image/v2/D4E22AQFAWP-qwNA5Wg/feedshare-shrink_1280/B4EZSza_6bHcA0-/0/1738176992995?e=1773273600&v=beta&t=6jRRh0sIx0-Mum859KQdKDL1-ptvkgFWgqb4-tc1DvM',
                'https://media.licdn.com/dms/image/v2/D4E22AQHfB4D-FgvN0w/feedshare-shrink_1280/B4EZSza_5iG0Ak-/0/1738176997329?e=1773273600&v=beta&t=pD2j5zucPIrjXO9394G_4lYRsuD-7sLOKFe0WHkSu94',
                'https://media.licdn.com/dms/image/v2/D4E22AQGoQy2AY10B4w/feedshare-shrink_1280/B4EZSza_6iGgAw-/0/1738176994736?e=1773273600&v=beta&t=XG-MBVJdUTFpGM3R9zA2gUIU8rY65mybE8rzq4wyukg',
                'https://media.licdn.com/dms/image/v2/D4E22AQGlGg61Q8cuRw/feedshare-shrink_1280/B4EZSza_65HoAo-/0/1738176995953?e=1773273600&v=beta&t=zF5WJCVmeXls2gYjX3sHvYy-RlR6WRZLPyov1Olaap8',
                'https://media.licdn.com/dms/image/v2/D4E22AQHAGZRsKspa3w/feedshare-shrink_2048_1536/B4EZSza_64G0As-/0/1738176994523?e=1773273600&v=beta&t=An7EJfVYlhpyYy904QMRICePFVvEQcjdEKlgVEVW0dI',
                'https://media.licdn.com/dms/image/v2/D4E22AQHfI5AJn-eEEg/feedshare-shrink_1280/B4EZSza_6.HgAo-/0/1738176998808?e=1773273600&v=beta&t=IJTjbKgZYaC6NT3Riwn2hkfGNwV5mvxlhTFC1mUEI7A'
            ],
            stats: {
                reactions: 18,
                comments: 4
            }
        }
    ];

    // Carousel state: tracks the current image index per activity
    carouselIndexes: number[] = this.featuredActivity.map(() => 0);

    getCarouselIndex(activityIndex: number): number {
        return this.carouselIndexes[activityIndex] ?? 0;
    }

    goToImage(activityIndex: number, imageIndex: number): void {
        this.carouselIndexes[activityIndex] = imageIndex;
    }

    prevImage(activityIndex: number): void {
        const total = this.featuredActivity[activityIndex].images.length;
        this.carouselIndexes[activityIndex] = (this.carouselIndexes[activityIndex] - 1 + total) % total;
    }

    nextImage(activityIndex: number): void {
        const total = this.featuredActivity[activityIndex].images.length;
        this.carouselIndexes[activityIndex] = (this.carouselIndexes[activityIndex] + 1) % total;
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
