CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	username TEXT,
	password TEXT,
	email TEXT
);

CREATE TABLE projects (
	id INTEGER PRIMARY KEY,
	title TEXT,
	user_id INTEGER references users,
	keycode TEXT
);

CREATE TABLE invites (
	id INTEGER PRIMARY KEY,
	user_id references users,
	project_id references projects
);

CREATE TABLE collabs (
	id INTEGER PRIMARY KEY,
	user_id references users,
	project_id references projects
);

CREATE TABLE 