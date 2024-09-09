
# HotelAppCMS

HotelAppCMS is a comprehensive Content Management System for managing hotel accommodations, reservations, and user profiles. Built with React, Vite, and various libraries, it provides a seamless experience for both administrators and users.

## Features

- **Accommodation Management**: Create, read, update, and delete hotel room details.
- **Reservation Management**: Manage bookings with CRUD operations.
- **User Management**: Handle user sign-in, registration, and profile management.
- **Favorites**: Mark rooms as favorites.
- **Responsive Design**: Ensure usability across various devices.

## File Structure

```
HotelAppCMS/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── redux/
│   ├── views/
│   └── App.jsx
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

To get started with HotelAppCMS, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Xoli-Nxiweni/HotelAppCMS.git
cd HotelAppCMS
```

### 2. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) installed. Then, install the required dependencies:

```bash
npm install
```

This command installs all necessary dependencies, including MUI, React Icons, and other packages listed in `package.json`.

### 3. Run the Development Server

To start the development server, use:

```bash
npm run dev
```

This runs the Vite development server and opens the application in your default browser.

### 4. Admin Credentials

To access the CMS, use the following credentials:

- **Email**: `HotAdmin@Hotel.com`
- **Password**: `HotAdmin123@321`

## Directory Details

- **`public/`**: Contains static assets and the `index.html` file.
- **`src/`**: Includes all source code files:
  - **`assets/`**: Static assets like images and fonts.
  - **`components/`**: Reusable React components.
  - **`redux/`**: Redux setup, including slices and store configuration.
  - **`views/`**: React components for different views/pages.
  - **`App.jsx`**: Main application component.

## Configuration

The application uses Vite for development and build processes. Configuration files are located in the root directory:

- **`vite.config.js`**: Vite configuration file.
- **`package.json`**: Contains project dependencies and scripts.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue if you have suggestions or find any bugs.

## License

