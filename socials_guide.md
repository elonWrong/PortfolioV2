# Socials Integration Guide

This guide explains how to replace the placeholder links and embeds in your portfolio with your real social media content.

## 1. Updating LinkedIn Post Embeds

To show your own LinkedIn posts on the site:

1.  **Find your LinkedIn post**: Go to the post you want to embed on LinkedIn.
2.  **Get the Embed link**:
    - Click the three dots (...) in the top right of the post.
    - Select **"Embed this post"**.
    - Click **"Copy code"**.
3.  **Extract the URL**: The copied code will look like this:
    ```html
    <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7154562545892012032" ...></iframe>
    ```
    Copy only the `src` URL: `https://www.linkedin.com/embed/feed/update/urn:li:share:7154562545892012032`.
4.  **Update `socials.ts`**:
    - Open `src/app/components/socials/socials.ts`.
    - Find the `featuredActivity` array.
    - Replace the `embedUrl` and `link` values with your real ones.

```typescript
// src/app/components/socials/socials.ts
featuredActivity = [
  {
    type: 'LinkedIn Post',
    title: 'Your Post Title',
    date: 'Feb 20, 2024',
    embedUrl: 'YOUR_COPIED_EMBED_URL',
    link: 'YOUR_DIRECT_POST_LINK'
  }
];
```

## 1b. Using Static Image Fallback (Recommended for Carousel Posts)

If LinkedIn does not support embedding for your post (e.g., carousel/image-heavy posts):

1.  **Get the image URL**: Right-click the image in your LinkedIn post and select **"Copy image address"**.
2.  **Update `socials.ts`**:
    - Use `imageUrl` instead of `embedUrl`.
    
```typescript
// src/app/components/socials/socials.ts
featuredActivity = [
  {
    type: 'LinkedIn Post',
    title: 'Recap of my Project',
    date: 'Jan 30, 2024',
    imageUrl: 'YOUR_IMAGE_ADDRESS_HERE',
    link: 'YOUR_DIRECT_POST_LINK'
  }
];
```

## 2. Adding your LinkedIn Profile Badge

To replace the placeholder badge with a real LinkedIn badge:

1.  **LinkedIn Public Profile Badge**: Go to [LinkedIn Public Profile Badge tools](https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile_header).
2.  **Follow LinkedIn's instructions** to generate the badge script.
3.  **Update `socials.html`**:
    - Open `src/app/components/socials/socials.html`.
    - Find the `<div id="linkedin-badge-container">`.
    - Paste your generated badge code inside that container.

## 3. GitHub Link Replacement

1.  Open `src/app/components/socials/socials.ts`.
2.  Update the `socials` array with your actual GitHub profile URL.
3.  Update the numbers in `socials.html` (Repositories, Contributions) to match your real stats.

## Technical Context

The `SocialsComponent` uses Angular's `DomSanitizer` to safely load the LinkedIn iframes. If you add new external resources, ensure they are also passed through the `getSafeUrl()` method in the component.
