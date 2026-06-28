-- docker exec -i wf-postgres-db psql -U root -d wf_db < data.sql
-- Hasło dla WSZYSTKICH kont testowych: Test1234!

BEGIN;

TRUNCATE TABLE profile_categories, profiles, users, ratings, rating_images RESTART IDENTITY CASCADE;

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO users (full_name, email, password_hash, role, created_at, updated_at)
VALUES ('Jan Kowalski', 'jan.kowalski@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW',
        'SPECIALIST', NOW(), NOW()),
       ('Anna Malinowska', 'anna.malinowska@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Piotr Szymański', 'piotr.szymanski@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Marek Zieliński', 'marek.zielinski@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Karolina Wójcik', 'karolina.wojcik@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Tomasz Lewandowski', 'tomasz.lewandowski@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Magdalena Nowak', 'magdalena.nowak@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Krzysztof Wiśniewski', 'krzysztof.wisniewski@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Agnieszka Kaczmarek', 'agnieszka.kaczmarek@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Paweł Krawczyk', 'pawel.krawczyk@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW',
        'SPECIALIST', NOW(), NOW()),
       ('Ewa Mazur', 'ewa.mazur@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW',
        'SPECIALIST', NOW(), NOW()),
       ('Michał Kowalczyk', 'michal.kowalczyk@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Joanna Krawiec', 'joanna.krawiec@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW',
        'SPECIALIST', NOW(), NOW()),
       ('Adam Piotrowski', 'adam.piotrowski@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Natalia Grabowska', 'natalia.grabowska@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Robert Pawlak', 'robert.pawlak@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW',
        'SPECIALIST', NOW(), NOW()),
       ('Monika Michalska', 'monika.michalska@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Grzegorz Adamczyk', 'grzegorz.adamczyk@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Aleksandra Dudek', 'aleksandra.dudek@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW()),
       ('Marcin Zając', 'marcin.zajac@example.com', '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW',
        'SPECIALIST', NOW(), NOW()),
       ('Patrycja Sikora', 'patrycja.sikora@example.com',
        '$2b$10$BTIvpKGH8IROlN3cEuS.Ge3X1uYo8cI5Btf9ArMEhSEXeqVHXSAiW', 'SPECIALIST', NOW(), NOW());

-- ============================================================
-- PROFILES
-- Każdy INSERT osobno – VALUES nie obsługuje mieszanych typów
-- zawierających oid (lo_from_bytea) i skalary w jednym zapytaniu.
-- ============================================================
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Elektryk',
        lo_from_bytea(0,
                      'Wykonuję kompleksowe instalacje elektryczne oraz usuwam nagłe awarie. Wieloletnie doświadczenie i uprawnienia SEP.'::bytea),
        '10 lat', 'Warszawa', 'mazowieckie', '123456789', 'jan.kowalski@example.com',
        true, false,
        false, 0, 0,
        true, 150, 200,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'jan.kowalski@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Projektantka wnętrz',
        lo_from_bytea(0,
                      'Tworzę funkcjonalne i estetyczne projekty mieszkań oraz lokali usługowych. Pomagam w doborze materiałów.'::bytea),
        '5 lat', 'Kraków', 'małopolskie', '987654321', 'anna.malinowska@example.com',
        false, true,
        true, 250, 300,
        false, 0, 0,
        true, 2000, 5000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'anna.malinowska@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Hydraulik',
        lo_from_bytea(0,
                      'Szybkie naprawy i instalacje wodno-kanalizacyjne. Dostępność 24/7 w nagłych przypadkach.'::bytea),
        '8 lat', 'Łódź', 'łódzkie', '111222333', 'piotr.szymanski@example.com',
        true, false,
        false, 0, 0,
        true, 120, 180,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'piotr.szymanski@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Glazurnik',
        lo_from_bytea(0,
                      'Precyzyjne układanie płytek, gresu i terakoty. Dokładność i terminowość to moje priorytety.'::bytea),
        '12 lat', 'Poznań', 'wielkopolskie', '444555666', 'marek.zielinski@example.com',
        true, false,
        false, 0, 0,
        false, 0, 0,
        true, 800, 3000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'marek.zielinski@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Prawnik',
        lo_from_bytea(0,
                      'Specjalizuję się w prawie gospodarczym i cywilnym. Sporządzam umowy, reprezentuję klientów w sądzie.'::bytea),
        '7 lat', 'Warszawa', 'mazowieckie', '777888999', 'karolina.wojcik@example.com',
        false, true,
        true, 300, 500,
        true, 250, 350,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'karolina.wojcik@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Informatyk',
        lo_from_bytea(0,
                      'Naprawiam komputery, instaluję systemy operacyjne i konfiguruję sieci domowe oraz biurowe.'::bytea),
        '6 lat', 'Wrocław', 'dolnośląskie', '600100200', 'tomasz.lewandowski@example.com',
        true, true,
        false, 0, 0,
        true, 80, 130,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'tomasz.lewandowski@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Fryzjerka',
        lo_from_bytea(0,
                      'Strzyżenie damskie i męskie, koloryzacja, stylizacja na specjalne okazje. Salon w centrum miasta.'::bytea),
        '9 lat', 'Gdańsk', 'pomorskie', '600200300', 'magdalena.nowak@example.com',
        false, false,
        false, 0, 0,
        true, 60, 150,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'magdalena.nowak@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Mechanik samochodowy',
        lo_from_bytea(0,
                      'Diagnostyka, naprawy mechaniczne i elektroniczne pojazdów wszystkich marek. Szybka realizacja.'::bytea),
        '15 lat', 'Katowice', 'śląskie', '600300400', 'krzysztof.wisniewski@example.com',
        false, false,
        false, 0, 0,
        true, 100, 220,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'krzysztof.wisniewski@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Księgowa',
        lo_from_bytea(0,
                      'Prowadzenie ksiąg rachunkowych, rozliczenia podatkowe i obsługa kadrowo-płacowa małych firm.'::bytea),
        '11 lat', 'Lublin', 'lubelskie', '600400500', 'agnieszka.kaczmarek@example.com',
        false, true,
        true, 150, 200,
        false, 0, 0,
        true, 500, 1500,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'agnieszka.kaczmarek@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Stolarz',
        lo_from_bytea(0,
                      'Wykonuję meble na zamówienie, schody drewniane i renowacje starych mebli. Indywidualne projekty.'::bytea),
        '14 lat', 'Bydgoszcz', 'kujawsko-pomorskie', '600500600', 'pawel.krawczyk@example.com',
        true, false,
        false, 0, 0,
        false, 0, 0,
        true, 1000, 8000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'pawel.krawczyk@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Dietetyk',
        lo_from_bytea(0,
                      'Indywidualne plany żywieniowe, konsultacje dietetyczne i wsparcie w redukcji masy ciała.'::bytea),
        '4 lata', 'Szczecin', 'zachodniopomorskie', '600600700', 'ewa.mazur@example.com',
        false, true,
        true, 120, 180,
        false, 0, 0,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'ewa.mazur@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Grafik komputerowy',
        lo_from_bytea(0, 'Projektowanie logotypów, materiałów reklamowych i identyfikacji wizualnej dla firm.'::bytea),
        '7 lat', 'Warszawa', 'mazowieckie', '600700800', 'michal.kowalczyk@example.com',
        false, true,
        true, 100, 150,
        false, 0, 0,
        true, 600, 3000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'michal.kowalczyk@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Kosmetolog',
        lo_from_bytea(0,
                      'Zabiegi pielęgnacyjne na twarz i ciało, makijaż permanentny oraz konsultacje kosmetologiczne.'::bytea),
        '6 lat', 'Kraków', 'małopolskie', '600800900', 'joanna.krawiec@example.com',
        false, false,
        false, 0, 0,
        true, 90, 250,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'joanna.krawiec@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Fizjoterapeuta',
        lo_from_bytea(0, 'Terapia manualna, rehabilitacja po urazach i prowadzenie treningu funkcjonalnego.'::bytea),
        '10 lat', 'Poznań', 'wielkopolskie', '600900000', 'adam.piotrowski@example.com',
        true, false,
        true, 80, 100,
        true, 100, 150,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'adam.piotrowski@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Architekt',
        lo_from_bytea(0, 'Projekty domów jednorodzinnych, adaptacje projektów typowych i nadzór budowlany.'::bytea),
        '13 lat', 'Wrocław', 'dolnośląskie', '601000111', 'natalia.grabowska@example.com',
        false, true,
        true, 400, 600,
        false, 0, 0,
        true, 5000, 15000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'natalia.grabowska@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Malarz / Tynkarz',
        lo_from_bytea(0,
                      'Malowanie wnętrz, gładzie gipsowe i renowacja elewacji. Czysta i terminowa realizacja.'::bytea),
        '9 lat', 'Łódź', 'łódzkie', '601100222', 'robert.pawlak@example.com',
        true, false,
        false, 0, 0,
        true, 70, 110,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'robert.pawlak@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Tłumacz przysięgły',
        lo_from_bytea(0, 'Tłumaczenia przysięgłe i specjalistyczne z języka angielskiego i niemieckiego.'::bytea),
        '16 lat', 'Warszawa', 'mazowieckie', '601200333', 'monika.michalska@example.com',
        false, true,
        true, 150, 250,
        false, 0, 0,
        true, 300, 1200,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'monika.michalska@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Wulkanizator',
        lo_from_bytea(0, 'Wymiana i naprawa ogumienia, wyważanie kół oraz sezonowy przegląd zawieszenia.'::bytea),
        '8 lat', 'Katowice', 'śląskie', '601300444', 'grzegorz.adamczyk@example.com',
        false, false,
        false, 0, 0,
        true, 50, 90,
        false, 0, 0,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'grzegorz.adamczyk@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Fotograf',
        lo_from_bytea(0, 'Sesje ślubne, rodzinne i biznesowe. Profesjonalna obróbka zdjęć i szybka realizacja.'::bytea),
        '5 lat', 'Gdańsk', 'pomorskie', '601400555', 'aleksandra.dudek@example.com',
        true, false,
        false, 0, 0,
        false, 0, 0,
        true, 1200, 6000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'aleksandra.dudek@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Lakiernik samochodowy',
        lo_from_bytea(0, 'Lakierowanie i usuwanie wgnieceń bez lakierowania (PDR). Naprawy powypadkowe.'::bytea),
        '11 lat', 'Poznań', 'wielkopolskie', '601500666', 'marcin.zajac@example.com',
        false, false,
        false, 0, 0,
        false, 0, 0,
        true, 600, 4000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'marcin.zajac@example.com'));
