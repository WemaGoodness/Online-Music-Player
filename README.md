# Online Music Player

## Overview

The Online Music Player is a web application that allows users to log in with their Spotify account and view their profile information along with their top tracks. This application leverages the Spotify Web API to fetch user data and provides an interactive dashboard to display music preferences.

## Features

- **User  Authentication**: Secure login using Spotify's OAuth 2.0.
- **User  Profile**: Display user information such as name, email, and profile picture.
- **Top Tracks**: Fetch and display the user's top tracks from Spotify.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: 
  - React.js
  - React Router
  - Axios for API requests
  - CSS for styling

- **Backend**: 
  - Node.js
  - Express.js
  - Axios for server-side API requests
  - dotenv for environment variable management

- **API**: 
  - Spotify Web API

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm (v6 or above)
- A Spotify Developer Account to create an application and obtain client credentials.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/online-music-player.git
   cd online-music-player
   ```

2. **Install backend dependencies**:
   Navigate to the backend folder and install the dependencies:
   ```bash
   cd backend
   npm install
   ```
3. **Set up environment variables**:
   Create a `.env` file in the backend directory and add your Spotify credentials:

   ```plaintext
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```
4. **Build the frontend**:
   Navigate to the frontend folder and install the dependencies:

   ```bash
   cd ../frontend
   npm install
   npm run build
   ```
5. **Run the backend server**
   Navigate back to the backend directory and start the server:

   ```bash
   cd ../backend
   node index.js
   ```
## Access the application
Open your browser and navigate to `http://localhost:5000` to view the application.

## Usage
- Click on the "Login with Spotify" button to authenticate.
- After successful login, you will be redirected to the dashboard displaying your profile information and top tracks.

## Contributing
Contributions are welcome! If you have suggestions for improvements or want to report a bug, please create an issue or submit a pull request.

### Steps to Contribute
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- **Spotify Developer** for providing the API.
- **React** for building the frontend.
- **Node.js** and **Express** for the backend server.
