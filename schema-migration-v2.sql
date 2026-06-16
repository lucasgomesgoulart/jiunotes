-- Migration: adiciona professor_id em alunos e aulas
-- Rode isto DEPOIS de rodar schema.sql
-- Se você já tem dados, isso vai manter tudo e apenas adicionar a coluna

alter table alunos add column professor_id text not null default 'jiu123';
alter table aulas add column professor_id text not null default 'jiu123';

-- Opcional: se quiser ver o resultado
-- select id, nome, professor_id from alunos;
-- select id, data, professor_id from aulas;