INSERT INTO profiles (specialization, description, experience,
                      city, voivodeship, phone_number, email,
                      paid_travel, remote_consultations,
                      consultation_enabled, consultation_min, consultation_max,
                      hourly_enabled, hourly_min, hourly_max,
                      project_enabled, project_min, project_max,
                      created_at, updated_at, user_id)
VALUES ('Ogrodnik',
        lo_from_bytea(0,
                      'Projektowanie i utrzymanie ogrodów, nasadzenia roślin oraz systemy automatycznego nawadniania.'::bytea),
        '7 lat', 'Lublin', 'lubelskie', '601600777', 'patrycja.sikora@example.com',
        true, false,
        true, 100, 150,
        true, 70, 120,
        true, 1500, 6000,
        NOW(), NOW(),
        (SELECT id FROM users WHERE email = 'patrycja.sikora@example.com'));

-- ============================================================
-- PROFILE CATEGORIES
-- ============================================================
INSERT INTO profile_categories (profile_id, categories)
SELECT p.id, c.category
FROM profiles p
         JOIN users u ON p.user_id = u.id
         JOIN (VALUES ('jan.kowalski@example.com', 'Elektryka'),
                      ('jan.kowalski@example.com', 'Instalacja elektryczna'),
                      ('anna.malinowska@example.com', 'Grafika'),
                      ('anna.malinowska@example.com', 'Remont mieszkania'),
                      ('piotr.szymanski@example.com', 'Hydraulika'),
                      ('piotr.szymanski@example.com', 'Remont mieszkania'),
                      ('marek.zielinski@example.com', 'Glazurnictwo'),
                      ('marek.zielinski@example.com', 'Remont mieszkania'),
                      ('karolina.wojcik@example.com', 'Prawo'),
                      ('tomasz.lewandowski@example.com', 'Informatyka'),
                      ('magdalena.nowak@example.com', 'Fryzjerstwo'),
                      ('krzysztof.wisniewski@example.com', 'Mechanika'),
                      ('agnieszka.kaczmarek@example.com', 'Księgowość'),
                      ('pawel.krawczyk@example.com', 'Stolarstwo'),
                      ('ewa.mazur@example.com', 'Dietetyka'),
                      ('michal.kowalczyk@example.com', 'Grafika'),
                      ('joanna.krawiec@example.com', 'Kosmetologia'),
                      ('adam.piotrowski@example.com', 'Fizjoterapia'),
                      ('natalia.grabowska@example.com', 'Murarstwo'),
                      ('natalia.grabowska@example.com', 'Remont mieszkania'),
                      ('robert.pawlak@example.com', 'Malowanie ścian'),
                      ('robert.pawlak@example.com', 'Remont mieszkania'),
                      ('monika.michalska@example.com', 'Prawo'),
                      ('grzegorz.adamczyk@example.com', 'Wulkanizacja'),
                      ('aleksandra.dudek@example.com', 'Fotografia'),
                      ('marcin.zajac@example.com', 'Lakiernictwo'),
                      ('patrycja.sikora@example.com', 'Ogrodnictwo')) AS c(email, category) ON c.email = u.email;

