# Rifolks Drifts - Modern E-commerce Platform

A modern, responsive e-commerce website for selling fashion wear for men and
women. Built with React.js, Node.js, and MongoDB.

## Features

-   🛍️ Modern and responsive design
-   👥 User authentication and authorization
-   🛒 Shopping cart functionality
-   🔍 Product filtering and search
-   📱 Mobile-friendly interface
-   💳 Secure checkout process
-   👤 User profile management
-   📦 Order tracking

## Tech Stack

-   Frontend: React.js, Vite, Tailwind CSS
-   Backend: Node.js, Express
-   Database: MongoDB
-   Authentication: JWT

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/rifolks-drifts.git
cd rifolks-drifts
```

2. Install dependencies:

```bash
npm run install-all
```

3. Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at:

-   Frontend: http://localhost:5173
-   Backend: http://localhost:5000

## Project Structure

```
rifolks-drifts/
├── frontend/           # React frontend application
├── backend/           # Node.js backend application
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── middleware/   # Custom middleware
└── public/           # Static files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for
details.
