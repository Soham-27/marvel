CREATE DATABASE submission;

\c submission;

CREATE TYPE years AS ENUM ('FE', 'SE', 'TE', 'BE');

CREATE TABLE users (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	mobile_number VARCHAR(100) NOT NULL UNIQUE,
	college VARCHAR(255) NOT NULL,
	year years NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	ems_id INT NOT NULL
);

CREATE TABLE user_token (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	token VARCHAR(255) NOT NULL,
	is_valid BOOLEAN NOT NULL,
	ems_token VARCHAR(256) NOT NULL,
	fk_user INT NOT NULL REFERENCES users(id) 
);


CREATE TABLE event_details (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	event_name VARCHAR(255) NOT NULL,
	ems_event_id INT,
    submission_table VARCHAR(255) NOT NULL,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL, 
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE webapp_submission (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user INT NOT NULL REFERENCES users(id),
	submission VARCHAR(256) NOT NULL,
    active_submission BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE paper_submission (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user INT NOT NULL REFERENCES users(id),
	submission VARCHAR(255) NOT NULL,
    active_submission BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE photoshop_submission (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user INT NOT NULL REFERENCES users(id),
	submission VARCHAR(255) NOT NULL,
    active_submission BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE insight_submission (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user INT NOT NULL REFERENCES users(id),
	submission VARCHAR(255) NOT NULL,
    active_submission BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE dataquest_submission (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user INT NOT NULL REFERENCES users(id),
	submission VARCHAR(255) NOT NULL,
    active_submission BOOLEAN NOT NULL, 
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);