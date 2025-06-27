import React, { useState, useEffect } from 'react';

// Definição dos grupos de inspeção (Checklist 1.0) com TODOS os itens detalhados
const GROUPS = [
  {
    id: 'tires',
    name: 'Pneus',
    items: [
      { id: 'front-left', name: 'Dianteiro Esquerdo', type: 'buttons', required: true },
      { id: 'front-right', name: 'Dianteiro Direito', type: 'buttons', required: true },
      { id: 'rear-left', name: 'Traseiro Esquerdo', type: 'buttons', required: true },
      { id: 'rear-right', name: 'Traseiro Direito', type: 'buttons', required: true },
      { id: 'spare', name: 'Estepe', type: 'buttons', required: true },
    ],
  },
  {
    id: 'brakes',
    name: 'Freios',
    items: [
      { id: 'front-brake', name: 'Freio Dianteiro', type: 'buttons', required: true },
      { id: 'rear-brake', name: 'Freio Traseiro', type: 'buttons', required: true },
      { id: 'hand-brake', name: 'Freio de Mão', type: 'buttons', required: true },
    ],
  },
  {
    id: 'lights',
    name: 'Luzes',
    items: [
      { id: 'headlight-left', name: 'Farol Dianteiro Esquerdo', type: 'buttons', required: true },
      { id: 'headlight-right', name: 'Farol Dianteiro Direito', type: 'buttons', required: true },
      { id: 'taillight-left', name: 'Lanterna Traseira Esquerda', type: 'buttons', required: true },
      { id: 'taillight-right', name: 'Lanterna Traseira Direita', type: 'buttons', required: true },
      { id: 'brake-light', name: 'Luz de Freio', type: 'buttons', required: true },
      { id: 'reverse-light', name: 'Luz de Ré', type: 'buttons', required: true },
      { id: 'indicators', name: 'Setas', type: 'buttons', required: true },
      { id: 'interior-light', name: 'Luz Interna', type: 'buttons', required: true },
    ],
  },
  {
    id: 'fluids',
    name: 'Fluidos',
    items: [
      { id: 'engine-oil', name: 'Óleo do Motor', type: 'buttons', required: true },
      { id: 'radiator-water', name: 'Água do Radiador', type: 'buttons', required: true },
      { id: 'brake-fluid', name: 'Fluido de Freio', type: 'buttons', required: true },
      { id: 'washer-fluid', name: 'Água do Limpador', type: 'buttons', required: true },
    ],
  },
  {
    id: 'body',
    name: 'Carroceria',
    items: [
      { id: 'front-bumper', name: 'Para-choque Dianteiro', type: 'buttons', required: true },
      { id: 'rear-bumper', name: 'Para-choque Traseiro', type: 'buttons', required: true },
      { id: 'right-side', name: 'Lateral Direita', type: 'buttons', required: true },
      { id: 'left-side', name: 'Lateral Esquerda', type: 'buttons', required: true },
      { id: 'roof', name: 'Teto', type: 'buttons', required: true },
      { id: 'doors', name: 'Portas', type: 'buttons', required: true },
      { id: 'hood', name: 'Capô', type: 'buttons', required: true },
      { id: 'trunk', name: 'Porta Malas', type: 'buttons', required: true },
    ],
  },
  {
    id: 'interior',
    name: 'Interior',
    items: [
      { id: 'seats', name: 'Bancos', type: 'buttons', required: true },
      { id: 'dashboard', name: 'Painel', type: 'buttons', required: true },
      { id: 'horn', name: 'Buzina', type: 'buttons', required: true },
      { id: 'seatbelts', name: 'Cintos de Segurança', type: 'buttons', required: true },
      { id: 'mats', name: 'Tapetes', type: 'buttons', required: true },
    ],
  },
  {
    id: 'tools',
    name: 'Ferramentas',
    items: [
      { id: 'warning-triangle', name: 'Triângulo de Sinalização', type: 'buttons', required: true },
      { id: 'jack', name: 'Macaco Hidráulico', type: 'buttons', required: true },
      { id: 'wheel-wrench', name: 'Chave de Roda', type: 'buttons', required: true },
    ],
  },
  {
    id: 'documents',
    name: 'Documentos',
    items: [
      { id: 'crvl', name: 'CRLV', type: 'buttons', required: true },
      { id: 'drivers-license', name: 'CNH do Condutor', type: 'buttons', required: true },
      { id: 'ipva-receipt', name: 'Comprovante de IPVA', type: 'buttons', required: true },
    ],
  },
];

const statusLabels = { bom: '✅ Bom', attention: '⚠️ Atenção', critical: '❌ Crítico' };
const colorMapping = {
  bom: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
  attention: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
  critical: 'bg-gradient-to-r from-red-400 to-red-600 text-white',
  default: 'bg-gray-200 text-gray-600 hover:bg-gray-300',
};

