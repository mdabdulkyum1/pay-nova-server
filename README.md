## Pay Nova Server
# Mobile Financial Service (MFS) API

This is the backend server for a Mobile Financial Service (MFS) application similar to bKash or Nagad. It provides authentication, user roles (User, Agent, Admin), and financial transactions like Send Money, Cash-In, and Cash-Out.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt for password/PIN hashing

## Installation

1. Clone the repository:
   bash
   git clone <repository-url>
   cd mfs-server
   
2. Install dependencies:
   bash
   npm install
   
3. Set up environment variables in a .env file:
   env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   
4. Start the server:
   bash
   npm start
   

## API Endpoints

### Authentication
- *Register User/Agent:* POST /api/auth/register
- *Login:* POST /api/auth/login

### User Operations
- *Send Money:* POST /api/transaction/send-money
- *Cash-In:* POST /api/transaction/cash-in
- *Cash-Out:* POST /api/transaction/cash-out
- *Balance Inquiry:* GET /api/user/balance

### Agent Operations
- *Request Approval:* POST /api/agent/request-approval
- *Cash Request:* POST /api/agent/cash-request
- *Withdraw Request:* POST /api/agent/withdraw-request

### Admin Operations
- *Approve Agent:* POST /api/admin/approve-agent
- *Manage Users:* GET /api/admin/users
- *Block User:* POST /api/admin/block-user
- *Monitor System Funds:* GET /api/admin/system-funds

## Security Measures
- JWT-based authentication
- bcrypt for PIN hashing
- Role-based access control
- Device restriction (one login per user at a time)

## Database Models

### User Schema
- Name, Mobile Number, Email, NID
- Role: User, Agent, Admin
- Balance, Transaction History

### Transaction Schema
- Sender, Receiver
- Amount, Transaction ID
- Transaction Type (Send Money, Cash-In, Cash-Out)

## Notes
- Each transaction generates a unique transaction ID stored in the database.
- Admin earns revenue from Send Money, Cash-Out, and money operations.
- Agents must be verified before conducting transactions.

## License
This project is for assessment purposes only.