'use client'

import { useState, useMemo } from 'react'

interface ModelSpec {
  lens: number
  bridge: number
  temple: number
  total: number
  shape: 'round' | 'square' | 'rectangle'
  material: string
}

const modelSpecs: Record<string, ModelSpec> = {
  LUNA: { lens: 44, bridge: 16, temple: 130, total: 104, shape: 'round', material: 'TR-90 Flex' },
  SCOUT: { lens: 45, bridge: 15, temple: 130, total: 105, shape: 'square', material: 'TR-90 Flex' },
  RIVER: { lens: 45, bridge: 16, temple: 132, total: 106, shape: 'rectangle', material: 'TR-90 Flex' },
  JUMPER: { lens: 46, bridge: 15, temple: 135, total: 107, shape: 'round', material: 'TR-90 Flex' },
  PIPPIN: { lens: 44, bridge: 17, temple: 130, total: 105, shape: 'square', material: 'TR-90 Flex + Clip' },
  DAISY: { lens: 45, bridge: 16, temple: 130, total: 106, shape: 'round', material: 'TR-90 Flex + Clip' },
  FERN: { lens: 46, bridge: 16, temple: 135, total: 108, shape: 'rectangle', material: 'TR-90 Flex' },
  FABLE: { lens: 46, bridge: 16, temple: 136, total: 108, shape: 'round', material: 'TR-90 Active' },
  OLIVER: { lens: 47, bridge: 15, temple: 136, total: 109, shape: 'square', material: 'TR-90 Active' },
  HARPER: { lens: 47, bridge: 16, temple: 136, total: 110, shape: 'rectangle', material: 'TR-90 Active' },
  PIXIE: { lens: 46, bridge: 17, temple: 136, total: 109, shape: 'round', material: 'TR-90 Active' },
  CLOVER: { lens: 47, bridge: 16, temple: 136, total: 110, shape: 'square', material: 'TR-90 Active' },
  BECKETT: { lens: 48, bridge: 15, temple: 137, total: 111, shape: 'rectangle', material: 'TR-90 Active' },
  SAWYER: { lens: 48, bridge: 16, temple: 137, total: 112, shape: 'round', material: 'TR-90 Active + Clip' },
  SKIPPER: { lens: 47, bridge: 17, temple: 137, total: 111, shape: 'square', material: 'TR-90 Active + Clip' },
  ARCHER: { lens: 49, bridge: 16, temple: 138, total: 114, shape: 'rectangle', material: 'TR-90 Active' },
  STAR: { lens: 49, bridge: 17, temple: 138, total: 115, shape: 'round', material: 'TR-90 Active' },
  WILLOW: { lens: 48, bridge: 17, temple: 137, total: 113, shape: 'rectangle', material: 'TR-90 Active + Clip' },
  ELLE: { lens: 50, bridge: 16, temple: 138, total: 116, shape: 'round', material: 'TR-90 Active' },
}

const ageGroups = [
  {
    key: 'foals',
    label: 'Ages 4 – 7',
    range: '4-7 yrs',
    models: ['LUNA', 'SCOUT', 'RIVER', 'JUMPER', 'PIPPIN', 'DAISY', 'FERN'],
    headCirc: '49 – 52 cm',
    color: '#3F8B4D',
    bg: '#E2F3DC',
  },
  {
    key: 'trotters',
    label: 'Ages 8 – 12',
    range: '8-12 yrs',
    models: ['FABLE', 'OLIVER', 'HARPER', 'PIXIE', 'CLOVER', 'BECKETT', 'SAWYER', 'SKIPPER', 'ARCHER', 'STAR', 'WILLOW'],
    headCirc: '52 – 55 cm',
    color: '#2E83BD',
    bg: '#DCEEFB',
  },
  {
    key: 'ponies',
    label: 'Ages 13+',
    range: '13+ yrs',
    models: ['ARCHER', 'STAR', 'ELLE', 'WILLOW'],
    headCirc: '54 – 57 cm',
    color: '#7245A0',
    bg: '#E7E0F4',
  },
]

export function InteractiveSizeChart({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<'foals' | 'trotters' | 'ponies'>('trotters')
  const [unit, setUnit] = useState<'mm' | 'in'>('mm')
  const [searchQuery, setSearchQuery] = useState('')

  const activeGroup = useMemo(() => {
    return ageGroups.find(g => g.key === activeTab)!
  }, [activeTab])

  const formatValue = (mmVal: number) => {
    if (unit === 'in') {
      return `${(mmVal / 25.4).toFixed(2)}"`
    }
    return `${mmVal} mm`
  }

  const filteredModels = useMemo(() => {
    const groupModels = activeGroup.models
    return groupModels
      .map(name => ({ name, ...modelSpecs[name] }))
      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.shape.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [activeGroup, searchQuery])

  return (
    <div className={`isc-container ${compact ? 'isc-compact' : ''}`}>
      {/* HEADER SECTION */}
      <div className="isc-header">
        <div className="isc-tabs" role="tablist">
          {ageGroups.map(group => (
            <button
              key={group.key}
              role="tab"
              aria-selected={activeTab === group.key}
              className={`isc-tab ${activeTab === group.key ? 'active' : ''}`}
              onClick={() => setActiveTab(group.key as any)}
              style={activeTab === group.key ? {
                backgroundColor: group.bg,
                color: group.color,
                borderColor: group.bg,
              } : {}}
            >
              <span className="isc-tab-label">{group.label}</span>
              <span className="isc-tab-sub">{group.range} · Head: {group.headCirc}</span>
            </button>
          ))}
        </div>

        <div className="isc-controls">
          {!compact && (
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="isc-search-input"
              style={{ width: '220px' }}
            />
          )}
          <div className="isc-unit-toggle">
            <button
              className={`isc-unit-btn ${unit === 'mm' ? 'active' : ''}`}
              onClick={() => setUnit('mm')}
            >
              mm
            </button>
            <button
              className={`isc-unit-btn ${unit === 'in' ? 'active' : ''}`}
              onClick={() => setUnit('in')}
            >
              inches
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="isc-table-wrapper">
        <table className="isc-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Shape</th>
              <th>A · Lens</th>
              <th>B · Bridge</th>
              <th className="highlight-col">C · Total Width</th>
              <th>D · Temple</th>
              {!compact && <th>Material</th>}
            </tr>
          </thead>
          <tbody>
            {filteredModels.length > 0 ? (
              filteredModels.map(model => (
                <tr key={model.name}>
                  <td>
                    <strong className="model-name-text">{model.name}</strong>
                  </td>
                  <td>
                    <div className="shape-container">
                      <span className={`shape-icon ${model.shape}`} title={model.shape} />
                      <span className="shape-label">{model.shape}</span>
                    </div>
                  </td>
                  <td>{formatValue(model.lens)}</td>
                  <td>{formatValue(model.bridge)}</td>
                  <td className="highlight-col" style={{ color: activeGroup.color, fontWeight: 700 }}>
                    {formatValue(model.total)}
                  </td>
                  <td>{formatValue(model.temple)}</td>
                  {!compact && <td className="material-cell">{model.material}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={compact ? 6 : 7} className="isc-empty-search">
                  No models match your search. Try changing the age group!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CHART DIAGRAM KEY */}
      <div className="isc-legend">
        <div className="legend-item"><span className="dot a">A</span> Lens width</div>
        <div className="legend-item"><span className="dot b">B</span> Bridge gap</div>
        <div className="legend-item"><span className="dot c">C</span> Total frame width (critical fit)</div>
        <div className="legend-item"><span className="dot d">D</span> Temple arm length</div>
      </div>
    </div>
  )
}
