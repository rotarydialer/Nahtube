-- DDL for Content Editor
-- This script will create the initial state of the Postgres database

-------------------------------------------------------------------------------
-- DATABASE
-------------------------------------------------------------------------------
-- Database: NahDB

DROP DATABASE nahdb;

CREATE DATABASE nahdb
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-------------------------------------------------------------------------------
-- SCHEMA
-------------------------------------------------------------------------------

DROP SCHEMA nahtube;

CREATE SCHEMA nahtube
    AUTHORIZATION postgres;

-------------------------------------------------------------------------------
-- EXTENSIONS
-------------------------------------------------------------------------------

-- Extension: "uuid-ossp" 
-- Creates UUIDs; required for guid columns

-- DROP EXTENSION "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    SCHEMA nahtube
    VERSION "1.1";

-- Extension: pgcrypto

-- DROP EXTENSION pgcrypto;

CREATE EXTENSION IF NOT EXISTS "pgcrypto"
    SCHEMA nahtube
    VERSION "1.2";


-------------------------------------------------------------------------------
-- TABLES, SEQUENCES, CONSTRAINTS, etc.
-------------------------------------------------------------------------------

-- USERS --------------------------
-- Sequence: nahtube.users_id_seq

-- DROP SEQUENCE nahtube.users_id_seq;

CREATE SEQUENCE nahtube.users_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;
ALTER TABLE nahtube.users_id_seq
  OWNER TO postgres;

-- Table: nahtube.users

-- DROP TABLE nahtube.users;

CREATE TABLE nahtube.users
(
  id serial NOT NULL,
  username character varying(32) NOT NULL,
  password character varying NOT NULL,
  common_name character varying(64),
  created date NOT NULL DEFAULT ('now'::text)::date,
  roles character varying(256)[],
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nahtube.users
  OWNER TO postgres;

-- Constraint: nahtube.users_pkey

-- ALTER TABLE nahtube.users DROP CONSTRAINT users_pkey;

ALTER TABLE nahtube.users
  ADD CONSTRAINT users_pkey PRIMARY KEY(id);

-- Constraint: nahtube.users_username_key

-- ALTER TABLE nahtube.users DROP CONSTRAINT users_username_key;

ALTER TABLE nahtube.users
  ADD CONSTRAINT users_username_key UNIQUE(username);

-- ROLES --------------------------

-- Table: nahtube.user_roles

-- DROP TABLE nahtube.user_roles;

CREATE TABLE nahtube.user_roles
(
  id serial NOT NULL,
  rolename character varying(32) NOT NULL,
  CONSTRAINT user_roles_pkey PRIMARY KEY (rolename),
  CONSTRAINT user_roles_rolename_key UNIQUE (rolename)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nahtube.user_roles
  OWNER TO postgres;

-- Constraint: nahtube.user_roles_pkey

-- ALTER TABLE nahtube.user_roles DROP CONSTRAINT user_roles_pkey;

ALTER TABLE nahtube.user_roles
  ADD CONSTRAINT user_roles_pkey PRIMARY KEY(rolename);

-- Constraint: nahtube.user_roles_rolename_key

-- ALTER TABLE nahtube.user_roles DROP CONSTRAINT user_roles_rolename_key;

ALTER TABLE nahtube.user_roles
  ADD CONSTRAINT user_roles_rolename_key UNIQUE(rolename);

-- CHANNELS --------------------------

-- Table: nahtube.channels_allowed

-- DROP TABLE nahtube.channels_allowed;

CREATE TABLE nahtube.channels_allowed
(
  id serial NOT NULL,
  channel_id character varying(64) NOT NULL,
  channel_name character varying(128) NOT NULL,
  channel_data jsonb NOT NULL,
  CONSTRAINT channels_allowed_pkey PRIMARY KEY (channel_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nahtube.channels_allowed
  OWNER TO postgres;
  
-- Constraint: nahtube.channels_allowed_pkey

-- ALTER TABLE nahtube.channels_allowed DROP CONSTRAINT channels_allowed_pkey;

ALTER TABLE nahtube.channels_allowed
  ADD CONSTRAINT channels_allowed_pkey PRIMARY KEY(channel_id);
