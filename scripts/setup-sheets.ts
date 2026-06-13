import { config } from 'dotenv'
import path from 'path'
config({ path: path.resolve(process.cwd(), '.env.local') })

import { ensureSheetHeaders } from '../lib/sheets'

async function main() {
  console.log('Configurando cabeçalhos da planilha...')
  await ensureSheetHeaders()
  console.log('✓ Cabeçalhos criados com sucesso!')
}

main().catch((err) => {
  console.error('Erro:', err.message)
  process.exit(1)
})
