CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    author TEXT NOT NULL,
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    ingredients TEXT[] NOT NULL,
    steps TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    recipes INTEGER NOT NULL,
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL
);

INSERT INTO recipes (id, name, created_date, updated_date, ingredients, author, steps, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Spaghetti Bolognese', '2023-01-01 12:00:00', '2023-01-01 12:00:00', '{"spaghetti", "mielone mięso", "sos pomidorowy"}', 'Jan Kowalski', '{"Ugotuj spaghetti", "Usmaż mięso", "Wymieszaj z sosem"}', 'Klasyczne włoskie danie makaronowe.'),
('123e4567-e89b-12d3-a456-426614174000', 'Kurczak Curry', '2023-01-02 12:00:00', '2023-01-02 12:00:00', '{"kurczak", "przyprawa curry", "mleko kokosowe"}', 'Anna Nowak', '{"Usmaż kurczaka", "Dodaj przyprawę curry", "Wlej mleko kokosowe"}', 'Pikantne i aromatyczne curry.'),
('9b2e4d6c-8f3b-4a2e-9f3b-4a2e9f3b4a2e', 'Tacos z Wołowiną', '2023-01-03 12:00:00', '2023-01-03 12:00:00', '{"tortille", "mielona wołowina", "sałata", "ser"}', 'Carlos Mendez', '{"Usmaż wołowinę", "Złóż tacos", "Podaj z dodatkami"}', 'Pyszne meksykańskie tacos.'),
('1b4e28ba-2fa1-11d2-883f-0016d3cca427', 'Warzywne Stir Fry', '2023-01-04 12:00:00', '2023-01-04 12:00:00', '{"brokuły", "marchewki", "papryki", "sos sojowy"}', 'Alicja Kowalska', '{"Pokrój warzywa", "Smaż z sosem sojowym", "Podaj na gorąco"}', 'Zdrowe i szybkie stir fry.'),
('6fa459ea-ee8a-3ca4-894e-db77e160355e', 'Naleśniki', '2023-01-05 12:00:00', '2023-01-05 12:00:00', '{"mąka", "mleko", "jajka", "syrop"}', 'Robert Brązowy', '{"Wymieszaj składniki", "Smaż na patelni", "Podaj z syropem"}', 'Puszyste naleśniki na śniadanie.') ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, recipes, created_date, updated_date) VALUES
('c56a4180-65aa-42ec-a945-5fd21dec0538', 'John Doe', 5, '2023-01-01 12:00:00', '2023-01-01 12:00:00'),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Jane Smith', 3, '2023-01-02 12:00:00', '2023-01-02 12:00:00') ON CONFLICT (id) DO NOTHING;