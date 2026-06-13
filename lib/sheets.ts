import { google } from 'googleapis'
import { Aluno, Aula, Faixa, Presenca, TipoAula, CategoriaAula } from '@/types'

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() })
}

// Converte serial do Google Sheets (ex: 46181) para ISO date (YYYY-MM-DD)
function normalizeDate(value: string | undefined): string {
  if (!value) return ''
  const num = Number(value)
  if (!isNaN(num) && num > 40000) {
    const date = new Date((num - 25569) * 86400 * 1000)
    return date.toISOString().split('T')[0]
  }
  return value
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!

function hojeEmBrasilia(): string {
  return new Date().toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).split('/').reverse().join('-') // YYYY-MM-DD
}

// Garantir cabeçalhos na primeira chamada de cada aba
async function ensureHeaders(
  sheets: ReturnType<typeof getSheets>,
  tab: string,
  headers: string[]
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tab}!A1`,
  })
  const firstCell = res.data.values?.[0]?.[0]
  if (firstCell === headers[0]) return // cabeçalhos já existem
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tab}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [headers] },
  })
}

// ─── Alunos ───────────────────────────────────────────────────────────────────

export async function getAlunos(): Promise<Aluno[]> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alunos!A2:F',
  })
  const rows = res.data.values ?? []
  return rows
    .filter((r) => r[0] && r[0] !== 'ID')
    .map((r) => ({
      id: r[0],
      nome: r[1] ?? '',
      faixa: (r[2] ?? 'Branca') as Faixa,
      graus: Number(r[3] ?? 0),
      dataNascimento: normalizeDate(r[4]),
      status: (r[5] ?? 'Ativo') as 'Ativo' | 'Inativo',
    }))
}

export async function createAluno(data: Omit<Aluno, 'id'>): Promise<Aluno> {
  const sheets = getSheets()
  await ensureHeaders(sheets, 'Alunos', ['ID', 'Nome', 'Faixa', 'Graus', 'DataNascimento', 'Status'])

  const id = crypto.randomUUID()
  // Usar A:A como âncora evita o bug do Google Sheets de deslocar colunas
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alunos!A:A',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[id, data.nome, data.faixa, data.graus, data.dataNascimento ?? '', data.status]],
    },
  })
  return { id, ...data }
}

export async function updateAluno(id: string, data: Partial<Omit<Aluno, 'id'>>): Promise<void> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alunos!A:A',
  })
  const ids = (res.data.values ?? []).flat()
  const rowIndex = ids.indexOf(id)
  if (rowIndex === -1) throw new Error(`Aluno ${id} não encontrado`)

  const existing = await getAlunos()
  const aluno = existing.find((a) => a.id === id)
  if (!aluno) throw new Error(`Aluno ${id} não encontrado`)
  const merged = { ...aluno, ...data }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Alunos!A${rowIndex + 1}:F${rowIndex + 1}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[merged.id, merged.nome, merged.faixa, merged.graus, merged.dataNascimento ?? '', merged.status]],
    },
  })
}

// ─── Aulas ────────────────────────────────────────────────────────────────────

export async function getAulas(): Promise<Aula[]> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Aulas!A2:E',
  })
  const rows = res.data.values ?? []
  return rows
    .filter((r) => r[0] && r[0] !== 'ID')
    .map((r) => ({
      id: r[0],
      data: normalizeDate(r[1]),
      tipo: (r[2] ?? 'Kimono') as TipoAula,
      conteudoPrincipal: r[3] ?? '',
      categoria: (r[4] ?? 'Outro') as CategoriaAula,
    }))
}

export async function createAula(data: Omit<Aula, 'id'>): Promise<Aula> {
  const sheets = getSheets()
  await ensureHeaders(sheets, 'Aulas', ['ID', 'Data', 'Tipo', 'ConteudoPrincipal', 'Categoria'])

  const id = crypto.randomUUID()
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Aulas!A:A',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[id, data.data, data.tipo, data.conteudoPrincipal, data.categoria]],
    },
  })
  return { id, ...data }
}

// ─── Presenças ────────────────────────────────────────────────────────────────

export async function getAllPresencas(): Promise<Presenca[]> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Presencas!A2:C',
  })
  const rows = res.data.values ?? []
  return rows
    .filter((r) => r[0] && r[1])
    .map((r) => ({ id: r[0], idAula: r[1], idAluno: r[2] }))
}

export async function getPresencasByAula(idAula: string): Promise<Presenca[]> {
  const all = await getAllPresencas()
  return all.filter((p) => p.idAula === idAula)
}

export async function createPresencas(idAula: string, idAlunos: string[]): Promise<void> {
  if (idAlunos.length === 0) return
  const sheets = getSheets()
  await ensureHeaders(sheets, 'Presencas', ['ID', 'ID_Aula', 'ID_Aluno'])

  const rows = idAlunos.map((idAluno) => [crypto.randomUUID(), idAula, idAluno])
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Presencas!A:A',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  })
}

export async function deleteAluno(id: string): Promise<void> {
  const sheets = getSheets()

  const colRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alunos!A:A',
  })
  const ids = (colRes.data.values ?? []).flat()
  const rowIndex = ids.indexOf(id) // 0-based
  if (rowIndex === -1) throw new Error(`Aluno ${id} não encontrado`)

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties',
  })
  const sheetId = meta.data.sheets?.find(
    (s) => s.properties?.title === 'Alunos'
  )?.properties?.sheetId

  if (sheetId === undefined) throw new Error('Aba Alunos não encontrada')

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 },
        },
      }],
    },
  })
}

export async function deleteAula(id: string): Promise<void> {
  const sheets = getSheets()

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties',
  })
  const sheetProps = meta.data.sheets?.map((s) => s.properties) ?? []

  const aulasSheetId = sheetProps.find((p) => p?.title === 'Aulas')?.sheetId
  const presencasSheetId = sheetProps.find((p) => p?.title === 'Presencas')?.sheetId

  if (aulasSheetId === undefined) throw new Error('Aba Aulas não encontrada')

  // Encontra a linha da aula
  const colRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Aulas!A:A',
  })
  const ids = (colRes.data.values ?? []).flat()
  const rowIndex = ids.indexOf(id)
  if (rowIndex === -1) throw new Error(`Aula ${id} não encontrada`)

  // Deleta a aula e as presenças associadas em paralelo
  const requests: object[] = [
    { deleteDimension: { range: { sheetId: aulasSheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 } } },
  ]

  if (presencasSheetId !== undefined) {
    const presRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Presencas!A:B',
    })
    const presRows = presRes.data.values ?? []
    // Coleta índices das linhas de presença dessa aula (ordem decrescente para não deslocar índices)
    const presRowIndexes = presRows
      .map((r, i) => (r[1] === id ? i : -1))
      .filter((i) => i !== -1)
      .sort((a, b) => b - a)

    for (const i of presRowIndexes) {
      requests.push({ deleteDimension: { range: { sheetId: presencasSheetId, dimension: 'ROWS', startIndex: i, endIndex: i + 1 } } })
    }
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests },
  })
}

export async function getUltimasAulas(limit = 10): Promise<Aula[]> {
  const aulas = await getAulas()
  return aulas.sort((a, b) => b.data.localeCompare(a.data)).slice(0, limit)
}

// ─── Config (limite IA) ───────────────────────────────────────────────────────

export async function getIAUsosHoje(): Promise<number> {
  const sheets = getSheets()
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Config!A1:B1',
    })
    const row = res.data.values?.[0]
    if (!row) return 0
    return row[0] === hojeEmBrasilia() ? Number(row[1] ?? 0) : 0
  } catch {
    return 0
  }
}

export async function incrementIAUsos(): Promise<number> {
  const sheets = getSheets()
  const hoje = hojeEmBrasilia()
  const atual = await getIAUsosHoje()
  const novo = atual + 1
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Config!A1:B1',
    valueInputOption: 'RAW',
    requestBody: { values: [[hoje, novo]] },
  })
  return novo
}

// Mantido para uso manual via script
export async function ensureSheetHeaders(): Promise<void> {
  const sheets = getSheets()
  await ensureHeaders(sheets, 'Alunos', ['ID', 'Nome', 'Faixa', 'Graus', 'DataNascimento', 'Status'])
  await ensureHeaders(sheets, 'Aulas', ['ID', 'Data', 'Tipo', 'ConteudoPrincipal', 'Categoria'])
  await ensureHeaders(sheets, 'Presencas', ['ID', 'ID_Aula', 'ID_Aluno'])
}
