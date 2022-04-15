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
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TYPE choice AS ENUM ('Technical', 'Non Technical');
CREATE TYPE store AS ENUM ('Online', 'Offline', 'Blended');

CREATE TABLE user_events (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	ems_id INT NOT NULL,
	name VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	type choice,
	mode store,
	is_active BOOLEAN NOT NULL,
   	play BOOLEAN NOT NULL,
	tagline VARCHAR(255) NOT NULL,
	logo VARCHAR(255) NOT NULL,
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

-- CREATE TABLE event_details (
-- 	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
-- 	event_name VARCHAR(255) NOT NULL,
-- 	ems_event_id INT,
--     submission_table VARCHAR(255) NOT NULL,
-- 	start_time TIMESTAMP NOT NULL,
-- 	end_time TIMESTAMP NOT NULL, 
-- 	created_at TIMESTAMP NOT NULL,
-- 	updated_at TIMESTAMP NOT NULL
-- );

CREATE TABLE webapp (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	submission VARCHAR(2048) NOT NULL,
    active_submission BOOLEAN NOT NULL,
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TYPE paper_type AS ENUM ('Idea Presentation Track', 'Paper Presentation Track');

CREATE TABLE paper (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	type paper_type,
	submission_abstract VARCHAR(2048) NOT NULL,
	submission_paper VARCHAR(2048),
    active_submission BOOLEAN NOT NULL,
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE photoshop (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	submission VARCHAR(2048) NOT NULL,
    active_submission BOOLEAN NOT NULL,
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE insight (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	topic VARCHAR(255) NOT NULL,
	submission TEXT NOT NULL,
    active_submission BOOLEAN NOT NULL,
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);



CREATE TABLE dataquest (
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(id) ON DELETE CASCADE,
	submission_csv VARCHAR(2048) NOT NULL,
	submission_python VARCHAR(2048) NOT NULL,
	accuracy FLOAT NOT NULL,
    active_submission BOOLEAN NOT NULL, 
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);