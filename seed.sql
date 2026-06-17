-- docker exec -i wf-postgres-db psql -U root -d wf_db < seed.sql
-- Hasło dla WSZYSTKICH kont testowych: Test1234!

BEGIN;

TRUNCATE TABLE profile_categories, profiles, users RESTART IDENTITY CASCADE;

INSERT INTO users (full_name, email, password_hash, role, created_at, updated_at)
VALUES
  ('Jan Kowalski',        'jan.kowalski@example.com',        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Anna Malinowska',     'anna.malinowska@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Piotr Szymański',     'piotr.szymanski@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Marek Zieliński',     'marek.zielinski@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Karolina Wójcik',     'karolina.wojcik@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Tomasz Lewandowski',  'tomasz.lewandowski@example.com',  '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Magdalena Nowak',     'magdalena.nowak@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Krzysztof Wiśniewski','krzysztof.wisniewski@example.com','$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Agnieszka Kaczmarek', 'agnieszka.kaczmarek@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Paweł Krawczyk',      'pawel.krawczyk@example.com',      '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Ewa Mazur',           'ewa.mazur@example.com',           '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Michał Kowalczyk',    'michal.kowalczyk@example.com',    '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Joanna Krawiec',      'joanna.krawiec@example.com',      '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Adam Piotrowski',     'adam.piotrowski@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Natalia Grabowska',   'natalia.grabowska@example.com',   '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Robert Pawlak',       'robert.pawlak@example.com',       '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Monika Michalska',    'monika.michalska@example.com',    '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Grzegorz Adamczyk',   'grzegorz.adamczyk@example.com',   '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Aleksandra Dudek',    'aleksandra.dudek@example.com',    '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Marcin Zając',        'marcin.zajac@example.com',        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
  ('Patrycja Sikora',     'patrycja.sikora@example.com',     '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW());

INSERT INTO profiles (
    specialization, description, experience, city, voivodeship,
    phone_number, email,
    consultation_enabled, consultation_min, consultation_max,
    hourly_enabled,       hourly_min,       hourly_max,
    project_enabled,      project_min,      project_max,
    created_at, updated_at, user_id
)
SELECT * FROM (VALUES
  (
    'Elektryk',
    lo_from_bytea(0, 'Wykonuję kompleksowe instalacje elektryczne oraz usuwam nagłe awarie. Wieloletnie doświadczenie i uprawnienia SEP.'::bytea)::oid,
    '10 lat', 'Warszawa', 'mazowieckie', '123456789', 'jan.kowalski@example.com',
    false, 0::double precision, 0::double precision,   true, 150::double precision, 200::double precision,   false, 0::double precision, 0::double precision,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'jan.kowalski@example.com')
  ),
  (
    'Projektantka wnętrz',
    lo_from_bytea(0, 'Tworzę funkcjonalne i estetyczne projekty mieszkań oraz lokali usługowych. Pomagam w doborze materiałów.'::bytea)::oid,
    '5 lat', 'Kraków', 'małopolskie', '987654321', 'anna.malinowska@example.com',
    true, 250, 300,   false, 0, 0,   true, 2000, 5000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'anna.malinowska@example.com')
  ),
  (
    'Hydraulik',
    lo_from_bytea(0, 'Szybkie naprawy i instalacje wodno-kanalizacyjne. Dostępność 24/7 w nagłych przypadkach.'::bytea)::oid,
    '8 lat', 'Łódź', 'łódzkie', '111222333', 'piotr.szymanski@example.com',
    false, 0, 0,   true, 120, 180,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'piotr.szymanski@example.com')
  ),
  (
    'Glazurnik',
    lo_from_bytea(0, 'Precyzyjne układanie płytek, gresu i terakoty. Dokładność i terminowość to moje priorytety.'::bytea)::oid,
    '12 lat', 'Poznań', 'wielkopolskie', '444555666', 'marek.zielinski@example.com',
    false, 0, 0,   false, 0, 0,   true, 800, 3000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'marek.zielinski@example.com')
  ),
  (
    'Prawnik',
    lo_from_bytea(0, 'Specjalizuję się w prawie gospodarczym i cywilnym. Sporządzam umowy, reprezentuję klientów w sądzie.'::bytea)::oid,
    '7 lat', 'Warszawa', 'mazowieckie', '777888999', 'karolina.wojcik@example.com',
    true, 300, 500,   true, 250, 350,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'karolina.wojcik@example.com')
  ),
  (
    'Informatyk',
    lo_from_bytea(0, 'Naprawiam komputery, instaluję systemy operacyjne i konfiguruję sieci domowe oraz biurowe.'::bytea)::oid,
    '6 lat', 'Wrocław', 'dolnośląskie', '600100200', 'tomasz.lewandowski@example.com',
    false, 0, 0,   true, 80, 130,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'tomasz.lewandowski@example.com')
  ),
  (
    'Fryzjerka',
    lo_from_bytea(0, 'Strzyżenie damskie i męskie, koloryzacja, stylizacja na specjalne okazje. Salon w centrum miasta.'::bytea)::oid,
    '9 lat', 'Gdańsk', 'pomorskie', '600200300', 'magdalena.nowak@example.com',
    false, 0, 0,   true, 60, 150,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'magdalena.nowak@example.com')
  ),
  (
    'Mechanik samochodowy',
    lo_from_bytea(0, 'Diagnostyka, naprawy mechaniczne i elektroniczne pojazdów wszystkich marek. Szybka realizacja.'::bytea)::oid,
    '15 lat', 'Katowice', 'śląskie', '600300400', 'krzysztof.wisniewski@example.com',
    false, 0, 0,   true, 100, 220,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'krzysztof.wisniewski@example.com')
  ),
  (
    'Księgowa',
    lo_from_bytea(0, 'Prowadzenie ksiąg rachunkowych, rozliczenia podatkowe i obsługa kadrowo-płacowa małych firm.'::bytea)::oid,
    '11 lat', 'Lublin', 'lubelskie', '600400500', 'agnieszka.kaczmarek@example.com',
    true, 150, 200,   false, 0, 0,   true, 500, 1500,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'agnieszka.kaczmarek@example.com')
  ),
  (
    'Stolarz',
    lo_from_bytea(0, 'Wykonuję meble na zamówienie, schody drewniane i renowacje starych mebli. Indywidualne projekty.'::bytea)::oid,
    '14 lat', 'Bydgoszcz', 'kujawsko-pomorskie', '600500600', 'pawel.krawczyk@example.com',
    false, 0, 0,   false, 0, 0,   true, 1000, 8000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'pawel.krawczyk@example.com')
  ),
  (
    'Dietetyk',
    lo_from_bytea(0, 'Indywidualne plany żywieniowe, konsultacje dietetyczne i wsparcie w redukcji masy ciała.'::bytea)::oid,
    '4 lata', 'Szczecin', 'zachodniopomorskie', '600600700', 'ewa.mazur@example.com',
    true, 120, 180,   false, 0, 0,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'ewa.mazur@example.com')
  ),
  (
    'Grafik komputerowy',
    lo_from_bytea(0, 'Projektowanie logotypów, materiałów reklamowych i identyfikacji wizualnej dla firm.'::bytea)::oid,
    '7 lat', 'Warszawa', 'mazowieckie', '600700800', 'michal.kowalczyk@example.com',
    true, 100, 150,   false, 0, 0,   true, 600, 3000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'michal.kowalczyk@example.com')
  ),
  (
    'Kosmetolog',
    lo_from_bytea(0, 'Zabiegi pielęgnacyjne na twarz i ciało, makijaż permanentny oraz konsultacje kosmetologiczne.'::bytea)::oid,
    '6 lat', 'Kraków', 'małopolskie', '600800900', 'joanna.krawiec@example.com',
    false, 0, 0,   true, 90, 250,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'joanna.krawiec@example.com')
  ),
  (
    'Fizjoterapeuta',
    lo_from_bytea(0, 'Terapia manualna, rehabilitacja po urazach i prowadzenie treningu funkcjonalnego.'::bytea)::oid,
    '10 lat', 'Poznań', 'wielkopolskie', '600900000', 'adam.piotrowski@example.com',
    true, 80, 100,   true, 100, 150,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'adam.piotrowski@example.com')
  ),
  (
    'Architekt',
    lo_from_bytea(0, 'Projekty domów jednorodzinnych, adaptacje projektów typowych i nadzór budowlany.'::bytea)::oid,
    '13 lat', 'Wrocław', 'dolnośląskie', '601000111', 'natalia.grabowska@example.com',
    true, 400, 600,   false, 0, 0,   true, 5000, 15000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'natalia.grabowska@example.com')
  ),
  (
    'Remont mieszkania',
    lo_from_bytea(0, 'Malowanie wnętrz, gładzie gipsowe i renowacja elewacji. Czysta i terminowa realizacja.'::bytea)::oid,
    '9 lat', 'Łódź', 'łódzkie', '601100222', 'robert.pawlak@example.com',
    false, 0, 0,   true, 70, 110,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'robert.pawlak@example.com')
  ),
  (
    'Tłumacz przysięgły',
    lo_from_bytea(0, 'Tłumaczenia przysięgłe i specjalistyczne z języka angielskiego i niemieckiego.'::bytea)::oid,
    '16 lat', 'Warszawa', 'mazowieckie', '601200333', 'monika.michalska@example.com',
    true, 150, 250,   false, 0, 0,   true, 300, 1200,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'monika.michalska@example.com')
  ),
  (
    'Wulkanizator',
    lo_from_bytea(0, 'Wymiana i naprawa ogumienia, wyważanie kół oraz sezonowy przegląd zawieszenia.'::bytea)::oid,
    '8 lat', 'Katowice', 'śląskie', '601300444', 'grzegorz.adamczyk@example.com',
    false, 0, 0,   true, 50, 90,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'grzegorz.adamczyk@example.com')
  ),
  (
    'Fotograf',
    lo_from_bytea(0, 'Sesje ślubne, rodzinne i biznesowe. Profesjonalna obróbka zdjęć i szybka realizacja.'::bytea)::oid,
    '5 lat', 'Gdańsk', 'pomorskie', '601400555', 'aleksandra.dudek@example.com',
    false, 0, 0,   false, 0, 0,   true, 1200, 6000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'aleksandra.dudek@example.com')
  ),
  (
    'Lakiernik samochodowy',
    lo_from_bytea(0, 'Lakierowanie i usuwanie wgnieceń bez lakierowania (PDR). Naprawy powypadkowe.'::bytea)::oid,
    '11 lat', 'Poznań', 'wielkopolskie', '601500666', 'marcin.zajac@example.com',
    false, 0, 0,   false, 0, 0,   true, 600, 4000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'marcin.zajac@example.com')
  ),
  (
    'Ogrodnik',
    lo_from_bytea(0, 'Projektowanie i utrzymanie ogrodów, nasadzenia roślin oraz systemy automatycznego nawadniania.'::bytea)::oid,
    '7 lat', 'Lublin', 'lubelskie', '601600777', 'patrycja.sikora@example.com',
    true, 100, 150,   true, 70, 120,   true, 1500, 6000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'patrycja.sikora@example.com')
  )
) AS v(
    specialization, description, experience, city, voivodeship,
    phone_number, email,
    consultation_enabled, consultation_min, consultation_max,
    hourly_enabled, hourly_min, hourly_max,
    project_enabled, project_min, project_max,
    created_at, updated_at, user_id
);

