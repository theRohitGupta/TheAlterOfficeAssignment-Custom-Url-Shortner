# TheAlterOfficeAssignment-Custom-Url-Shortner
This is the Assignment of The Alter office - custom url shortner

## Implementation Status ✅

All features have been successfully implemented and are fully functional:
- ✅ Google Sign-In Authentication
- ✅ URL Shortening with Custom Aliases
- ✅ Topic-based URL Grouping
- ✅ Comprehensive Analytics
- ✅ Rate Limiting
- ✅ Redis Caching
- ✅ Docker Containerization
- ✅ AWS EC2 Deployment

## Technology Stack

- **Backend:**
  - Node.js with Express.js
  - TypeScript
  - MongoDB for primary database
  - Redis for caching
  - Google OAuth2.0 for authentication
  - Express Rate Limiter
  - JWT for session management

- **DevOps & Deployment:**
  - Docker & Docker Compose
  - AWS EC2 for hosting

- **Monitoring & Analytics:**
  - User-Agent parsing
  - Geolocation tracking
  - Custom analytics engine

## Deployment Details

The application is successfully deployed on AWS EC2:
- Instance Type: t2.micro
- Region: ap-south-1 (Mumbai)
- OS: Ubuntu 20.04 LTS
- Docker containers for Node.js app and Redis
- NGINX configured for reverse proxy
- SSL/TLS encryption enabled

Live Demo: http://3.110.108.163.nip.io:4000/
GitHub Repository: https://github.com/theRohitGupta/TheAlterOfficeAssignment-Custom-Url-Shortner

## Task Brief

The objective is to design and implement a scalable Custom URL Shortener API that includes advanced analytics, user authentication via Google Sign-In, and rate limiting. This system will allow users to create short URLs that simplify the sharing of long, complex URLs across various platforms, making it easier for users to distribute links in a concise format.

It requires the implementation of unique features such as grouping links under specific topics (e.g., acquisition, activation, retention) and providing detailed analytics for both individual and overall URLs. The solution should be dockerized to facilitate deployment on a cloud hosting service, ensuring scalability and efficient management.

Note: These tasks typically take anywhere from 12 hours to a couple of days, depending on your skill level. You can choose to start and complete the task anytime within the provided 9-day window.

## Task Details

### 1. User Authentication

Implement user registration and login endpoints to allow users to create accounts and authenticate themselves using Google Sign-In only, enhancing user experience.

### 2. Create Short URL API

- **Endpoint:** `/api/shorten`
- **Method:** `POST`
- **Description:** Create a new short URL to facilitate easy sharing of long URLs, which can often be cumbersome and difficult to manage. This API will generate a concise link that redirects to the original URL, making it ideal for social media, emails, and other communication channels.
- **Request Body:**
    - `longUrl` (string): The original URL to be shortened.
    - `customAlias` (string, optional): A custom alias for the short URL (if not provided, generate a unique one).
    - `topic` (string, optional): A category under which the short URL is grouped (e.g., acquisition, activation, retention).
- **Response:**
    - `shortUrl` (string): The generated short URL.
    - `createdAt` (datetime): The timestamp indicating when the short URL was created.
- **Rate Limiting:** Implement rate limiting to restrict the number of short URLs a user can create within a specified time frame.

### 3. Redirect Short URL API

- **Endpoint:** `/api/shorten/{alias}`
- **Method:** `GET`
- **Description:** Redirect to the original URL based on the short URL alias, enabling seamless access to the long URL while tracking user engagement.
- **Response:** Redirect the user to the original long URL.
- **Analytics Tracking:** Log each redirect event, including timestamp, user agent, IP address, and geolocation data for analytics.

### 4. Get URL Analytics API

- **Endpoint:** `/api/analytics/{alias}`
- **Method:** `GET`
- **Description:** Retrieve detailed analytics for a specific short URL, providing insights into its performance, including total clicks and unique audience interactions.
- **Response:**
    - `totalClicks` (number): Total number of times the short URL has been accessed.
    - `uniqueClicks` (number): Number of unique users who accessed the short URL.
    - `clicksByDate` (array): An array of objects containing date (consider recent 7 days) and click count.
    - `osType` (array): An array of objects containing:
        - `osName` (string): The name of the operating system (e.g., Windows, macOS, Linux, iOS, Android).
        - `uniqueClicks` (number): Number of unique clicks for that OS.
        - `uniqueUsers` (number): Number of unique users for that OS.
    - `deviceType` (array): An array of objects containing:
        - `deviceName` (string): The type of device used (e.g., mobile, desktop).
        - `uniqueClicks` (number): Number of unique clicks for that device type.
        - `uniqueUsers` (number): Number of unique users for that device type.

### 5. Get Topic-Based Analytics API

- **Endpoint:** `/api/analytics/topic/{topic}`
- **Method:** `GET`
- **Description:** Retrieve analytics for all short URLs grouped under a specific topic, allowing users to assess the performance of their links based on categories.
- **Response:**
    - `totalClicks` (number): Total number of clicks across all URLs in the specified topic.
    - `uniqueClicks` (number): Number of unique users who accessed URLs in the specified topic.
    - `clicksByDate` (array): An array of objects containing date and total click counts for all URLs under topic.
    - `urls` (array): An array of URLs under the specified topic, each containing:
        - `shortUrl` (string): The generated short URL.
        - `totalClicks` (number): Total number of clicks for the short URL.
        - `uniqueClicks` (number): Number of unique users who accessed the short URL.

### 6. Get Overall Analytics API

- **Endpoint:** `/api/analytics/overall`
- **Method:** `GET`
- **Description:** Retrieve overall analytics for all short URLs created by the authenticated user, providing a comprehensive view of their link performance.
- **Response:**
    - `totalUrls` (number): Total number of short URLs created by the user.
    - `totalClicks` (number): Total number of clicks across all URLs created by the user.
    - `uniqueClicks` (number): Total number of unique users who accessed any of the user's short URLs.
    - `clicksByDate` (array): An array of objects containing date and total click counts for all URLs.
    - `osType` (array): An array of objects containing:
        - `osName` (string): The name of the operating system (e.g., Windows, macOS, Linux, iOS, Android).
        - `uniqueClicks` (number): Number of unique clicks for that OS.
        - `uniqueUsers` (number): Number of unique users for that OS.
    - `deviceType` (array): An array of objects containing:
        - `deviceName` (string): The type of device used (e.g., mobile, desktop).
        - `uniqueClicks` (number): Number of unique clicks for that device type.
        - `uniqueUsers` (number): Number of unique users for that device type.

### 7. Caching

Implement caching using Redis to store both short and long URLs, improving the performance of the API by reducing database load. Cache data wherever necessary, such as when retrieving URL analytics or redirecting short URLs, to ensure quick access and response times.

The solution is thoroughly tested and dockerized for cloud deployment. It is live and ready to use:

GitHub Repository: https://github.com/theRohitGupta/TheAlterOfficeAssignment-Custom-Url-Shortner
Live Link: http://3.110.108.163.nip.io:4000/
Feel free to review the implementation and test the live version.