// Componente para Status Buttons
const StatusButtons = ({ groupId, itemId, itemStatus, onStatusChange }) => (
  <div className="flex flex-wrap gap-2 sm:gap-3">
    {Object.entries(statusLabels).map(([key, label]) => (
      <button
        key={key}
        onClick={() => onStatusChange(groupId, itemId, key)}
        className={`w-full sm:w-auto px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors duration-300 ${
          itemStatus === key ? colorMapping[key] : colorMapping.default
        }`}
        title={label}
        aria-label={`${label} para ${itemId}`}
        role="button"
      >
        {label}
      </button>
    ))}
  </div>
);

// Componente para Item de Inspeção
const InspectionItem = ({
  group,
  item,
  onStatusChange,
  onImageUpload,
}) => {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onImageUpload(group.id, item.id, files);
    }
  };

  return (
    <div
      key={item.id}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-2 bg-white rounded-lg shadow-md"
    >
      {/* Nome do Item */}
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-800 font-medium">{item.name}</label>
      </div>

      {/* Botões de Status */}
      <div className="col-span-1 md:col-span-1">
        <StatusButtons
          groupId={group.id}
          itemId={item.id}
          itemStatus={item.status}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* Botão de Upload de Fotos */}
      <div className="col-span-1 md:col-span-1 flex flex-col items-center">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id={`upload-${item.id}`}
        />
        <label
          htmlFor={`upload-${item.id}`}
          title="Adicionar Foto"
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md shadow-sm w-full flex justify-center items-center transition-colors duration-300"
          aria-label={`Enviar foto para ${item.name}`}
        >
          Enviar Foto
        </label>
        {item.images.length > 0 && (
          <div className="flex space-x-2 mt-2 overflow-x-auto">
            {item.images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="Foto"
                className="w-10 h-10 object-cover rounded-md border border-gray-300 shadow-sm"
                onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Limpar URL após carregamento
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const initialState = {
    vehicle: '',
    plate: '',
    driver: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    groups: GROUPS.map((g) => ({
      ...g,
      items: g.items.map((i) => ({ ...i, status: null, images: [] })),
      overallStatus: null,
    })),
    observations: '',
  };

  const [currentInspection, setCurrentInspection] = useState(initialState);
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem('inspections');
    return stored ? JSON.parse(stored) : [];
  });
  const [view, setView] = useState('form');
  const [selectedInspection, setSelectedInspection] = useState(null);

  useEffect(() => {
    localStorage.setItem('inspections', JSON.stringify(history));
  }, [history]);

  const handleInputChange = (field, value) => {
    setCurrentInspection((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (groupId, itemId, status) => {
    const newGroups = currentInspection.groups.map((g) => {
      if (g.id === groupId) {
        const newItems = g.items.map((i) =>
          i.id === itemId ? { ...i, status } : i
        );
        const groupStatus = getGroupStatus(newItems);
        return { ...g, items: newItems, overallStatus: groupStatus };
      }
      return g;
    });
    setCurrentInspection((prev) => ({ ...prev, groups: newGroups }));
  };

  const handleImageUpload = (groupId, itemId, files) => {
    const newGroups = currentInspection.groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          items: g.items.map((i) =>
            i.id === itemId
              ? { ...i, images: [...i.images, ...files] }
              : i
          ),
        };
      }
      return g;
    });
    setCurrentInspection((prev) => ({ ...prev, groups: newGroups }));
  };

  const saveInspection = () => {
    const isFormValid = validateForm();
    if (!isFormValid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newInspection = {
      ...currentInspection,
      date: new Date().toISOString(),
      id: Date.now(),
    };
    setHistory([newInspection, ...history]);
    setCurrentInspection(initialState);
  };

  const validateForm = () => {
    const { plate, driver, groups } = currentInspection;

    // Validar campos principais
    if (!plate || !driver) return false;

    // Validar itens obrigatórios
    for (const group of groups) {
      for (const item of group.items) {
        if (item.required && !item.status) return false;
      }
    }

    return true;
  };

  const viewDetails = (inspection) => {
    setSelectedInspection(inspection);
    setView('details');
  };

  const getGroupStatus = (items) => {
    let status = 'bom';
    items.forEach((item) => {
      if (item.status === 'critical') status = 'critical';
      else if (item.status === 'attention' && status !== 'critical')
        status = 'attention';
    });
    return status;
  };

  const getOverallStatus = (inspection) => {
    let status = 'bom';
    inspection.groups.forEach((group) => {
      if (group.overallStatus === 'critical') status = 'critical';
      else if (group.overallStatus === 'attention' && status !== 'critical')
        status = 'attention';
    });
    return status;
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white text-center">
        <img
          src="https://via.placeholder.com/150/00BFFF/FFFFFF?text=LOGO"
          alt="Logo"
          className="w-24 h-24 mb-2 mx-auto"
        />
        <h1 className="text-3xl font-bold">Checklist 1.0 - Inspeção Diária de Veículos</h1>
      </header>

      {/* Resumo da Inspeção */}
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-medium mb-4">Resumo da Inspeção</h2>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <span className="text-gray-700 font-medium">Status Geral:</span>
            <span
              className={`px-4 py-2 rounded-md ${
                colorMapping[getOverallStatus(currentInspection)] || colorMapping.default
              }`}
            >
              {statusLabels[getOverallStatus(currentInspection)] || 'Sem status'}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário */}
      {view === 'form' && (
        <main className="container mx-auto p-4">
          {/* Placa do Veículo */}
          <div className="mb-6">
            <label htmlFor="plate" className="block text-gray-700 mb-2">
              Placa do Veículo:
            </label>
            <input
              type="text"
              id="plate"
              value={currentInspection.plate}
              onChange={(e) =>
                handleInputChange('plate', e.target.value.toUpperCase())
              }
              maxLength={8}
              placeholder="Ex.: ABC1D23 ou ABCD123"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
          </div>

          {/* Condutor, Data e Hora */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="driver" className="block text-gray-700 mb-2">
                Condutor:
              </label>
              <input
                type="text"
                id="driver"
                value={currentInspection.driver}
                onChange={(e) => handleInputChange('driver', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                Data:
              </label>
              <input
                type="date"
                id="date"
                value={currentInspection.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-gray-700 mb-2">
                Hora:
              </label>
              <input
                type="time"
                id="time"
                value={currentInspection.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grupos de Inspeção */}
          {currentInspection.groups.map((group) => (
            <div key={group.id} className="mb-8">
              <h2 className="text-2xl font-medium mb-4">{group.name}</h2>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <InspectionItem
                    key={item.id}
                    group={group}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onImageUpload={handleImageUpload}
                  />
                ))}
              </div>
              {/* Status Geral do Grupo */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-700 font-medium">Status Geral:</span>
                <span
                  className={`px-4 py-2 rounded-md ${
                    colorMapping[group.overallStatus] || colorMapping.default
                  }`}
                >
                  {group.overallStatus
                    ? statusLabels[group.overallStatus]
                    : 'Sem status'}
                </span>
              </div>
            </div>
          ))}

          {/* Observações */}
          <div className="mb-6">
            <label htmlFor="observations" className="block text-gray-700 mb-2">
              Observações:
            </label>
            <textarea
              id="observations"
              value={currentInspection.observations}
              onChange={(e) =>
                handleInputChange('observations', e.target.value.slice(0, 500))
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none"
              aria-label="Observações adicionais"
            ></textarea>
            <p className="text-right text-sm text-gray-500">
              {currentInspection.observations.length}/500 caracteres
            </p>
          </div>

          {/* Botão Salvar Inspeção */}
          <button
            onClick={saveInspection}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300"
          >
            Salvar Inspeção
          </button>
        </main>
      )}

      {/* Histórico de Inspeções */}
      {view === 'history' && (
        <section className="container mx-auto p-4">
          <h2 className="text-2xl mb-6">Histórico de Inspeções</h2>
          <div className="space-y-4">
            {history.map((inspection) => (
              <div
                key={inspection.id}
                className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
                onClick={() => viewDetails(inspection)}
              >
                <p className="font-medium mb-2">Veículo: {inspection.vehicle}</p>
                <p>Placa: {inspection.plate}</p>
                <p>Condutor: {inspection.driver}</p>
                <p>Data: {inspection.date}</p>
                <p>Hora: {inspection.time}</p>
                <div className="flex items-center justify-end mt-2">
                  <span
                    className={`px-4 py-2 rounded-md ${
                      colorMapping[getOverallStatus(inspection)] || colorMapping.default
                    }`}
                  >
                    {statusLabels[getOverallStatus(inspection)]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detalhes da Inspeção */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedInspection(null)}
              aria-label="Fechar detalhes da inspeção"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Detalhes da Inspeção
            </h2>
            <div className="mb-4">
              <p className="font-medium">Veículo: {selectedInspection.vehicle}</p>
              <p>Placa: {selectedInspection.plate}</p>
              <p>Condutor: {selectedInspection.driver}</p>
              <p>Data: {selectedInspection.date}</p>
              <p>Hora: {selectedInspection.time}</p>
            </div>
            {selectedInspection.groups.map((group) => (
              <div key={group.id} className="mb-6">
                <h3 className="text-lg font-medium mb-2">{group.name}</h3>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-2 bg-white rounded-lg shadow-sm"
                    >
                      <div>
                        <p className="text-gray-700 font-medium">{item.name}</p>
                      </div>
                      <div>
                        <span
                          className={`px-4 py-2 rounded-md ${
                            colorMapping[item.status] || colorMapping.default
                          }`}
                        >
                          {item.status ? statusLabels[item.status] : 'Sem status'}
                        </span>
                      </div>
                      <div>
                        {item.images.length > 0 && (
                          <div className="flex space-x-2 overflow-x-auto">
                            {item.images.map((image, index) => (
                              <img
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt="Foto"
                                className="w-10 h-10 object-cover rounded-md border border-gray-300 shadow-sm"
                                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Status Geral do Grupo */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Status Geral:</span>
                  <span
                    className={`px-4 py-2 rounded-md ${
                      colorMapping[group.overallStatus] || colorMapping.default
                    }`}
                  >
                    {group.overallStatus
                      ? statusLabels[group.overallStatus]
                      : 'Sem status'}
                  </span>
                </div>
              </div>
            ))}
            {/* Observações */}
            <div className="mt-6">
              <p className="font-medium mb-2">Observações:</p>
              <p className="text-gray-700">{selectedInspection.observations}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;