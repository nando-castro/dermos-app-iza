import data from '../data/clinica_dermos.json'
import type { Procedure } from '../types'

function slug(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function makeId(category: string, name: string, doctor?: string) {
  return `${slug(category)}-${slug(doctor ?? '')}-${slug(name)}`
}

export function parseProcedures(): Procedure[] {
  const result: Procedure[] = []

  // Tabela geral
  for (const item of data.tabela_geral) {
    result.push({
      id: makeId('geral', item.procedimento),
      name: item.procedimento,
      value: item.valor,
      note: (item as any).observacao,
      category: 'Tabela Geral',
    })
  }

  // Médicos
  for (const [key, doc] of Object.entries(data.medicos)) {
    const doctorName = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())

    for (const item of (doc as any).procedimentos) {
      result.push({
        id: makeId('medico', item.procedimento, doctorName),
        name: item.procedimento,
        value: item.valor,
        note: item.observacao,
        category: 'Médicos',
        doctor: doctorName,
      })
    }
  }

  // Laser Chrome
  for (const item of data.laser_chrome) {
    result.push({
      id: makeId('laser-chrome', item.protocolo),
      name: item.protocolo,
      value: item.valor,
      category: 'Laser Chrome',
    })
  }

  // Lipolifting
  for (const item of data.lipolifting) {
    result.push({
      id: makeId('lipolifting', item.area),
      name: item.area,
      value: item.valor,
      category: 'Lipolifting',
    })
  }

  // Coolfase
  for (const item of data.coolfase) {
    result.push({
      id: makeId('coolfase', item.area),
      name: item.area,
      value: item.valor,
      category: 'Coolfase',
    })
  }

  // Ultraformer MPT - facial
  for (const item of data.ultraformer_mpt.facial) {
    result.push({
      id: makeId('ultraformer-facial', item.area),
      name: item.area,
      value: item.valor,
      category: 'Ultraformer MPT',
      note: 'Facial',
    })
  }

  // Ultraformer MPT - corporal
  for (const item of data.ultraformer_mpt.corporal) {
    result.push({
      id: makeId('ultraformer-corporal', item.area),
      name: item.area,
      value: item.valor,
      category: 'Ultraformer MPT',
      note: 'Corporal',
    })
  }

  // Fotona - sessoes
  for (const item of data.fotona.sessoes) {
    result.push({
      id: makeId('fotona-sessao', item.area),
      name: item.area,
      value: item.valor,
      category: 'Fotona',
      note: 'Sessão',
    })
  }

  // Fotona - protocolos anuais
  for (const item of data.fotona.protocolos_anuais) {
    result.push({
      id: makeId('fotona-protocolo', item.descricao),
      name: item.descricao,
      value: item.valor,
      category: 'Fotona',
      note: 'Protocolo Anual',
    })
  }

  // Fios PDO - parafuso
  for (const item of data.fios_pdo.fios_parafuso) {
    result.push({
      id: makeId('fios-parafuso', item.quantidade),
      name: `Fios Parafuso – ${item.quantidade}`,
      value: item.valor,
      category: 'Fios PDO',
    })
  }

  // Fios PDO - filler
  for (const item of data.fios_pdo.fios_filler) {
    result.push({
      id: makeId('fios-filler', item.quantidade),
      name: `Fios Filler – ${item.quantidade}`,
      value: item.valor,
      category: 'Fios PDO',
    })
  }

  // Depilação LightSheer - fisioterapeuta
  for (const item of data.depilacao_lightsheer.fisioterapeuta.procedimentos) {
    result.push({
      id: makeId('depilacao-fisio', item.area),
      name: item.area,
      value: item.valor,
      category: 'Depilação LightSheer',
      note: 'Fisioterapeuta',
    })
  }

  // Depilação LightSheer - médicos
  for (const item of data.depilacao_lightsheer.medicos.procedimentos) {
    result.push({
      id: makeId('depilacao-medico', item.area),
      name: item.area,
      value: item.valor,
      category: 'Depilação LightSheer',
      note: 'Médicos',
    })
  }

  return result
}