-- ============================================================
-- AVAILABILITY
-- ============================================================
INSERT INTO profile_availability (profile_id, day, start_time, end_time)
SELECT p.id, a.day, a.start_time::time, a.end_time::time
FROM profiles p
         JOIN users u ON p.user_id = u.id
         JOIN (VALUES ('jan.kowalski@example.com', 'Pon', '07:00', '17:00'),
                      ('jan.kowalski@example.com', 'Wt', '07:00', '17:00'),
                      ('jan.kowalski@example.com', 'Śr', '07:00', '17:00'),
                      ('jan.kowalski@example.com', 'Czw', '07:00', '17:00'),
                      ('jan.kowalski@example.com', 'Pt', '07:00', '15:00'),
                      ('jan.kowalski@example.com', 'Sob', '08:00', '13:00'),

                      ('anna.malinowska@example.com', 'Pon', '09:00', '17:00'),
                      ('anna.malinowska@example.com', 'Wt', '09:00', '17:00'),
                      ('anna.malinowska@example.com', 'Śr', '09:00', '17:00'),
                      ('anna.malinowska@example.com', 'Czw', '09:00', '17:00'),
                      ('anna.malinowska@example.com', 'Pt', '09:00', '16:00'),

                      ('piotr.szymanski@example.com', 'Pon', '08:00', '18:00'),
                      ('piotr.szymanski@example.com', 'Wt', '08:00', '18:00'),
                      ('piotr.szymanski@example.com', 'Śr', '08:00', '18:00'),
                      ('piotr.szymanski@example.com', 'Czw', '08:00', '18:00'),
                      ('piotr.szymanski@example.com', 'Pt', '08:00', '18:00'),
                      ('piotr.szymanski@example.com', 'Sob', '09:00', '14:00'),
                      ('piotr.szymanski@example.com', 'Nd', '10:00', '13:00'),

                      ('marek.zielinski@example.com', 'Pon', '07:00', '16:00'),
                      ('marek.zielinski@example.com', 'Wt', '07:00', '16:00'),
                      ('marek.zielinski@example.com', 'Śr', '07:00', '16:00'),
                      ('marek.zielinski@example.com', 'Czw', '07:00', '16:00'),
                      ('marek.zielinski@example.com', 'Pt', '07:00', '16:00'),
                      ('marek.zielinski@example.com', 'Sob', '08:00', '12:00'),

                      ('karolina.wojcik@example.com', 'Pon', '09:00', '18:00'),
                      ('karolina.wojcik@example.com', 'Wt', '09:00', '18:00'),
                      ('karolina.wojcik@example.com', 'Śr', '09:00', '18:00'),
                      ('karolina.wojcik@example.com', 'Czw', '09:00', '18:00'),
                      ('karolina.wojcik@example.com', 'Pt', '09:00', '16:00'),

                      ('tomasz.lewandowski@example.com', 'Pon', '10:00', '20:00'),
                      ('tomasz.lewandowski@example.com', 'Wt', '10:00', '20:00'),
                      ('tomasz.lewandowski@example.com', 'Śr', '10:00', '20:00'),
                      ('tomasz.lewandowski@example.com', 'Czw', '10:00', '20:00'),
                      ('tomasz.lewandowski@example.com', 'Pt', '10:00', '18:00'),
                      ('tomasz.lewandowski@example.com', 'Sob', '11:00', '17:00'),

                      ('magdalena.nowak@example.com', 'Wt', '09:00', '18:00'),
                      ('magdalena.nowak@example.com', 'Śr', '09:00', '18:00'),
                      ('magdalena.nowak@example.com', 'Czw', '09:00', '18:00'),
                      ('magdalena.nowak@example.com', 'Pt', '09:00', '18:00'),
                      ('magdalena.nowak@example.com', 'Sob', '09:00', '15:00'),

                      ('krzysztof.wisniewski@example.com', 'Pon', '07:30', '17:00'),
                      ('krzysztof.wisniewski@example.com', 'Wt', '07:30', '17:00'),
                      ('krzysztof.wisniewski@example.com', 'Śr', '07:30', '17:00'),
                      ('krzysztof.wisniewski@example.com', 'Czw', '07:30', '17:00'),
                      ('krzysztof.wisniewski@example.com', 'Pt', '07:30', '17:00'),
                      ('krzysztof.wisniewski@example.com', 'Sob', '08:00', '13:00'),

                      ('agnieszka.kaczmarek@example.com', 'Pon', '08:00', '16:00'),
                      ('agnieszka.kaczmarek@example.com', 'Wt', '08:00', '16:00'),
                      ('agnieszka.kaczmarek@example.com', 'Śr', '08:00', '16:00'),
                      ('agnieszka.kaczmarek@example.com', 'Czw', '08:00', '16:00'),
                      ('agnieszka.kaczmarek@example.com', 'Pt', '08:00', '15:00'),

                      ('pawel.krawczyk@example.com', 'Pon', '06:00', '15:00'),
                      ('pawel.krawczyk@example.com', 'Wt', '06:00', '15:00'),
                      ('pawel.krawczyk@example.com', 'Śr', '06:00', '15:00'),
                      ('pawel.krawczyk@example.com', 'Czw', '06:00', '15:00'),
                      ('pawel.krawczyk@example.com', 'Pt', '06:00', '15:00'),
                      ('pawel.krawczyk@example.com', 'Sob', '07:00', '12:00'),

                      ('ewa.mazur@example.com', 'Pon', '10:00', '18:00'),
                      ('ewa.mazur@example.com', 'Wt', '10:00', '18:00'),
                      ('ewa.mazur@example.com', 'Śr', '10:00', '18:00'),
                      ('ewa.mazur@example.com', 'Czw', '10:00', '18:00'),
                      ('ewa.mazur@example.com', 'Pt', '10:00', '16:00'),
                      ('ewa.mazur@example.com', 'Sob', '10:00', '13:00'),

                      ('michal.kowalczyk@example.com', 'Pon', '09:00', '19:00'),
                      ('michal.kowalczyk@example.com', 'Wt', '09:00', '19:00'),
                      ('michal.kowalczyk@example.com', 'Śr', '09:00', '19:00'),
                      ('michal.kowalczyk@example.com', 'Czw', '09:00', '19:00'),
                      ('michal.kowalczyk@example.com', 'Pt', '09:00', '17:00'),

                      ('joanna.krawiec@example.com', 'Wt', '10:00', '19:00'),
                      ('joanna.krawiec@example.com', 'Śr', '10:00', '19:00'),
                      ('joanna.krawiec@example.com', 'Czw', '10:00', '19:00'),
                      ('joanna.krawiec@example.com', 'Pt', '10:00', '19:00'),
                      ('joanna.krawiec@example.com', 'Sob', '09:00', '16:00'),

                      ('adam.piotrowski@example.com', 'Pon', '08:00', '17:00'),
                      ('adam.piotrowski@example.com', 'Wt', '08:00', '17:00'),
                      ('adam.piotrowski@example.com', 'Śr', '08:00', '17:00'),
                      ('adam.piotrowski@example.com', 'Czw', '08:00', '17:00'),
                      ('adam.piotrowski@example.com', 'Pt', '08:00', '17:00'),
                      ('adam.piotrowski@example.com', 'Sob', '09:00', '13:00'),

                      ('natalia.grabowska@example.com', 'Pon', '09:00', '17:00'),
                      ('natalia.grabowska@example.com', 'Wt', '09:00', '17:00'),
                      ('natalia.grabowska@example.com', 'Śr', '09:00', '17:00'),
                      ('natalia.grabowska@example.com', 'Czw', '09:00', '17:00'),
                      ('natalia.grabowska@example.com', 'Pt', '09:00', '15:00'),

                      ('robert.pawlak@example.com', 'Pon', '07:00', '16:00'),
                      ('robert.pawlak@example.com', 'Wt', '07:00', '16:00'),
                      ('robert.pawlak@example.com', 'Śr', '07:00', '16:00'),
                      ('robert.pawlak@example.com', 'Czw', '07:00', '16:00'),
                      ('robert.pawlak@example.com', 'Pt', '07:00', '16:00'),
                      ('robert.pawlak@example.com', 'Sob', '08:00', '13:00'),

                      ('monika.michalska@example.com', 'Pon', '09:00', '17:00'),
                      ('monika.michalska@example.com', 'Wt', '09:00', '17:00'),
                      ('monika.michalska@example.com', 'Śr', '09:00', '17:00'),
                      ('monika.michalska@example.com', 'Czw', '09:00', '17:00'),
                      ('monika.michalska@example.com', 'Pt', '09:00', '14:00'),

                      ('grzegorz.adamczyk@example.com', 'Pon', '08:00', '17:00'),
                      ('grzegorz.adamczyk@example.com', 'Wt', '08:00', '17:00'),
                      ('grzegorz.adamczyk@example.com', 'Śr', '08:00', '17:00'),
                      ('grzegorz.adamczyk@example.com', 'Czw', '08:00', '17:00'),
                      ('grzegorz.adamczyk@example.com', 'Pt', '08:00', '17:00'),
                      ('grzegorz.adamczyk@example.com', 'Sob', '08:00', '14:00'),

                      ('aleksandra.dudek@example.com', 'Czw', '12:00', '20:00'),
                      ('aleksandra.dudek@example.com', 'Pt', '12:00', '20:00'),
                      ('aleksandra.dudek@example.com', 'Sob', '09:00', '20:00'),
                      ('aleksandra.dudek@example.com', 'Nd', '10:00', '18:00'),

                      ('marcin.zajac@example.com', 'Pon', '07:00', '16:00'),
                      ('marcin.zajac@example.com', 'Wt', '07:00', '16:00'),
                      ('marcin.zajac@example.com', 'Śr', '07:00', '16:00'),
                      ('marcin.zajac@example.com', 'Czw', '07:00', '16:00'),
                      ('marcin.zajac@example.com', 'Pt', '07:00', '15:00'),

                      ('patrycja.sikora@example.com', 'Pon', '07:00', '17:00'),
                      ('patrycja.sikora@example.com', 'Wt', '07:00', '17:00'),
                      ('patrycja.sikora@example.com', 'Śr', '07:00', '17:00'),
                      ('patrycja.sikora@example.com', 'Czw', '07:00', '17:00'),
                      ('patrycja.sikora@example.com', 'Pt', '07:00', '17:00'),
                      ('patrycja.sikora@example.com', 'Sob', '08:00',
                       '14:00')) AS a(email, day, start_time, end_time) ON a.email = u.email;

