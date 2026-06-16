import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { Aluno, Aula, AulaComPresencas, Graduacao, Presenca } from '@/types'

/**
 * Camada de dados — Postgres (Neon, serverless).
 *
 * Substitui a antiga camada de Google Sheets mantendo EXATAMENTE as mesmas
 * assinaturas de função, para que as rotas em `app/api/*` não mudem.
 *
 * Datas são guardadas como `text` no formato ISO 'YYYY-MM-DD' — o app inteiro já
 * trata datas como string, então não há conversão de serial nem fuso horário.
 *
 * A connection string vem de `DATABASE_URL` (use a versão "pooled" do Neon).
 * O cliente é criado sob demanda (lazy) para não quebrar o build quando a env
 * ainda não está configurada.
 */
let _sql: NeonQueryFunction<false, false> | null = null
function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada')
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

function hojeEmBrasilia(): string {
  return new Date()
    .toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
    .split('/').reverse().join('-') // YYYY-MM-DD
}

// ─── Alunos ───────────────────────────────────────────────────────────────────

export async function getAlunos(): Promise<Aluno[]> {
  const sql = getSql()
  const rows = await sql`
    select id, nome, faixa, graus,
           coalesce(data_nascimento, '') as "dataNascimento", status, professor_id as "professorId"
    from alunos
    order by nome`
  return rows as Aluno[]
}

export async function createAluno(data: Omit<Aluno, 'id'>): Promise<Aluno> {
  const sql = getSql()
  const [row] = await sql`
    insert into alunos (nome, faixa, graus, data_nascimento, status, professor_id)
    values (${data.nome}, ${data.faixa}, ${data.graus}, ${data.dataNascimento || null}, ${data.status}, ${data.professorId})
    returning id`
  return { id: row.id, ...data }
}

export async function updateAluno(id: string, data: Partial<Omit<Aluno, 'id'>>): Promise<void> {
  const sql = getSql()
  const [aluno] = await sql`
    select id, nome, faixa, graus,
           coalesce(data_nascimento, '') as "dataNascimento", status, professor_id as "professorId"
    from alunos where id = ${id}`
  if (!aluno) throw new Error(`Aluno ${id} não encontrado`)
  const m = { ...(aluno as Aluno), ...data }
  await sql`
    update alunos
    set nome = ${m.nome}, faixa = ${m.faixa}, graus = ${m.graus},
        data_nascimento = ${m.dataNascimento || null}, status = ${m.status}, professor_id = ${m.professorId}
    where id = ${id}`
}

export async function deleteAluno(id: string): Promise<void> {
  const sql = getSql()
  // presenças e graduações somem por ON DELETE CASCADE
  await sql`delete from alunos where id = ${id}`
}

// ─── Aulas ────────────────────────────────────────────────────────────────────

export async function getAulas(professorId?: string): Promise<Aula[]> {
  const sql = getSql()
  const rows = professorId
    ? await sql`
        select id, data, tipo,
               conteudo_principal as "conteudoPrincipal", categoria, professor_id as "professorId"
        from aulas
        where professor_id = ${professorId}
        order by data desc`
    : await sql`
        select id, data, tipo,
               conteudo_principal as "conteudoPrincipal", categoria, professor_id as "professorId"
        from aulas
        order by data desc`
  return rows as Aula[]
}

export async function createAula(data: Omit<Aula, 'id'>): Promise<Aula> {
  const sql = getSql()
  const [row] = await sql`
    insert into aulas (data, tipo, conteudo_principal, categoria, professor_id)
    values (${data.data}, ${data.tipo}, ${data.conteudoPrincipal}, ${data.categoria}, ${data.professorId})
    returning id`
  return { id: row.id, ...data }
}

export async function getAulaComPresencas(id: string): Promise<AulaComPresencas | null> {
  const sql = getSql()
  const [aula] = await sql`
    select id, data, tipo,
           conteudo_principal as "conteudoPrincipal", categoria, professor_id as "professorId"
    from aulas where id = ${id}`
  if (!aula) return null
  const pres = await sql`select id_aluno from presencas where id_aula = ${id}`
  return { ...(aula as Aula), presencas: pres.map((p) => p.id_aluno) }
}

export async function updateAula(id: string, data: Partial<Omit<Aula, 'id'>>): Promise<void> {
  const sql = getSql()
  const [aula] = await sql`
    select id, data, tipo,
           conteudo_principal as "conteudoPrincipal", categoria, professor_id as "professorId"
    from aulas where id = ${id}`
  if (!aula) throw new Error(`Aula ${id} não encontrada`)
  const m = { ...(aula as Aula), ...data }
  await sql`
    update aulas
    set data = ${m.data}, tipo = ${m.tipo},
        conteudo_principal = ${m.conteudoPrincipal}, categoria = ${m.categoria}, professor_id = ${m.professorId}
    where id = ${id}`
}

export async function deleteAula(id: string): Promise<void> {
  const sql = getSql()
  // presenças somem por ON DELETE CASCADE
  await sql`delete from aulas where id = ${id}`
}

