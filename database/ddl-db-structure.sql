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
  youtube_id character varying(64),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nahtube.users
  OWNER TO postgres;

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

-- CHANNELS --------------------------

-- Table: nahtube.channels_allowed

-- DROP TABLE nahtube.channels_allowed;

-- NOTE: Probably need another column here to track "allowed type/rules"
--    e.g.:
--      "ANY"       : all videos on this channel are allowed
--      "SPECIFIC"  : only certain specified videos (separate table) are allowed
--      "NONE"      : ham-fisted blacklist? No... too confusing, I think.

CREATE TABLE nahtube.channels_allowed
(
  id serial NOT NULL,
  channel_id character varying(64) NOT NULL,
  user_id integer NOT NULL,
  channel_name character varying(128) NOT NULL,
  channel_data jsonb NOT NULL,
  CONSTRAINT channels_allowed_pkey PRIMARY KEY (channel_id, user_id),
  CONSTRAINT channels_allowed_user_fkey FOREIGN KEY (user_id)
      REFERENCES nahtube.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nahtube.channels_allowed
  OWNER TO postgres;

-- Index: nahtube.fki_channels_allowed_user_fkey

-- DROP INDEX nahtube.fki_channels_allowed_user_fkey;

CREATE INDEX fki_channels_allowed_user_fkey
  ON nahtube.channels_allowed
  USING btree
  (user_id);

-- ACTIVITY --------------------------

-- Table: nahtube.user_activity

-- DROP TABLE nahtube.user_activity;

CREATE TABLE nahtube.user_activity
(
  id serial NOT NULL,
  user_id integer NOT NULL,
  action character varying(128) NOT NULL,
  action_time timestamp NOT NULL DEFAULT NOW(),
  channel_id character varying(64),
  details jsonb,
  CONSTRAINT user_activity_pkey PRIMARY KEY (id),
  CONSTRAINT user_activity_user_fkey FOREIGN KEY (user_id)
      REFERENCES nahtube.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nahtube.user_activity
  OWNER TO postgres;