-- ============================================================
-- EXPERIENCE ENTRIES
-- ============================================================
INSERT INTO profile_experience_entries (profile_id,
                                        title,
                                        description,
                                        type,
                                        start_month,
                                        start_year,
                                        end_month,
                                        end_year)
SELECT p.id,
       e.title,
       e.description,
       e.type,
       e.start_month,
       e.start_year,
       e.end_month,
       e.end_year
FROM profiles p
         JOIN users u ON p.user_id = u.id
         JOIN (VALUES
                   -- ============================================================
                   -- JAN KOWALSKI
                   -- ============================================================
                   ('jan.kowalski@example.com',
                    'Elektryk instalacyjny',
                    'Wykonywanie instalacji elektrycznych w budynkach mieszkalnych i usługowych.',
                    'Zatrudnienie', 1, 2015, 6, 2019),

                   ('jan.kowalski@example.com',
                    'Modernizacja instalacji w galerii handlowej',
                    'Kompleksowa modernizacja instalacji elektrycznej wraz z rozdzielniami.',
                    'Duży projekt', 3, 2023, 8, 2023),

                   ('jan.kowalski@example.com',
                    'Instalacja inteligentnego domu',
                    'Projekt i wykonanie instalacji Smart Home.',
                    'Mały projekt', 5, 2024, 6, 2024),

                   -- ============================================================
                   -- ANNA MALINOWSKA
                   -- ============================================================
                   ('anna.malinowska@example.com',
                    'Projektant wnętrz',
                    'Projektowanie mieszkań oraz lokali usługowych.',
                    'Zatrudnienie', 9, 2019, 12, 2022),

                   ('anna.malinowska@example.com',
                    'Projekt apartamentu 90 m²',
                    'Kompletny projekt wraz z wizualizacjami.',
                    'Mały projekt', 2, 2024, 3, 2024),

                   ('anna.malinowska@example.com',
                    'Projekt hotelu butikowego',
                    'Kompleksowy projekt wnętrz hotelowych.',
                    'Duży projekt', 1, 2025, NULL, NULL),

                   -- ============================================================
                   -- PIOTR SZYMAŃSKI
                   -- ============================================================
                   ('piotr.szymanski@example.com',
                    'Hydraulik',
                    'Montaż oraz serwis instalacji wodno-kanalizacyjnych.',
                    'Zatrudnienie', 4, 2016, 8, 2021),

                   ('piotr.szymanski@example.com',
                    'Remont instalacji w kamienicy',
                    'Wymiana pionów wodnych i kanalizacji.',
                    'Duży projekt', 4, 2024, 11, 2024),

                   -- ============================================================
                   -- MAREK ZIELIŃSKI
                   -- ============================================================
                   ('marek.zielinski@example.com',
                    'Glazurnik',
                    'Układanie płytek w budownictwie mieszkaniowym.',
                    'Zatrudnienie', 2, 2012, 5, 2018),

                   ('marek.zielinski@example.com',
                    'Łazienka premium',
                    'Układanie gresu wielkoformatowego.',
                    'Mały projekt', 7, 2024, 8, 2024),

                   -- ============================================================
                   -- KAROLINA WÓJCIK
                   -- ============================================================
                   ('karolina.wojcik@example.com',
                    'Radca prawny',
                    'Obsługa przedsiębiorców oraz sporządzanie umów.',
                    'Zatrudnienie', 10, 2017, NULL, NULL),

                   ('karolina.wojcik@example.com',
                    'Bezpłatne porady prawne',
                    'Wsparcie fundacji pomagającej seniorom.',
                    'Wolontariat', 5, 2023, NULL, NULL),

                   -- ============================================================
                   -- TOMASZ LEWANDOWSKI
                   -- ============================================================
                   ('tomasz.lewandowski@example.com',
                    'Specjalista Helpdesk',
                    'Wsparcie techniczne użytkowników.',
                    'Zatrudnienie', 3, 2018, 7, 2021),

                   ('tomasz.lewandowski@example.com',
                    'Modernizacja sieci biurowej',
                    'Konfiguracja sieci dla 60 stanowisk.',
                    'Duży projekt', 3, 2024, 5, 2024),

                   ('tomasz.lewandowski@example.com',
                    'Serwer NAS dla kancelarii',
                    'Instalacja i konfiguracja kopii zapasowych.',
                    'Mały projekt', 10, 2024, 10, 2024),

                   -- ============================================================
                   -- MAGDALENA NOWAK
                   -- ============================================================
                   ('magdalena.nowak@example.com',
                    'Fryzjerka',
                    'Strzyżenie i koloryzacja klientów salonu.',
                    'Zatrudnienie', 5, 2015, 3, 2021),

                   ('magdalena.nowak@example.com',
                    'Obsługa ślubu',
                    'Stylizacja fryzur dla panny młodej i gości.',
                    'Mały projekt', 6, 2024, 6, 2024),

                   -- ============================================================
                   -- KRZYSZTOF WIŚNIEWSKI
                   -- ============================================================
                   ('krzysztof.wisniewski@example.com',
                    'Mechanik samochodowy',
                    'Diagnostyka oraz naprawa pojazdów.',
                    'Zatrudnienie', 6, 2009, 12, 2018),

                   ('krzysztof.wisniewski@example.com',
                    'Renowacja BMW E46',
                    'Kompleksowa odbudowa samochodu.',
                    'Mały projekt', 4, 2024, 8, 2024),

                   -- ============================================================
                   -- AGNIESZKA KACZMAREK
                   -- ============================================================
                   ('agnieszka.kaczmarek@example.com',
                    'Księgowa',
                    'Obsługa księgowa przedsiębiorstw.',
                    'Zatrudnienie', 1, 2013, 12, 2020),

                   ('agnieszka.kaczmarek@example.com',
                    'Wdrożenie pełnej księgowości',
                    'Uruchomienie systemu księgowego dla spółki.',
                    'Mały projekt', 2, 2024, 3, 2024),

                   -- ============================================================
                   -- PAWEŁ KRAWCZYK
                   -- ============================================================
                   ('pawel.krawczyk@example.com',
                    'Stolarz',
                    'Produkcja mebli na wymiar.',
                    'Zatrudnienie', 7, 2010, 4, 2018),

                   ('pawel.krawczyk@example.com',
                    'Zabudowa kuchni',
                    'Wykonanie mebli pod wymiar.',
                    'Mały projekt', 9, 2024, 10, 2024),

                   -- ============================================================
                   -- EWA MAZUR
                   -- ============================================================
                   ('ewa.mazur@example.com',
                    'Dietetyk',
                    'Konsultacje dietetyczne oraz plany żywieniowe.',
                    'Zatrudnienie', 9, 2021, 8, 2023),

                   -- ============================================================
                   -- MICHAŁ KOWALCZYK
                   -- ============================================================
                   ('michal.kowalczyk@example.com',
                    'Graphic Designer',
                    'Tworzenie materiałów marketingowych.',
                    'Zatrudnienie', 6, 2017, 11, 2020),

                   ('michal.kowalczyk@example.com',
                    'Identyfikacja wizualna restauracji',
                    'Projekt logo oraz materiałów reklamowych.',
                    'Mały projekt', 4, 2024, 5, 2024),

                   -- ============================================================
                   -- JOANNA KRAWIEC
                   -- ============================================================
                   ('joanna.krawiec@example.com',
                    'Kosmetolog',
                    'Zabiegi pielęgnacyjne i estetyczne.',
                    'Zatrudnienie', 3, 2018, 7, 2022),

                   ('joanna.krawiec@example.com',
                    'Dzień urody dla fundacji',
                    'Bezpłatne zabiegi dla podopiecznych fundacji.',
                    'Wolontariat', 10, 2023, 10, 2023),

                   -- ============================================================
                   -- ADAM PIOTROWSKI
                   -- ============================================================
                   ('adam.piotrowski@example.com',
                    'Fizjoterapeuta',
                    'Rehabilitacja pacjentów po urazach oraz zabiegach ortopedycznych.',
                    'Zatrudnienie', 8, 2014, 12, 2020),

                   ('adam.piotrowski@example.com',
                    'Akcja rehabilitacyjna dla seniorów',
                    'Bezpłatne konsultacje i ćwiczenia dla seniorów.',
                    'Wolontariat', 5, 2023, 5, 2023),

                   -- ============================================================
                   -- NATALIA GRABOWSKA
                   -- ============================================================
                   ('natalia.grabowska@example.com',
                    'Architekt',
                    'Projektowanie domów jednorodzinnych oraz budynków usługowych.',
                    'Zatrudnienie', 9, 2011, 5, 2019),

                   ('natalia.grabowska@example.com',
                    'Projekt domu jednorodzinnego',
                    'Kompletny projekt wraz z dokumentacją budowlaną.',
                    'Mały projekt', 4, 2024, 5, 2024),

                   ('natalia.grabowska@example.com',
                    'Osiedle domów jednorodzinnych',
                    'Koordynacja projektu zespołu dwudziestu budynków.',
                    'Duży projekt', 1, 2025, NULL, NULL),

                   -- ============================================================
                   -- ROBERT PAWLAK
                   -- ============================================================
                   ('robert.pawlak@example.com',
                    'Malarz',
                    'Malowanie i wykańczanie wnętrz budynków mieszkalnych.',
                    'Zatrudnienie', 3, 2015, 9, 2021),

                   ('robert.pawlak@example.com',
                    'Malowanie apartamentu',
                    'Kompleksowe malowanie mieszkania 120 m².',
                    'Mały projekt', 8, 2024, 8, 2024),

                   -- ============================================================
                   -- MONIKA MICHALSKA
                   -- ============================================================
                   ('monika.michalska@example.com',
                    'Tłumacz przysięgły',
                    'Tłumaczenia specjalistyczne z języka angielskiego i niemieckiego.',
                    'Zatrudnienie', 4, 2008, 6, 2018),

                   ('monika.michalska@example.com',
                    'Tłumaczenie dokumentacji technicznej',
                    'Tłumaczenie dokumentacji dla producenta maszyn.',
                    'Mały projekt', 3, 2024, 4, 2024),

                   -- ============================================================
                   -- GRZEGORZ ADAMCZYK
                   -- ============================================================
                   ('grzegorz.adamczyk@example.com',
                    'Wulkanizator',
                    'Serwis ogumienia i wyważanie kół.',
                    'Zatrudnienie', 5, 2016, 3, 2022),

                   -- ============================================================
                   -- ALEKSANDRA DUDEK
                   -- ============================================================
                   ('aleksandra.dudek@example.com',
                    'Fotograf',
                    'Realizacja sesji ślubnych, rodzinnych i biznesowych.',
                    'Zatrudnienie', 6, 2019, 12, 2021),

                   ('aleksandra.dudek@example.com',
                    'Reportaż ślubny',
                    'Kompleksowa obsługa fotograficzna wesela.',
                    'Mały projekt', 7, 2024, 7, 2024),

                   -- ============================================================
                   -- MARCIN ZAJĄC
                   -- ============================================================
                   ('marcin.zajac@example.com',
                    'Lakiernik samochodowy',
                    'Lakierowanie elementów karoserii oraz naprawy powypadkowe.',
                    'Zatrudnienie', 2, 2013, 8, 2020),

                   ('marcin.zajac@example.com',
                    'Renowacja klasycznego Mercedesa',
                    'Pełne lakierowanie pojazdu zabytkowego.',
                    'Mały projekt', 6, 2024, 8, 2024),

                   -- ============================================================
                   -- PATRYCJA SIKORA
                   -- ============================================================
                   ('patrycja.sikora@example.com',
                    'Ogrodnik',
                    'Projektowanie oraz pielęgnacja terenów zielonych.',
                    'Zatrudnienie', 4, 2017, 10, 2021),

                   ('patrycja.sikora@example.com',
                    'Projekt ogrodu przydomowego',
                    'Projekt oraz wykonanie ogrodu z automatycznym nawadnianiem.',
                    'Mały projekt', 5, 2024, 6, 2024))
    AS e(
         email,
         title,
         description,
         type,
         start_month,
         start_year,
         end_month,
         end_year
        )
              ON e.email = u.email;