INSERT INTO profile_categories (profile_id, categories)
SELECT p.id, c.category
FROM profiles p
JOIN users u ON p.user_id = u.id
JOIN (VALUES
    ('jan.kowalski@example.com',         'Elektryka'),
    ('jan.kowalski@example.com',         'Instalacja elektryczna'),
    ('anna.malinowska@example.com',      'Grafika'),
    ('anna.malinowska@example.com',      'Remont mieszkania'),
    ('piotr.szymanski@example.com',      'Hydraulika'),
    ('piotr.szymanski@example.com',      'Remont mieszkania'),
    ('marek.zielinski@example.com',      'Glazurnictwo'),
    ('marek.zielinski@example.com',      'Remont mieszkania'),
    ('karolina.wojcik@example.com',      'Prawo'),
    ('tomasz.lewandowski@example.com',   'Informatyka'),
    ('magdalena.nowak@example.com',      'Fryzjerstwo'),
    ('krzysztof.wisniewski@example.com', 'Mechanika'),
    ('agnieszka.kaczmarek@example.com',  'Księgowość'),
    ('pawel.krawczyk@example.com',       'Stolarstwo'),
    ('ewa.mazur@example.com',            'Dietetyka'),
    ('michal.kowalczyk@example.com',     'Grafika'),
    ('joanna.krawiec@example.com',       'Kosmetologia'),
    ('adam.piotrowski@example.com',      'Fizjoterapia'),
    ('natalia.grabowska@example.com',    'Murarstwo'),
    ('natalia.grabowska@example.com',    'Remont mieszkania'),
    ('robert.pawlak@example.com',        'Malowanie ścian'),
    ('robert.pawlak@example.com',        'Remont mieszkania'),
    ('monika.michalska@example.com',     'Prawo'),
    ('grzegorz.adamczyk@example.com',    'Wulkanizacja'),
    ('aleksandra.dudek@example.com',     'Fotografia'),
    ('marcin.zajac@example.com',         'Lakiernictwo'),
    ('patrycja.sikora@example.com',      'Ogrodnictwo')
) AS c(email, category) ON c.email = u.email;

COMMIT;