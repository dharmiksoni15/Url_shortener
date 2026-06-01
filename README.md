# 🔗 URL Shortener

A simple URL Shortener application built using Node.js core modules without Express.js.

The application allows users to convert long URLs into short, easy-to-share links and automatically redirects users to the original URL when a short link is visited.

---

## 🚀 Features

* Create short URLs from long URLs
* Custom shortcode support
* Random shortcode generation using Node.js Crypto module
* Automatic URL redirection
* Store links in a JSON file
* Display all generated short URLs
* Simple and clean user interface

---

## 🛠️ Tech Stack

### Backend

* Node.js
* HTTP Module
* File System (fs/promises)
* Crypto Module
* Path Module

### Frontend

* HTML
* CSS
* JavaScript

### Storage

* JSON File

---

## 📂 Project Structure

```text
url-shortener/
│
├── data/
│   └── links.json
│
├── public/
│   ├── index.html
│   └── style.css
│
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd url-shortener
```

### Install Dependencies

```bash
npm install
```

### Run Application

```bash
node app.js
```

Server will start on:

```text
http://localhost:3002
```

---

## 📖 How It Works

1. User enters a long URL.
2. User can optionally provide a custom shortcode.
3. The application stores the mapping in `links.json`.
4. A shortened URL is generated.
5. Visiting the shortened URL redirects the user to the original destination.

Example:

```text
Original URL:
https://www.google.com

Short URL:
http://localhost:3002/google
```

---

## 🎯 Learning Outcomes

This project was built to practice:

* Node.js HTTP Server
* Routing without Express.js
* Handling GET and POST requests
* Working with File System APIs
* JSON data storage
* URL redirection
* Async/Await
* Frontend and Backend integration

---

## 🔮 Future Improvements

* MongoDB Integration
* Click Analytics
* QR Code Generation
* URL Expiration
* Authentication System
* Copy-to-Clipboard Feature
* Deployment Support

---

## 👨‍💻 Author

Dharmik Soni

Built while learning Node.js fundamentals and backend development.
"""
