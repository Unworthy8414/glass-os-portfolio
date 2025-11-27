# Glass OS Portfolio

A web-based operating system portfolio built with React, TypeScript, and Vite. This project mimics a desktop environment with window management, a dock, file system simulation, and functional apps, all styled with a modern "glassmorphism" aesthetic.

## Features

*   **Desktop Environment:**
    *   **Window Management:** Draggable, resizable, minimizable, and maximizeable windows.
    *   **Taskbar/Dock:** macOS-style dock with magnification effects and running app indicators.
    *   **Menubar:** Global menu bar with clock and system status.
    *   **Context Menus:** Right-click support for desktop, dock, and files.
*   **Applications:**
    *   **Finder:** File system explorer to browse projects and documents.
    *   **Terminal:** Fully functional terminal emulator with basic commands (`ls`, `cd`, `cat`, `python`).
    *   **Photo Viewer:** View images from the virtual file system.
    *   **PDF Viewer:** Read PDF documents (e.g., resumes) directly in the OS.
    *   **Text Editor:** Simple text editing capabilities.
    *   **Games:** Includes "Flappy Bird" clone and other mini-games.
*   **System:**
    *   **Virtual File System:** In-memory file system (using Zustand) that persists state during the session.
    *   **Python Support:** Run Python code directly in the browser via Pyodide.

## Tech Stack

*   **Frontend Framework:** [React](https://react.dev/) 19
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd glass-os-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Docker Support

This project includes full Docker support for easy containerization and deployment.

### Running Locally with Docker

You can spin up the production build of the application using Docker Compose without needing Node.js installed on your host machine.

```bash
docker-compose up -d --build
```

The application will be available at `http://localhost:80`.

## Deployment

This repository is configured with a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) to automatically deploy to a Digital Ocean Droplet.

### Automated Pipeline

Every push to the `main` branch triggers the following process:
1.  **Build:** GitHub Actions builds the Docker image.
2.  **Publish:** The image is pushed to the GitHub Container Registry (GHCR).
3.  **Deploy:** The workflow SSHs into your Digital Ocean Droplet, pulls the new image, and restarts the container.

### Setup Requirements

To enable this pipeline for your own fork or deployment, set these secrets in your GitHub Repository (**Settings > Secrets and variables > Actions**):

*   `DROPLET_HOST`: IP address of your server.
*   `DROPLET_USERNAME`: SSH username (e.g., `root`).
*   `SSH_PRIVATE_KEY`: Your private SSH key content.

*Note: If using a private repository, ensure your server is authenticated to pull from GHCR (see GitHub Packages documentation).*
