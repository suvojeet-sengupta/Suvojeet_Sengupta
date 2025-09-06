# Project: Suvojeet Sengupta's Personal Bio Website

## 1. Project Overview

This project is a modern, responsive, and feature-rich personal website for Suvojeet Sengupta, a singer, performer, and composer. It serves as a digital business card, providing visitors with biographical information, links to social media profiles, a showcase of his musical work, and a way to get in touch.

The website is composed of two main pages:
*   **Home Page (`index.html`):** A central landing page featuring a short bio, social media links, a music showcase, and a contact form.
*   **Music Page (`music.html`):** A dedicated gallery for showcasing music videos embedded from YouTube.

## 2. Key Features

*   **Fully Responsive Design:** The layout adapts seamlessly to all screen sizes, from mobile phones to desktop computers.
*   **Dark/Light Mode:** Users can toggle between a light and dark theme, and their preference is saved in the browser for future visits.
*   **Dynamic Content:**
    *   The music page automatically fetches and displays the official titles for all YouTube videos, reducing manual updates and ensuring accuracy.
    *   The contact form provides real-time feedback on submission status (sending, success, or error).
*   **Modern UI/UX:** The site uses smooth animations, gradients, and hover effects to create an engaging user experience.
*   **External Service Integration:**
    *   **YouTube:** for embedding and showcasing video content.
    *   **FormSubmit.co:** for handling contact form submissions without a backend server.
    *   **noembed.com:** as a proxy to fetch YouTube video metadata without requiring an API key.

## 3. Technologies Used

*   **Frontend:**
    *   **HTML5:** For the core structure and content of the web pages.
    *   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent UI development.
    *   **Custom CSS (`style.css`):** For animations and theme-related variable definitions.
    *   **JavaScript (ES6):** For all dynamic functionality, including:
        *   Theme switching.
        *   Asynchronous fetching of YouTube video titles.
        *   AJAX form submission for the contact form.
*   **External Libraries & Services:**
    *   **Google Fonts (Poppins):** For typography.
    *   **Font Awesome:** For social media and UI icons.
    *   **FormSubmit.co:** For the contact form backend.
    *   **noembed.com:** For fetching oEmbed data for YouTube videos.

## 4. File Structure

The project is organized into the following key files:

```
/
├── index.html        # The main home/landing page.
├── music.html        # The music gallery page.
├── style.css         # Custom CSS for animations and theming.
├── suvojeet.jpg      # The profile picture image.
├── project.md        # This file - detailed project documentation.
├── README.md         # Basic project information.
└── .gitignore        # Specifies files for Git to ignore.
```

## 5. How to View the Project

1.  Ensure all files are in the same directory.
2.  Open the `index.html` file in a modern web browser (like Chrome, Firefox, or Edge).
3.  Navigate between the "Home" and "Music" pages using the navigation links.
