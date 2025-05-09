Task Tracker Application
The Task Tracker application allows users to create, view, update, and delete tasks. It includes secure user authentication using JWT and provides a full-stack solution with a Node.js/Express backend and a React frontend. The backend is served at http://localhost:5000, while the frontend runs at http://localhost:3000.
Table of Contents:

    - Installation
    - Running the Application
    - Environment Variables
    - Usage
    - Contact
    
Installation

    Clone the Repository

    1. Get the repository:
       To begin, clone the repository to your local machine by using the `git clone` command. Open a terminal/command prompt, navigate to the directory where you want to store the project, and run the following command:

       ```bash
       git clone https://github.com/yourusername/task-tracker.git
       ```

       Replace `yourusername` with your GitHub username or the correct repository link.

    2. Navigate to the project directory:
       Once the repository is cloned, navigate to the project folder. You should see two main directories: `task-tracker-frontend` (for the React frontend) and `task-tracker-backend` (for the Node.js/Express backend).

       ```bash
       cd task-tracker
       ```

  
Backend Setup

    1. Navigate to the backend directory:
       Change your working directory to `task-tracker-backend`:

       ```bash
       cd task-tracker-backend
       ```

    2. Install backend dependencies:
       The backend is built with Node.js and Express. To install the necessary dependencies, run:

       ```bash
       npm install
       ```

       This will install all the packages listed in the `package.json` file.

    Frontend Setup

    1. Navigate to the frontend directory:
       Once the backend is set up, navigate to the frontend directory:

       ```bash
       cd ../task-tracker-frontend
       ```

    2. Install frontend dependencies:
       The frontend is built with React. To install the necessary dependencies, run:

       ```bash
       npm install
       ```

       This will install all the packages listed in the `package.json` file.
    

Running the Application

    ### Backend

    1. Start the backend server:
       To run the backend, execute the following commands:

       ```bash
       cd task-tracker-backend
       npm start
       ```

       The backend will start on `http://localhost:5000`. You should see a message in the terminal indicating the server is running.

    Frontend

    1. **Start the frontend server**:
       In a separate terminal, navigate to the `task-tracker-frontend` directory and run the following commands:

       ```bash
       cd task-tracker-frontend
       npm start
       ```

       The frontend will start on `http://localhost:3000`. Open your browser and visit this URL to access the application.

       The React app will automatically open in your default web browser once the server starts.
    
Environment Variables

    ### Backend
    To configure the backend, you need to set up the following environment variables. Create a `.env` file in the `task-tracker-backend` directory and add these values:

    ```env
    MONGO_URI=mongodb://localhost:27017/task-tracker
    JWT_SECRET=your-jwt-secret-key
    PORT=5000
    ```

    - MONGO_URI: The MongoDB connection string to connect to your local MongoDB instance (`task-tracker` is the database name).
    - JWT_SECRET: A secret key used for signing JWT tokens. You can use any string value, but ensure it's secure and unique.
    - PORT: The port on which the backend server will run (default is `5000`).

    Frontend

    In the `task-tracker-frontend` directory, create a `.env` file and add the following environment variable:

    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000
    ```

    This allows the frontend to communicate with the backend.
    
Usage

    Authentication

    1. Registration: Users can create a new account using their email and password.
    2. Login: Users can log in to the application, which will generate a JWT token that will be stored in the browser's local storage for authentication.
    3. Task Management: Once logged in, users can manage their tasks. They can create new tasks, update existing ones, mark tasks as completed, and delete tasks.

    Task CRUD Operations

    - Create a task: Users can enter the title, description, and status of a task to create it.
    - View tasks: Users can see a list of tasks with the title, description, status, and project association.
    - Update a task: Users can edit the title, description, and status of existing tasks.
    - Delete a task: Users can delete tasks they no longer need.

    Filtering Tasks

    Users can filter tasks by:
    - **Status**: Pending, In Progress, or Completed.
    - **Project**: Users can select a project to view tasks associated with it.
    

