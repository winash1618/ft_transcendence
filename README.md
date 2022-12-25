# ft_transcendence
This project is about creating a website for the mighty Pong contest!

# Tools:
## NestJs:
- NestJS is a framework for building efficient, scalable Node.js server-side applications. It is built on top of TypeScript and uses the Express web framework under the hood.
- One of the key features of NestJS is its modular design, which makes it easy to organize and maintain a large codebase. NestJS applications are built using a modular approach, with each module containing a specific feature or set of features. This modular structure makes it easier to reuse code, manage dependencies, and test individual components of the application.
- NestJS also includes a variety of built-in features that can be used to build server-side applications, including support for routing, controllers, services, pipes, and guards. It also integrates with a variety of popular libraries and frameworks, such as GraphQL, WebSockets, and MongoDB, to provide a complete toolset for building server-side applications.
- Overall, NestJS is a powerful and flexible framework that can be used to build a wide variety of server-side applications, including APIs, microservices, and full-stack web applications.
- https://courses.nestjs.com/
## TypeScript:
- You are free to use any library you want to in this context. However, you must use the latest stable version of every library or framework used in your project
- TypeScript is a typed superset of JavaScript that can be used to develop front-end web applications. It is designed to help developers write code that is easy to maintain and scalable.
- There are several popular TypeScript frameworks that you can choose from when developing a front-end application. Some examples include:
	- Angular: Angular is a comprehensive framework for building single-page applications. It provides a rich set of features for building web applications, including a powerful component model, dependency injection, a routing system, and a template syntax for defining views. Angular also includes support for real-time communication through the use of WebSockets, which could be used to build an online multiplayer game.
	- React: React is a popular library for building user interfaces. It allows you to build reusable UI components and can be used with a variety of other libraries to build complete front-end applications. You could use React in conjunction with a library like Socket.IO to build real-time, interactive features for your online multiplayer game.
	- Vue.js: Vue.js is a progressive framework for building user interfaces. It focuses on the view layer and can be integrated into a project in a variety of ways, including as a standalone library or as part of a larger project that uses a bundler like Webpack. Like Angular and React, Vue.js can be used with libraries like Socket.IO to build real-time, interactive features for your game.
## PostgreSQL:
- PostgreSQL is a powerful, open-source object-relational database management system (ORDBMS). It is widely used for a variety of applications, including web development, data warehousing, and data analysis.
- To use PostgreSQL in your project, you will need to install and set up the database software on your server or hosting platform. You will also need to create a database and tables to store your data, and set up user accounts and permissions as needed.

# Requirements:
- Your website must be a single-page application. The user should be able to use the Back and Forward buttons of the browser.
- Your website must be compatible with the latest stable up-to-date version of Google Chrome and one additional web browser of your choice.
- The user should encounter no unhandled errors and no warnings when browsing the website.
- Everything has to be launch by a single call to: docker-compose up --build.
# Security Concerns:
- In order to create a fully functional website, here are a few security concerns that you have to tackle:
	- Any password stored in your database must be hashed.
		- Storing passwords in a hashed form is a best practice for ensuring the security of user accounts in a database. Hashing is the process of converting a password (or any other piece of data) into a fixed-size string of characters, known as a hash, using a cryptographic hash function.
		- One of the main benefits of hashing passwords is that it allows you to store them in a secure manner without having to store the actual passwords themselves. This is important because if an attacker were to gain access to your database, they would not be able to obtain the plaintext passwords of your users.
		- When a user attempts to log in to your application, you can use the same hash function to calculate the hash of the password they entered and compare it to the hash stored in the database. If the hashes match, the user has entered the correct password and can be granted access.
		- It's worth noting that there are many different cryptographic hash functions available, and it is important to choose one that is secure and resistant to attack. Some popular options include SHA-256, SHA-3, and bcrypt.
		- It's also important to use a salt when hashing passwords to further increase their security. A salt is a random string of characters that is added to the password before it is hashed, making it more difficult for attackers to use pre-computed hash tables (such as rainbow tables) to crack the password.
	- Your website must be protected against SQL injections.
		- SQL injection is a type of attack in which an attacker injects malicious code into a web application's SQL statements, allowing them to gain access to sensitive data or manipulate the database in unauthorized ways.
		- To protect against SQL injection attacks, it is important to follow best practices for writing and executing SQL queries in your web application. Some specific measures you can take include:
			- Use prepared statements and parameterized queries: Prepared statements allow you to separate the structure of a SQL query from the data being passed to it. This helps to prevent attackers from injecting malicious code into your queries.
			- Validate and sanitize user input: Make sure to validate and sanitize any user input that is used in your SQL queries. This includes checking that input meets any constraints or requirements (such as data type or length), and removing or escaping any potentially harmful characters.
			- Use stored procedures: Stored procedures are pre-defined SQL statements that are stored in the database and can be called by the application as needed. Using stored procedures can help to prevent SQL injection attacks by separating the logic of your queries from the application code.
			- Use an ORM: An object-relational mapper (ORM) is a tool that maps objects in your application code to records in a database. ORMs can help to prevent SQL injection attacks by abstracting away the details of SQL queries and automatically handling the input and output of data.
		- By following these and other best practices, you can help to ensure the security of your web application and protect it against SQL injection attacks.
	- You must implement some kind of server-side validation for forms and any user input.
		- Server-side validation is the process of checking user input on the server before it is processed and stored in the database. It is an important security measure that can help to prevent malicious or erroneous data from being entered into your application.
			- There are a number of ways you can implement server-side validation for forms and user input in your application. Some options you might consider include:
			- Use built-in validation functions: Many programming languages and frameworks include built-in functions that can be used to validate user input. For example, you might use functions like is_numeric in PHP or Number.isNaN in JavaScript to check that a value is a number, or use regular expressions to validate the format of an email address or phone number.
			- Use a library or framework: There are also many libraries and frameworks available that provide additional validation functionality. For example, you might use a library like Validator.js in JavaScript or FluentValidation in .NET to perform more advanced validation tasks.
			- Implement custom validation rules: In some cases, you may need to implement custom validation rules that are specific to your application. For example, you might need to check that a password meets certain complexity requirements or that a value is within a certain range. In these cases, you can write custom code to perform the necessary checks.
		- Overall, it is important to carefully consider the types of validation that are necessary for your application and to implement appropriate checks at the server-side to ensure the security and integrity of your data.
- Notes:
	- Please make sure you use a strong password hashing algorithm
	- For obvious security reasons, any credentials, API keys, env variables etc... must be saved locally in a .env file and ignored by git. Publicly stored credentials will lead you directly to a failure of the project.
# User Account:
- The user must login using the OAuth system of 42 intranet.
- The user should be able to choose a unique name that will be displayed on the
website.
- The user should be able to upload an avatar. If the user doesn’t upload an avatar,
a default one must be set.
- The user should be able to enable two-factor authentication. For instance,
Google Authenticator or sending a text message to their phone.
- The user should be able to add other users as friends and see their current status
(online, offline, in a game, and so forth).
- Stats (such as: wins and losses, ladder level, achievements, and so forth) have to
be displayed on the user profile.
- Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.