;

-- ============================================================
-- RATINGS
-- ============================================================
-- ============================================================
-- RATINGS (uzupełnione: 2 opinie dla każdego specjalisty)
-- ============================================================

INSERT INTO ratings (id, specialist_id, author_id, quality, price, timeliness, comment, created_at)
VALUES (101, 1, 2, 5, 5, 4, 'Ekipa spisała się znakomicie podczas wykończenia salonu. Kafelki ułożone równo.', NOW()),
       (102, 1, 3, 4, 3, 5, 'Remont łazienki przebiegł szybko, hydraulika działa bez zarzutu. Polecam!', NOW()),

       -- ===================== 1. JAN KOWALSKI =====================
       (103, 1, 2, 5, 5, 5, 'Bardzo szybka reakcja na awarię. Instalacja wykonana profesjonalnie.', NOW()),
       (104, 1, 3, 4, 5, 4, 'Dobra jakość usług, wszystko działa bez zarzutu.', NOW()),

       -- ===================== 2. ANNA MALINOWSKA =====================
       (105, 2, 3, 5, 4, 5, 'Świetny projekt wnętrza, bardzo funkcjonalny układ mieszkania.', NOW()),
       (106, 2, 4, 4, 4, 5, 'Dobry kontakt i estetyczne rozwiązania, polecam.', NOW()),

       -- ===================== 3. PIOTR SZYMAŃSKI =====================
       (107, 3, 4, 5, 5, 5, 'Szybka naprawa instalacji, wszystko działa idealnie.', NOW()),
       (108, 3, 5, 4, 4, 4, 'Solidna robota, dobry fachowiec.', NOW()),

       -- ===================== 4. MAREK ZIELIŃSKI =====================
       (109, 4, 5, 5, 5, 5, 'Płytki ułożone perfekcyjnie, bardzo dokładna praca.', NOW()),
       (110, 4, 6, 4, 4, 5, 'Estetyczne wykończenie łazienki, polecam.', NOW()),

       -- ===================== 5. KAROLINA WÓJCIK =====================
       (111, 5, 6, 5, 4, 5, 'Bardzo rzetelna pomoc prawna, szybka analiza sprawy.', NOW()),
       (112, 5, 7, 4, 5, 4, 'Profesjonalne podejście i dobre wyjaśnienia.', NOW()),

       -- ===================== 6. TOMASZ LEWANDOWSKI =====================
       (113, 6, 7, 5, 5, 5, 'Sprawnie skonfigurowana sieć, zero problemów.', NOW()),
       (114, 6, 8, 4, 4, 5, 'Dobry specjalista IT, szybka pomoc.', NOW()),

       -- ===================== 7. MAGDALENA NOWAK =====================
       (115, 7, 8, 5, 5, 5, 'Super fryzura, dokładnie jak chciałam.', NOW()),
       (116, 7, 9, 4, 4, 4, 'Miła obsługa i dobry efekt końcowy.', NOW()),

       -- ===================== 8. KRZYSZTOF WIŚNIEWSKI =====================
       (117, 8, 9, 5, 5, 5, 'Naprawa auta wykonana szybko i solidnie.', NOW()),
       (118, 8, 10, 4, 4, 5, 'Dobry mechanik, uczciwe podejście.', NOW()),

       -- ===================== 9. AGNIESZKA KACZMAREK =====================
       (119, 9, 10, 5, 5, 5, 'Pełna księgowość wdrożona bez problemów.', NOW()),
       (120, 9, 11, 4, 4, 4, 'Bardzo kompetentna księgowa.', NOW()),

       -- ===================== 10. PAWEŁ KRAWCZYK =====================
       (121, 10, 11, 5, 5, 5, 'Meble wykonane bardzo solidnie i estetycznie.', NOW()),
       (122, 10, 12, 4, 4, 5, 'Terminowo i zgodnie z projektem.', NOW()),

       -- ===================== 11. EWA MAZUR =====================
       (123, 11, 12, 5, 5, 5, 'Świetne podejście dietetyczne, duża wiedza.', NOW()),
       (124, 11, 13, 4, 4, 4, 'Dieta dopasowana idealnie do potrzeb.', NOW()),

       -- ===================== 12. MICHAŁ KOWALCZYK =====================
       (125, 12, 13, 5, 5, 5, 'Logo i identyfikacja wizualna na najwyższym poziomie.', NOW()),
       (126, 12, 14, 4, 4, 5, 'Kreatywny grafik, dobry kontakt.', NOW()),

       -- ===================== 13. JOANNA KRAWIEC =====================
       (127, 13, 14, 5, 5, 5, 'Zabiegi bardzo profesjonalne, świetny efekt.', NOW()),
       (128, 13, 15, 4, 4, 4, 'Miła atmosfera i dobre doradztwo.', NOW()),

       -- ===================== 14. ADAM PIOTROWSKI =====================
       (129, 14, 15, 5, 5, 5, 'Rehabilitacja bardzo skuteczna, szybka poprawa.', NOW()),
       (130, 14, 16, 4, 4, 5, 'Profesjonalny fizjoterapeuta.', NOW()),

       -- ===================== 15. NATALIA GRABOWSKA =====================
       (131, 15, 16, 5, 5, 5, 'Projekt domu dopracowany w każdym detalu.', NOW()),
       (132, 15, 17, 4, 4, 5, 'Bardzo dobry kontakt i świetne pomysły.', NOW()),

       -- ===================== 16. ROBERT PAWLAK =====================
       (133, 16, 17, 5, 5, 5, 'Malowanie wykonane bardzo starannie.', NOW()),
       (134, 16, 18, 4, 4, 4, 'Szybko i czysto wykonana praca.', NOW()),

       -- ===================== 17. MONIKA MICHALSKA =====================
       (135, 17, 18, 5, 5, 5, 'Tłumaczenie bardzo dokładne i profesjonalne.', NOW()),
       (136, 17, 19, 4, 4, 5, 'Świetna jakość tłumaczeń specjalistycznych.', NOW()),

       -- ===================== 18. GRZEGORZ ADAMCZYK =====================
       (137, 18, 19, 5, 5, 5, 'Szybka wymiana opon, bardzo sprawnie.', NOW()),
       (138, 18, 20, 4, 4, 4, 'Dobry serwis, wszystko w porządku.', NOW()),

       -- ===================== 19. ALEKSANDRA DUDEK =====================
       (139, 19, 20, 5, 5, 5, 'Piękne zdjęcia ślubne, super jakość.', NOW()),
       (140, 19, 21, 4, 4, 5, 'Bardzo profesjonalna sesja zdjęciowa.', NOW()),

       -- ===================== 20. MARCIN ZAJĄC =====================
       (141, 20, 21, 5, 5, 5, 'Lakierowanie auta wykonane perfekcyjnie.', NOW()),
       (142, 20, 1, 4, 4, 4, 'Solidna naprawa i dobry efekt końcowy.', NOW()),

       -- ===================== 21. PATRYCJA SIKORA =====================
       (143, 21, 2, 5, 5, 5, 'Piękny projekt ogrodu, bardzo estetyczny efekt.', NOW()),
       (144, 21, 3, 4, 4, 5, 'Fachowe podejście i dobry kontakt z klientem.', NOW()),

       -- ===================== NEGATIVE OPINIONS =====================
       (145, 2, 5, 3, 2, 3, 'Projekt wykonany poprawnie, ale komunikacja mogłaby być szybsza.', NOW()),
       (146, 2, 6, 2, 3, 2, 'Efekt końcowy w porządku, ale brakowało kilku ustaleń na etapie projektu.', NOW()),

       (147, 5, 7, 3, 2, 2, 'Pomoc prawna poprawna, ale czas oczekiwania na odpowiedź był długi.', NOW()),
       (148, 5, 8, 2, 2, 3, 'Sprawa załatwiona, jednak wymagała kilku poprawek w dokumentach.', NOW()),

       (149, 8, 9, 3, 3, 2, 'Naprawa auta skuteczna, ale pojawiły się dodatkowe koszty.', NOW()),
       (150, 8, 10, 2, 3, 2, 'Usługa wykonana, jednak musiałem wrócić na poprawkę.', NOW()),

       (151, 11, 12, 3, 2, 2, 'Plan dietetyczny działa częściowo, ale nie spełnił wszystkich oczekiwań.', NOW()),
       (152, 11, 13, 2, 3, 2, 'Konsultacja poprawna, ale brak indywidualnego podejścia.', NOW()),

       (153, 15, 14, 3, 2, 3, 'Projekt domu ok, ale wymagał kilku istotnych zmian.', NOW()),
       (154, 15, 16, 2, 2, 2, 'Kontakt dobry, ale dokumentacja nie była kompletna.', NOW()),

       (155, 19, 17, 3, 3, 2, 'Sesja zdjęciowa poprawna, ale mało różnorodnych ujęć.', NOW()),
       (156, 19, 18, 2, 2, 3, 'Zdjęcia w porządku, jednak obróbka mogłaby być lepsza.', NOW());

INSERT INTO rating_images (rating_id, url)
VALUES (101, '/images/samples/review_tiles_1.jpg'),
       (101, '/images/samples/review_tiles_2.jpg'),
       (102, '/images/samples/review_bathroom.jpg');

COMMIT;