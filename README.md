# Suvojeet Sengupta - Personal Portfolio

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About
This is the source code for the personal portfolio website of Suvojeet Sengupta, a Musician, Developer, and Content Creator. The website is built with React and showcases his work, blog, and music.

## Features
*   **Responsive Design:** The website is fully responsive and works seamlessly across various devices, from desktops to mobile phones.
*   **Blog:** A dynamic blog section featuring articles fetched from Contentful CMS, allowing for easy content management and updates.
*   **Music:** A dedicated page to showcase musical work, with embedded YouTube videos, categorized for better organization, and a detailed description viewer.
*   **About Me:** A comprehensive section providing a brief biography, professional journey, and links to social media profiles.
*   **Automated Updates:** The music section is automatically updated with new videos from a YouTube channel via a GitHub Action, ensuring fresh content.

## Tech Stack
*   **Frontend:** [React](https://reactjs.org/) (JavaScript library for building user interfaces), [React Router](https://reactrouter.com/) (for declarative routing), [Tailwind CSS](https://tailwindcss.com/) (a utility-first CSS framework for rapid UI development).
*   **CMS:** [Contentful](https://www.contentful.com/) (a headless CMS for managing and delivering content).
*   **Deployment:** [GitHub Pages](https://pages.github.com/) (for hosting the static website).
*   **CI/CD:** [GitHub Actions](https://github.com/features/actions) (for continuous integration and continuous deployment, including automated content updates).

## Getting Started

### Prerequisites
Before you begin, ensure you have met the following requirements:
*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or Yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/suvojit213/Suvojeet_Sengupta.git
    cd Suvojeet_Sengupta
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Set up environment variables:
    Create a `.env` file in the root directory and add your Contentful API keys:
    ```
    REACT_APP_CONTENTFUL_SPACE_ID=YOUR_SPACE_ID
    REACT_APP_CONTENTFUL_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
    ```

### Running the Application
To run the application in development mode:
```bash
npm start
# or
yarn start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts
In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run deploy`
Deploys the app to GitHub Pages.

## Deployment
This project is automatically deployed to GitHub Pages whenever a push is made to the `main` branch. The deployment is handled by the `.github/workflows/deploy.yml` workflow.

## Project Structure
```
.
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images and other media
│   ├── components/     # Reusable React components
│   ├── data/           # Local data files (e.g., videos.json)
│   └── ...             # Other source files (App.js, index.js, etc.)
├── .github/            # GitHub Actions workflows
├── package.json        # Project dependencies and scripts
├── README.md           # Project README file
└── ...                 # Other configuration files
```

## Contributing
Currently, this is a personal portfolio project and is not actively seeking external contributions. However, if you find any issues or have suggestions, please feel free to open an issue.

## License
This project is licensed under a custom license. Please see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or collaborations, please reach out to Suvojeet Sengupta via:
*   **Email:** suvojitsengupta21@gmail.com

*   **GitHub:** https://github.com/suvojit213