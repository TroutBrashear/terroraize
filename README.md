# TERRORAIZE: An AI story drafter

Access the BYOK web application at https://terroraize.vercel.app/

## Terroraize permits users to request AI written scenes using user-defined locations and characters as building blocks. It offers user-defined character memory and goals, adjustable prompts, and an AI director feature that suggests the next scenes.


## Features

Secure Full-Stack Architecture: To ensure user privacy and security in a "Bring Your Own Key" (BYOK) model, the application leverages a full-stack design. The React SPA frontend communicates with a dedicated Vercel Serverless backend, ensuring that no sensitive API keys are ever exposed on the client-side.

Advanced State Management: Using a database-like structure in Zustand state, the application supports large sets of characters, locations, and scenes. Lookup of specific entities is achieved in O(1), permitting quick construction of prompts and display to users.

AI Provider Variety: The application supports a variety of common AI providers through an adaptor pattern. This subsequently allows quick integration of new providers on the developers' end.

AI Director: Advanced AI models can be prompted to provide directions to set up future scenes. The AI Director leverages a robust sanitization layer to parse structured JSON data from the LLM, allowing for complex, programmatic scene suggestions. The system is designed to gracefully handle malformed AI responses.


## Getting Started

To run this project locally, follow these steps:

1.  **Prerequisites:** Ensure you have Node.js (v18 or later) and `npm` installed.
2.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/terroraize.git
    cd terroraize
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    The project uses the Vercel CLI for local development to emulate the serverless environment.
    ```bash
    npm install -g vercel
    vercel link
    vercel dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

*   **Frontend:** React, Vite, CSS Modules
*   **State Management:** Zustand
*   **Backend:** Vercel Serverless Functions (Node.js)
*   **UI / UX:** `dnd-kit` for Drag and Drop
*   **Testing:** Vitest
*   **Deployment:** Vercel (with CI/CD)
