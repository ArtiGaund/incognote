# IncogNote

IncogNote is a web application that allows users to send and receive anonymous messages. It provides a secure and user-friendly platform for anonymous feedback and communication.

## Features

- **Anonymous Messaging**: Users can send and receive anonymous messages.
- **User Authentication**: Secure sign-up, sign-in, and account verification using email-based OTP.
- **Message Management**: Users can view, delete, and manage their messages.
- **Customizable Settings**: Users can toggle whether they accept messages or not.
- **Unique Profile Links**: Each user gets a unique profile link to share for receiving messages.
- **Responsive Design**: Fully responsive UI built with TailwindCSS.

## Tech Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Next.js API routes, Mongoose, MongoDB
- **Authentication**: NextAuth.js with credentials provider
- **Validation**: Zod for schema validation
- **Email Service**: Resend for sending verification emails
- **State Management**: React Hook Form for form handling
- **Carousel**: Embla Carousel for displaying messages

## Project Structure

The project is structured as follows:       

```
.
├── README.md   
├── components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── MessageCard.tsx
│   ├── Separator.tsx
│   └── Switch.tsx
├── lib
│   ├── auth.ts
│   ├── messages.ts
│   ├── resend.ts
│   └── utils.ts
├── pages
│   ├── api
│   │   ├── accept-messages.ts
│   │   ├── delete-message.ts
│   │   ├── get-messages.ts
│   │   └── send-message.ts
│   ├── dashboard
│   │   └── page.tsx
│   └── index.tsx
├── public
│   └── favicon.ico
├── src
│   ├── app
│   │   └── globals.css
│   └── components.json
└── tsconfig.json
```



## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/incognote.git
   cd incognote
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

Create a .env file in the root directory and add the following variables:
MONGODB_URI=<your-mongodb-uri>
NEXTAUTH_SECRET=<your-nextauth-secret>
RESEND_API_KEY=<your-resend-api-key>

4. Start the development server:

   ```bash
   npm run dev
   ```


The application will be available at http://localhost:3000.


Scripts
* npm run dev: Start the development server.
* npm run build: Build the application for production.
* npm run start: Start the production server.
* npm run lint: Run ESLint to check for code quality issues.


Key Files
* Authentication: src/app/api/auth/[...nextauth]/options.ts
* Database Connection: src/lib/dbConnect.ts
* Email Sending: src/helpers/sendVerificationEmail.ts
* Message Management: src/app/api/get-messages/route.ts, src/app/api/send-message/route.ts
* Validation Schemas: src/schemas

Features in Detail

Authentication
* Sign-Up: Users can create an account with a username, email, and password. A verification email is sent to complete the registration.
* Sign-In: Users can log in using their email or username and password.
* Account Verification: Users must verify their account using a 6-digit OTP sent to their email.

Dashboard
* Message Management: Users can view, delete, and refresh their messages.
* Toggle Message Acceptance: Users can enable or disable the ability to receive messages.
* Profile Link: Users can copy their unique profile link to share with others.

Anonymous Messaging
* Send Messages: Anyone can send anonymous messages to a user using their unique profile link.
* Message Validation: Messages are validated to ensure they meet length requirements.


