# 🏦 Bad Bank Capstone Project

Bad Bank is a full-stack MERN application which allows users to create an account, login and logout, deposit and withdraw money, and delete their account. This mock site is intended to show working REST API CRUD functionality.

## 📚 API Documentation

GET

    Route: `app.get('*')`
    
- Function: Serves `index.html` file from build directory when any unmatched requests are made.

PUT

    Route: `app.put('/updatebalance')`
- Function: Updates user's balance using `findOneAndUpdate` function from MongoDB driver and sends response with updated user object.

POST

    Route: app.post('/register')

- Function: Registers a new user with given id, name, email, password and balance. The password is encrypted with bcrypt package before storing it to the database. The function checks if the email is already registered. If not, it creates a new user and sends response with status 'User succesfully created!' and the created user object. If the email is already registered, it sends response with an error message.

        Route: `app.post('/login')`
- Function: Authenticates user login, checks if the given email and password match with the database record, generates JSON Web Token (JWT) with user's email as payload, and sends it back to the client in the response body as the "data" field.

        Route: `app.post('/userData')`

- Function: Verifies a given JWT, retrieves the email from the payload, and fetches the user data from the database with the retrieved email. Sends response with status 'ok' and the user data if the JWT is valid, otherwise sends response with status 'error' and error message.

DELETE


    Route: `app.delete('/delete/:id')`

- Function: Deletes the user with the given id and sends response with status 'User succesfully deleted!' and the deleted user object.

MIDDLEWARE


    Function: findUserMiddleware

    Parameters: `req`, `res`, `next`

- Function: Finds the user with the given id from the database and sets it to the req.user object. If an error occurs while finding the user, it sends the response with status code 500 and the error message. It is used as a middleware function for `app.put('/deposit/:id')` and `app.put('/update/:id')`.

## 💻 Tech Used

- JWT + bcrypt enables user authentication and back-end encryption
- Bootstrap and Material UI for styling

## 🔗 Live Site

https://bb-client-r4iq.onrender.com/

<iframe src="https://www.youtube.com/embed/Uqe_AY4UvJY" width="560" height="315" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Future Changes

- Update user badge to reflect the *current* balance of the logged in user, as a refresh is required for the updated balance to display.
- Styling revision.
