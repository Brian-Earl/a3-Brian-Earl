
## Pirate Crew Generator
This project is a Pirate Crew generator used for generating and keeping track of members in a pirate crew
- Users create accounts to store thier pirate crew.
- Returning users can enter their username and password and press "Login" and they will be brought to their crew.
- New users can create an account by entering in their desired username and password and press the "Sign Up" button. If successful, the user will be brought to the pirate crew generator screen. 
- You generate a crew by selcting the crew member you wish to add's rank from a drop down menu and entering their name and year of birth into repective feilds and pressing the submit button.
- The current crew will is shown in a table on screen.
- Any crew member can be modified by entering thier name into the name feild, entering thier new rank and/or year of birth and then pressing the modify button.
- Any crew member can also be removed from the crew by entering their name into the name feild and pressing the delete button.


https://a3-brian-earl.glitch.me/

## Technical Achievements
- **Tech Achievement 1**: Implemented Express to handle the Post and Get requests 
- **Tech Achievement 2**: Implemented Jquery in the client to handle Get requests and manipulate HTML elements
- **Tech Achievement 3**: Use a database to store and load user's pirate crews
- **Tech Achievement 4**: Use bcrypt to generate a hash for passwords so they care not stored as plaintext 
- **Tech Achievement 5**: Implemented Sessions so multiple users can use the sight at the same time
- **Tech Achievement 6**: Implemented the following Express middlewares Body Parser, Sessions, Passport, Morgan, Serve Static, Serve Favicon



### Design/Evaluation Achievements
- **Design Achievement 1**: Implemented the Chota CSS framework and almost entirely style the HTML within the HTML files themselves, a CSS file is only used to change the color of certain elements
- **Design Achievement 2**: Disallowed invalid actions such as trying to delete or modifying a crew memvers who are not in the table or adding a crew member that is already in the table by using alerts telling the user that their input is invalid
