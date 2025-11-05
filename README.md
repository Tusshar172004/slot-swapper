SlotSwapper — Peer-to-Peer Time Slot Swapping App

SlotSwapper is a full-stack web application that allows users to create calendar events, mark them as swappable, and exchange time slots with other users.
It’s designed to test end-to-end web development skills — from database modeling and REST APIs to state management and UI/UX with React. 

Overview

Core Idea:
Each user has a calendar with events (e.g., meetings, focus blocks).
They can mark a slot as SWAPPABLE, which becomes visible in the marketplace.
Other users can request to swap one of their own swappable slots.
If accepted, both users’ calendars automatically update — swapping event ownership. 

Design Choices

Frontend: React + Tailwind CSS for a modern, clean, and responsive UI.
Backend: Node.js + Express.js + MongoDB with Mongoose for fast API development.
Authentication: JWT (JSON Web Token) based system for protected routes.
State Management: Managed at component level using React hooks.
Data Model: Three key collections — Users, Events, SwapRequests.
UI Principles: Minimal design, high usability, clear actions (Create, Swap, Accept/Reject).

Setup & Run Locally
git clone https://github.com/<your-username>/slot-swapper.git
cd slot-swapper

Backend Setup
cd backend
npm install

Create .env file in backend/:
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

npm run dev

Frontend Setup
cd frontend
npm install

Create .env file in frontend/:
VITE_API_URL=http://localhost:5000/api
npm run dev

Example Workflow

1️⃣ User A creates “Team Meeting” and marks it SWAPPABLE
2️⃣ User B creates “Focus Block” and marks it SWAPPABLE
3️⃣ User A opens the Marketplace → sees User B’s slot → sends swap request
4️⃣ User B opens “Requests” → sees incoming request → Accepts
5️⃣ The system updates both calendars:

A now owns “Focus Block”

B now owns “Team Meeting” 

Assumptions & Challenges
Assumptions

Each event is owned by exactly one user.

Only “SWAPPABLE” events appear in the marketplace.

Once an event is pending a swap, it’s locked (SWAP_PENDING) until resolved.

Challenges

Handling atomic ownership swapping in MongoDB — solved using transactions.

Designing intuitive UI for multi-state swaps (Pending, Accepted, Rejected).

Managing synchronous updates between users’ calendars — partially solved with state refresh.

API Endpoints

The SlotSwapper backend provides a clean and well-structured REST API built with Express.js. All protected routes use JWT-based authentication, requiring clients to send a valid token in the request header as
Authorization: Bearer <your_jwt_token>.

Authentication Endpoints:
Users can register a new account using POST /api/auth/signup and log in using POST /api/auth/login. Both endpoints handle credential validation and return a JWT token with user data upon success.

Event Management Endpoints:
Users can manage their personal events through the following routes:

GET /api/events/me retrieves all events created by the logged-in user.

POST /api/events allows users to create new events by providing a title, start time, and end time.

PATCH /api/events/:id updates event details or status (e.g., marking an event as SWAPPABLE).

DELETE /api/events/:id removes an existing event from the user’s calendar.

GET /api/events/swappable fetches all SWAPPABLE events from other users to display in the marketplace.

Swap Management Endpoints:
Swaps form the core of SlotSwapper’s functionality. Users can send, receive, and respond to swap requests through:

POST /api/swap/request to send a swap request by passing mySlotId and theirSlotId.

POST /api/swap/response/:requestId to accept or reject a swap request using { accept: true/false }.

GET /api/swap/incoming to view all swap requests received by the current user.

GET /api/swap/outgoing to list all swap requests the user has sent.

These endpoints collectively support a complete, secure, and interactive event-swapping workflow between authenticated users.

Core Features

SlotSwapper enables users to create, manage, and exchange calendar events in a seamless and interactive way.
The project implements secure JWT-based authentication, ensuring that all personal data and user actions are protected. Users can create events, mark them as SWAPPABLE, and make them visible to others in the marketplace, where swaps can be requested.

The Swap Request System allows users to exchange busy slots, and once accepted, both users’ calendars update automatically — ensuring that each event’s ownership and status reflect the correct user.
The system uses MongoDB transactions to handle these ownership changes safely, ensuring atomicity and data integrity.

The frontend is built with React and Tailwind CSS, delivering a clean, responsive, and user-friendly interface. Pages such as Dashboard, Marketplace, and Requests provide clear visibility into user activity, pending swaps, and accepted exchanges.
Additionally, protected routes ensure only authenticated users can access key pages, while the UI dynamically updates without needing a page refresh.

Overall, SlotSwapper provides a complete, end-to-end user experience that combines robust backend logic with modern UI design principles.


Tech Stack

SlotSwapper is developed using the MERN stack (MongoDB, Express.js, React, and Node.js) to ensure a scalable, maintainable, and high-performance web application.

The frontend is built with React.js, powered by Vite for fast development and Tailwind CSS for modern, responsive styling.
The backend runs on Node.js with Express.js, exposing a set of secure RESTful APIs that handle user authentication, event management, and swap logic.
Data persistence is achieved through MongoDB, managed via Mongoose ORM, providing schema validation and support for advanced queries.

Authentication is implemented using JWT (JSON Web Tokens) for stateless session handling, ensuring that only authorized users can access protected resources.
For API testing and verification, tools like Postman can be used to send requests and inspect responses.

Together, this stack ensures SlotSwapper runs efficiently across the entire development cycle — from data modeling and business logic to dynamic front-end interactivity and UI presentation.

