# Suvojeet Sengupta - Personal Portfolio

This is the source code for the personal portfolio website of Suvojeet Sengupta, a Musician, Developer, and Content Creator. The website is built with React and showcases his work, blog, and music.

## Features

*   **Responsive Design:** The website is fully responsive and works on all devices.
*   **Blog:** A blog section with articles fetched from Contentful CMS.
*   **Music:** A dedicated page to showcase musical work, with embedded videos.
*   **About Me:** A section with a brief bio and social media links.
*   **Automated Updates:** The music section is automatically updated with new videos from a YouTube channel via a GitHub Action.

## Tech Stack

*   **Frontend:** [React](https://reactjs.org/), [React Router](https://reactrouter.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **CMS:** [Contentful](https://www.contentful.com/) for blog content.
*   **Deployment:** [GitHub Pages](https://pages.github.com/)
*   **CI/CD:** [GitHub Actions](https://github.com/features/actions) for continuous deployment and content updates.

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

## License

This project is licensed under a private license. See the [LICENSE](LICENSE) file for details.