-- JiuNotes — schema Postgres (Neon)
-- Cole isto no SQL Editor do painel do Neon e rode uma vez.
-- Datas são TEXT no formato ISO 'YYYY-MM-DD' (o app trata tudo como string).

create extension if not exists pgcrypto;

create table if not exists alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  faixa text not null default 'Branca',
  graus int not null default 0,
  data_nascimento text,
  status text not null default 'Ativo'
);

create table if not exists aulas (
  id uuid primary key default gen_random_uuid(),
  data text not null,
  tipo text not null default 'Kimono',
  conteudo_principal text not null default '',
  categoria text not null default 'Outro'
);

create table if not exists presencas (
  id uuid primary key default gen_random_uuid(),
  id_aula uuid not null references aulas(id) on delete cascade,
  id_aluno uuid not null references alunos(id) on delete cascade
);

create table if not exists graduacoes (
  id uuid primary key default gen_random_uuid(),
  id_aluno uuid not null references alunos(id) on delete cascade,
  faixa text not null,
  graus int not null default 0,
  data text not null,
  label text not null default ''
);

create table if not exists ia_usos (
  dia text primary key,
  total int not null default 0
);
