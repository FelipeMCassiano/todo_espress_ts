CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) ,
    description VARCHAR(50) ,
    completed BOOLEAN DEFAULT FALSE
);
