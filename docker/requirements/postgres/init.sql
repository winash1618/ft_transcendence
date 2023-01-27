-- Create the database
CREATE DATABASE my_database;

-- Create a new user for the database
CREATE USER my_user WITH PASSWORD 'my_password';

-- Grant all privileges on the new database to the new user
GRANT ALL PRIVILEGES ON DATABASE my_database TO my_user;

-- Create a new table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Insert some data into the table
INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com');
INSERT INTO users (name, email) VALUES ('Jane Smith', 'jane.smith@example.com');
