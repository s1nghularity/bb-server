# 🏦 Bad Bank Capstone Project

Bad Bank is a full-stack MERN application which allows users to create an account, login and logout, deposit and withdraw money, and delete their account. This mock site is intended to show working REST API CRUD functionality.

## 📚 API Documentation

GET

    Route: app.get('*')
    
- Function: Serves `index.html` file from build directory when any unmatched requests are made.

PUT

    Route: app.put('/updatebalance')
- Function: Updates user's balance using findOneAndUpdate function from MongoDB driver and sends response with updated user object.

POST

    Route: app.post('/login')
- Function: Authenticates user login, generates JSON Web Token (JWT) with user's email as payload, and sends it back to the client in the response body as the "data" field.

## 💻 Tech Used

- JWT + bcrypt enables user authentication and back-end encryption
- Bootstrap and Material UI for styling

## 🔗 Live Site

https://bb-client-r4iq.onrender.com/

## Future Changes

- Update user badge to reflect the *current* balance of the logged in user, as a refresh is required for the updated balance to display.
- Styling revision.
