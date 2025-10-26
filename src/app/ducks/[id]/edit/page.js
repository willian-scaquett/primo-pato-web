"use client";

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import DuckForm from '../../../../components/Form/DuckForm';

const Layout = dynamic(() => import('../../../../components/Layout/Layout').then(mod => ({ default: mod.Layout })), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

const SelectableMap = dynamic(() => import('../../../../components/Map/SelectableMap').then(mod => ({ default: mod.SelectableMap })), {
  ssr: false,
  loading: () => <MapLoading />
});

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress sx={{ color: '#00E0B7' }} />
  </Box>
);

const MapLoading = () => (
  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1F1F', borderRadius: 2 }}>
    <CircularProgress sx={{ color: '#00E0B7' }} />
  </Box>
);

const transformDuckToFormData = (duck) => ({
  droneSerial: duck.numeroSerieDrone || '',
  droneModel: duck.modeloDrone || '',
  droneMaker: duck.fabricanteDrone || '',
  droneCountry: duck.paisDrone || duck.pais || '',
  duckHeight: duck.altura ? String(duck.altura) : '',
  duckWeight: duck.peso ? String(duck.peso) : '',
  locationCity: duck.cidade || '',
  locationState: duck.estado || '',
  locationCountry: duck.pais || '',
  latitude: duck.latitude || '',
  longitude: duck.longitude || '',
  precision: duck.precisao ? Number(duck.precisao) : 0.04,
  hibernationStatus: (duck.estadoHibernacao || 'DESPERTO').toUpperCase(),
  bpm: duck.bpm ? String(duck.bpm) : '',
  mutations: duck.quantidadeMutacoes ? String(duck.quantidadeMutacoes) : '',
  superpowerName: duck.nomeSuperPoder || '',
  superpowerType: duck.tipoSuperPoder || '',
  touristPoint: duck.pontoReferencia || '-',
});

const transformFormDataToPayload = (formData, duckId) => ({
  id: duckId,
  numeroSerieDrone: formData.droneSerial || null,
  modeloDrone: formData.droneModel || null,
  fabricanteDrone: formData.droneMaker || null,
  paisDrone: formData.droneCountry || null,
  altura: formData.duckHeight ? Number(formData.duckHeight.replace(",", ".")) : null,
  peso: formData.duckWeight ? Number(formData.duckWeight.replace(",", ".")) : null,
  latitude: formData.latitude ? Number(formData.latitude) : null,
  longitude: formData.longitude ? Number(formData.longitude) : null,
  precisao: formData.precision || 0.04,
  cidade: formData.locationCity || null,
  estado: formData.locationState || null,
  pais: formData.locationCountry || null,
  pontoReferencia: formData.touristPoint || null,
  estadoHibernacao: formData.hibernationStatus || null,
  bpm: formData.bpm ? Number(formData.bpm) : null,
  quantidadeMutacoes: formData.mutations ? Number(formData.mutations) : null,
  nomeSuperPoder: formData.superpowerName || null,
  tipoSuperPoder: formData.superpowerType || null,
});

function EditDuckPage() {
  const params = useParams();
  const router = useRouter();
  const duckId = params?.id;

  const [apiClient, setApiClient] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    import('../../../../lib/apiClient').then((module) => setApiClient(module));
  }, []);

  useEffect(() => {
    const loadDuck = async () => {
      if (!apiClient || !duckId) return;
      
      try {
        const duck = await apiClient.buscarPatoPorId(duckId);
        
        if (!duck) {
          router.push('/ducks');
          setSnack({ open: true, message: 'Pato não encontrado', severity: 'error' });
          return;
        }
        
        setInitialData(transformDuckToFormData(duck));
      } catch (err) {
        console.error('Erro ao carregar pato:', err);
        setSnack({ 
          open: true, 
          message: err.message || 'Falha ao carregar dados do pato.', 
          severity: 'error' 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDuck();
  }, [apiClient, duckId, router]);

  const handleSubmit = useCallback(async (formData) => {
    if (!apiClient) return;
    
    const payload = transformFormDataToPayload(formData, duckId);

    try {
      await apiClient.atualizarPato(payload);
      setSnack({ open: true, message: 'Pato atualizado com sucesso.', severity: 'success' });
      setTimeout(() => router.push('/ducks'), 600);
    } catch (err) {
      console.error('Erro ao atualizar pato:', err);
      setSnack({ 
        open: true, 
        message: err.message || 'Falha ao atualizar.', 
        severity: 'error' 
      });
      throw err;
    }
  }, [apiClient, duckId, router]);

  const handleCloseSnack = useCallback(() => {
    setSnack(prev => ({ ...prev, open: false }));
  }, []);

  if (isLoading || !apiClient) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <DuckForm
        initialData={initialData}
        onSubmit={handleSubmit}
        apiClient={apiClient}
        SelectableMap={SelectableMap}
        title={`Pato #${duckId}`}
        subtitle="Edite os dados dos pato primordiais cadastrados."
        isEditMode={true}
      />
      <Snackbar 
        open={snack.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnack} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnack} 
          severity={snack.severity} 
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default EditDuckPage;