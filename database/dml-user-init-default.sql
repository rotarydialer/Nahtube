INSERT INTO nahtube.users (username, password, common_name, roles) 
VALUES
  (
      'daughter',
      nahtube.crypt('supersecure!', nahtube.gen_salt('bf', 8)),
      'Daughter',
      ARRAY['child']
);

INSERT INTO nahtube.users (username, password, common_name, roles) 
VALUES
  (
      'son',
      nahtube.crypt('supersecure!', nahtube.gen_salt('bf', 8)),
      'Son',
      ARRAY['child']
);

INSERT INTO nahtube.users (username, password, common_name, roles) 
VALUES
  (
      'dad',
      nahtube.crypt('supersecure!', nahtube.gen_salt('bf', 8)),
      'Daddy',
      ARRAY['parent','admin']
);

INSERT INTO nahtube.users (username, password, common_name, roles) 
VALUES
  (
      'mom',
      nahtube.crypt('supersecure!', nahtube.gen_salt('bf', 8)),
      'Mommy',
      ARRAY['parent']
);