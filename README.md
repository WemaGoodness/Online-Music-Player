# **Online-Music-Player**
![screenshot](spotify-web-player/src/images/Onlinemusicplayerlg.jpg)

## Introduction

**Online-Music-Player** is a full-fledged music streaming web application that integrates with the Spotify API. It allows users to authenticate using their Spotify account, view and manage their playlists, browse artists and albums, search for music, and control playback directly within the app. Built with React for the frontend and Express for the backend, this application offers a seamless experience for music lovers by leveraging Spotify's vast library of tracks.

Key features include:
- User authentication via Spotify.
- Real-time music playback with volume and seek control.
- Search functionality for tracks, albums, and artists.
- View and manage playlists.
- Save or remove tracks from user’s library.
- Explore new releases and related artists.
  
This project is a dynamic web application, meaning it handles backend operations such as Spotify API communication and serves the React frontend via Express.

## **Technologies Used**
- **React** (Frontend)
- **Node.js** and **Express.js** (Backend)
- **Spotify Web API** for music data
- **CSS** (Styling)

---

## **Installation**

Follow these steps to set up and run the project on your local machine:

### **1. Prerequisites**
- **Node.js** and **npm** installed (You can download from [here](https://nodejs.org/))
- A **Spotify Developer account** with client ID and client secret (Create an app at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)).

### **2. Clone the Repository**

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/WemaGoodness/Online-Music-Player.git
cd Online-Music-Player/spotify-web-player
```

### **3. Set Up Environment Variables**

Create a `.env` file in the server directory with the following details:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:5000/auth/callback
```

Make sure to replace the placeholders with your actual Spotify credentials.

### **4. Install Dependencies**

Run the following command to install all the required dependencies for both the frontend and backend:

```bash
npm install
```

### **5. Build the React App**

Before running the server, you need to build the React frontend:

```bash
npm run build
```

### **6. Run the Application**

Start the server in another terminal (located in the server folder) to serve both the backend API and the React frontend:

```bash
node index.js
```

By default, the app will run on **http://localhost:5000**. You can access the application from your browser at that address.

---

## **Usage**

Once the application is running:

1. **Login with Spotify**: When you first visit the app, you’ll need to authenticate with your Spotify account. This allows the app to access your playlists, liked songs, and control music playback.
   
2. **Browse and Play Music**: 
   - **Now Playing**: Control music playback, adjust volume, and seek through tracks.
   - **Search**: Search for tracks, albums, and artists using the search bar.
   - **Playlists**: View and manage your Spotify playlists.
   - **Tracks**: View and save/remove tracks in your library.
   - **Albums/Artists**: Explore albums and artists, view tracks, and discover related artists.

3. **Play Controls**: The app supports play/pause, previous/next track, volume control, and seeking to a specific point in the song.

---

## **Contributing**

Contributions are welcome! Here's how you can help:

1. **Fork the repository**.
2. **Create a feature branch** (`git checkout -b new-feature`).
3. **Commit your changes** (`git commit -m "Add new feature"`).
4. **Push to the branch** (`git push origin new-feature`).
5. **Open a Pull Request**.

Please ensure that your code follows the project's coding standards and includes appropriate documentation.

---

## **Related Projects**

Here are some related projects and references that might be helpful:

1. **Spotify Web API Documentation**: [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
2. **Building a Music Player in React (GeeksForGeeks)**: [Building a Music Player in React](https://www.geeksforgeeks.org/building-a-music-player-in-react/#:~:text=The%20%E2%80%9CMusic%20Player%E2%80%9D%20project%20is,users%20to%20enjoy%20their%20songs.)
3. **Create a Music Player using JavaScript (GeeksForGeeks)**: [Create a Music Player using JavaScript](https://www.geeksforgeeks.org/create-a-music-player-using-javascript/)
4. **YouTube Tutorial on Spotify Integration**: [YouTube Video](https://www.youtube.com/watch?v=2if5xSaZJlg)

---

## **Licensing**

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software in both personal and commercial projects, as long as you include the original license.

For more details, refer to the LICENSE file.

---

## **References**

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [YouTube - Spotify Web Player SDK Integration](https://www.youtube.com/watch?v=2if5xSaZJlg)
- [GeeksForGeeks - Building a Music Player in React](https://www.geeksforgeeks.org/building-a-music-player-in-react/#:~:text=The%20%E2%80%9CMusic%20Player%E2%80%9D%20project%20is,users%20to%20enjoy%20their%20songs.)
- [GeeksForGeeks - Create a Music Player using JavaScript](https://www.geeksforgeeks.org/create-a-music-player-using-javascript/)

---

## **Author**
LinkedIn: [Wema Goodness](https://www.linkedin.com/in/wema-goodness/)
X: [Wema Goodness](https://x.com/goodness_w18524)