export async function getUltimasAulas(limit = 10, professorId?: string): Promise<Aula[]> {
  const sql = getSql()
  const rows = professorId
    ? await sql`
        select id, data, tipo,
               conteudo_principal as "conteudoPrincipal", categoria, professor_id as "professorId"
        from aulas
        where professor_id = ${professorId}
        order by data desc
        limit ${limit}`
    : await sql`
        select id, data, tipo,
               conteudo_principal as "conteudoPrincipal", categoria, professor_id as "professorId"
        from aulas
        order by data desc
        limit ${limit}`
  return rows as Aula[]
}

// ─── Presenças ────────────────────────────────────────────────────────────────

export async function getAllPresencas(): Promise<Presenca[]> {
  const sql = getSql()
  const rows = await sql`
    select id, id_aula as "idAula", id_aluno as "idAluno" from presencas`
  return rows as Presenca[]
}

export async function getPresencasByAula(idAula: string): Promise<Presenca[]> {
  const sql = getSql()
  const rows = await sql`
    select id, id_aula as "idAula", id_aluno as "idAluno"
    from presencas where id_aula = ${idAula}`
  return rows as Presenca[]
}

export async function createPresencas(idAula: string, idAlunos: string[]): Promise<void> {
  if (idAlunos.length === 0) return
  const sql = getSql()
  await sql.transaction(
    idAlunos.map((idAluno) => sql`
      insert into presencas (id_aula, id_aluno) values (${idAula}, ${idAluno})`)
  )
}

// Substitui todas as presenças de uma aula pelo novo conjunto de alunos (atômico)
export async function setPresencas(idAula: string, idAlunos: string[]): Promise<void> {
  const sql = getSql()
  const queries = [sql`delete from presencas where id_aula = ${idAula}`]
  for (const idAluno of idAlunos) {
    queries.push(sql`insert into presencas (id_aula, id_aluno) values (${idAula}, ${idAluno})`)
  }
  await sql.transaction(queries)
}

// ─── Graduações ─────────────────────────────────────────────────────────────────

export async function getGraduacoes(idAluno?: string): Promise<Graduacao[]> {
  const sql = getSql()
  const rows = idAluno
    ? await sql`
        select id_aluno as "idAluno", faixa, graus, data, coalesce(label, '') as label
        from graduacoes where id_aluno = ${idAluno} order by data desc`
    : await sql`
        select id_aluno as "idAluno", faixa, graus, data, coalesce(label, '') as label
        from graduacoes order by data desc`
  return rows as Graduacao[]
}

export async function createGraduacao(g: Graduacao): Promise<void> {
  const sql = getSql()
  await sql`
    insert into graduacoes (id_aluno, faixa, graus, data, label)
    values (${g.idAluno}, ${g.faixa}, ${g.graus}, ${g.data}, ${g.label})`
}

// ─── Config (limite IA) ───────────────────────────────────────────────────────

export async function getIAUsosHoje(): Promise<number> {
  const sql = getSql()
  const hoje = hojeEmBrasilia()
  const [row] = await sql`select total from ia_usos where dia = ${hoje}`
  return row ? Number(row.total) : 0
}

export async function incrementIAUsos(): Promise<number> {
  const sql = getSql()
  const hoje = hojeEmBrasilia()
  const [row] = await sql`
    insert into ia_usos (dia, total) values (${hoje}, 1)
    on conflict (dia) do update set total = ia_usos.total + 1
    returning total`
  return Number(row.total)
}

// ─── Setup (cria tabelas) ───────────────────────────────────────────────────────
// Opcional. Idempotente. Alternativa recomendada: colar `schema.sql` no SQL
// Editor do painel do Neon.
export async function initDb(): Promise<void> {
  const sql = getSql()
  await sql`create extension if not exists pgcrypto`
  await sql`
    create table if not exists alunos (
      id uuid primary key default gen_random_uuid(),
      nome text not null,
      faixa text not null default 'Branca',
      graus int not null default 0,
      data_nascimento text,
      status text not null default 'Ativo',
      professor_id text not null default 'jiu123'
    )`
  await sql`
    create table if not exists aulas (
      id uuid primary key default gen_random_uuid(),
      data text not null,
      tipo text not null default 'Kimono',
      conteudo_principal text not null default '',
      categoria text not null default 'Outro',
      professor_id text not null default 'jiu123'
    )`
  await sql`
    create table if not exists presencas (
      id uuid primary key default gen_random_uuid(),
      id_aula uuid not null references aulas(id) on delete cascade,
      id_aluno uuid not null references alunos(id) on delete cascade
    )`
  await sql`
    create table if not exists graduacoes (
      id uuid primary key default gen_random_uuid(),
      id_aluno uuid not null references alunos(id) on delete cascade,
      faixa text not null,
      graus int not null default 0,
      data text not null,
      label text not null default ''
    )`
  await sql`
    create table if not exists ia_usos (
      dia text primary key,
      total int not null default 0
    )`
}
