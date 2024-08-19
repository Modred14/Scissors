
# Scissors

**Brief is the new black.**

## Overview

Scissors is a URL-shortening platform that allows users to generate short, custom URLs and corresponding QR codes. The platform is designed for simplicity and efficiency, making it easy to share shortened links on social media or other channels. With basic analytics and customization options, Scissors aims to disrupt the URL-shortening industry by offering a user-friendly experience with powerful features.

## Features

- **URL Shortening**: Paste a long URL into Scissors, and a shorter URL will be generated automatically.
- **Custom URLs**: Users can create custom, branded URLs that reflect their brand or content.
- **QR Code Generation**: Generate QR codes for shortened URLs and download the images for promotional use.
- **Analytics**: Track the performance of your URLs with basic analytics, including click counts and source tracking.
- **Markdown Support**: Users can write content with markdown for better formatting and presentation.
- **Form Validation**: Ensure that all user inputs are properly validated before processing.

## Tech Stack

- **Frontend**: TypeScript, React, Tailwind
- **Backend & Database**: Firebase
- **Linting & Formatting**: ESLint, Prettier
- **QR Code Generation**: `qrcode.react`
- **Analytics**: Firebase Analytics
- **Testing**: Jest (2 unit tests, 3 component tests)

## Usage

### 1. Getting Started

- **Landing Page**: When you start the application, you'll be taken to the landing page (home page), where you'll see an overview of Scissor and its features.
- **Sign Up/Sign In**: You have the option to sign up or sign in to your account. If you choose not to sign in, you can still create links, but with limitations on the number of links you can generate.

### 2. Navigating the Dashboard

- **Access the Dashboard**: To use any of Scissor's services, navigate to the dashboard. Here, you'll find a list of available features and options for creating and managing your links.

### 3. Creating a New Link

- **Step 1**: On the dashboard, click the "Create New Link" button.
- **Step 2**: You will be directed to a page where you can input your long URL.
- **Step 3**: Optionally, you can enter your own custom link (if available).
- **Step 4**: Customize your QR code by choosing your desired color and logo.
- **Step 5**: Click the "Create" button, and Scissor will automatically generate a shortened URL for you.

### 4. Viewing Your Links

- **Links Page**: Navigate to the "Links" page to view all your saved links.
- **Dashboard Shortcut**: Alternatively, you can click the "View All Saved Links" button on the dashboard to access your links.

### 5. Viewing Link Analytics

- **Method 1**: Navigate to the "Links" page, click on the link title you want to analyze, and you'll be taken to the analytics page for that link.
- **Method 2**: On the "Links" page, click on the Menu (⋮) next to the link you want to analyze, and select "View Analytics" from the dropdown. This will take you to the analytics page for that link.

### 6. Viewing QR Codes

- **Method 1**: On the "Links" page, click on the Menu (⋮) next to the link for which you want to view the QR code, and select "View QR Code." This will take you to the QR code details page.
- **Method 2**: Navigate to the "Links" page, click on the link title you want to analyze, and you'll be taken to the Qr code page for that link.
  
### 7. Copying a Short Link or Custom Link

- **Step 1**: On the "Links" page, locate the link you want to copy.
- **Step 2**: Click the "Copy" button next to the short link or custom link, and the link will be copied to your clipboard.

### 8. Deleting a Link

- **Step 1**: On the "Links" page, click on the Menu (⋮) next to the link you want to delete.
- **Step 2**: Select "Delete" from the dropdown menu.
- **Step 3**: A confirmation prompt will appear. You can confirm to delete the link permanently or you can cancel if you changed your mind.

### 9. Editing a Link

- **Step 1**: On the "Links" page, click on the "Edit" button next to the link you want to modify.
- **Step 2**: Make the necessary changes to your link.
- **Step 3**: Save your changes.
- **Step 4**: A confirmation prompt will appear. You can confirm to update the link and will be updated accordingly or you can cancel if you changed your mind.

### 10. Viewing Full Link Details

- **Step 1**: Click on the main link in the "Links" page to view all details, including the original link, short URL, custom link (if available), QR code, and analytics.
- **Step 2**: On this page, you will also find options to edit, delete, and copy the link.

## Contributing

If you'd like to contribute to Scissors, please fork the repository and create a pull request. We welcome all contributions!

## License

This project was developed by **Favour Omirin** as the Capstone Project at **AltSchool Africa School of Engineering**.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


