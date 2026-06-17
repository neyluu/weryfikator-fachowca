BEGIN;

INSERT INTO users (full_name, email, password_hash, role, created_at, updated_at)
VALUES
  ('Jan Kowalski',    'jan.kowalski@example.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SPECIALIST', NOW(), NOW()),
  ('Anna Malinowska', 'anna.malinowska@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SPECIALIST', NOW(), NOW()),
  ('Piotr Szymański', 'piotr.szymanski@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SPECIALIST', NOW(), NOW()),
  ('Marek Zieliński', 'marek.zielinski@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SPECIALIST', NOW(), NOW()),
  ('Karolina Wójcik', 'karolina.wojcik@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SPECIALIST', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (
    specialization, description, experience, city, voivodeship,
    phone_number, email,
    consultation_enabled, consultation_min, consultation_max,
    hourly_enabled,       hourly_min,       hourly_max,
    project_enabled,      project_min,      project_max,
    created_at, updated_at, user_id
)
VALUES
  (
    'Elektryk',
    lo_from_bytea(0, 'Wykonuję kompleksowe instalacje elektryczne oraz usuwam nagłe awarie. Wieloletnie doświadczenie i uprawnienia SEP.'::bytea),
    '10 lat', 'Warszawa', 'mazowieckie', '123456789', 'jan.kowalski@example.com',
    false, 0, 0,   true, 150, 200,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'jan.kowalski@example.com')
  ),
  (
    'Projektantka wnętrz',
    lo_from_bytea(0, 'Tworzę funkcjonalne i estetyczne projekty mieszkań oraz lokali usługowych. Pomagam w doborze materiałów.'::bytea),
    '5 lat', 'Kraków', 'małopolskie', '987654321', 'anna.malinowska@example.com',
    true, 250, 300,   false, 0, 0,   true, 2000, 5000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'anna.malinowska@example.com')
  ),
  (
    'Hydraulik',
    lo_from_bytea(0, 'Szybkie naprawy i instalacje wodno-kanalizacyjne. Dostępność 24/7 w nagłych przypadkach.'::bytea),
    '8 lat', 'Łódź', 'łódzkie', '111222333', 'piotr.szymanski@example.com',
    false, 0, 0,   true, 120, 180,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'piotr.szymanski@example.com')
  ),
  (
    'Glazurnik',
    lo_from_bytea(0, 'Precyzyjne układanie płytek, gresu i terakoty. Dokładność i terminowość to moje priorytety.'::bytea),
    '12 lat', 'Poznań', 'wielkopolskie', '444555666', 'marek.zielinski@example.com',
    false, 0, 0,   false, 0, 0,   true, 800, 3000,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'marek.zielinski@example.com')
  ),
  (
    'Prawnik',
    lo_from_bytea(0, 'Specjalizuję się w prawie gospodarczym i cywilnym. Sporządzam umowy, reprezentuję klientów w sądzie.'::bytea),
    '7 lat', 'Warszawa', 'mazowieckie', '777888999', 'karolina.wojcik@example.com',
    true, 300, 500,   true, 250, 350,   false, 0, 0,
    NOW(), NOW(), (SELECT id FROM users WHERE email = 'karolina.wojcik@example.com')
  );

INSERT INTO profile_categories (profile_id, categories)
VALUES
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'jan.kowalski@example.com'),    'Elektryka'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'jan.kowalski@example.com'),    'Instalacja elektryczna'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'anna.malinowska@example.com'), 'Grafika'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'anna.malinowska@example.com'), 'Remont mieszkania'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'piotr.szymanski@example.com'), 'Hydraulika'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'piotr.szymanski@example.com'), 'Remont mieszkania'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'marek.zielinski@example.com'), 'Glazurnictwo'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'marek.zielinski@example.com'), 'Remont mieszkania'),
  ((SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'karolina.wojcik@example.com'), 'Prawo');

COMMIT;