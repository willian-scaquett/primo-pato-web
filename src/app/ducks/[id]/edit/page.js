"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import DuckForm from '../../../../components/Form/DuckForm';

// Dynamic imports
const Layout = dynamic(() => import('../../../../components/Layout/Layout').then(mod => ({ default: mod.Layout })), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress sx={{ color: '#00E0B7' }} />
    </Box>
  )
});

const SelectableMap = dynamic(() => import('../../../../components/Map/SelectableMap').then(mod => ({ default: mod.SelectableMap })), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1F1F', borderRadius: 2 }}>
      <CircularProgress sx={{ color: '#00E0B7' }} />
    </Box>
  )
});

function EditDuckPage() {
  const params = useParams();
  const router = useRouter();
  const duckId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [apiClient, setApiClient] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setMounted(true);
    import('../../../../lib/apiClient').then((module) => setApiClient(module));
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!apiClient || !duckId) return;
      
      try {
        const duck = await apiClient.buscarPatoPorId(duckId);
        if (!duck) throw new Error('Pato não encontrado');
        
        setInitialData({
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
        setLoading(false);
      } catch (err) {
        setSnack({ open: true, message: err.message || 'Falha ao carregar dados do pato.', severity: 'error' });
        setLoading(false);
      }
    };
    
    if (mounted && apiClient && duckId) {
      load();
    }
  }, [mounted, apiClient, duckId]);

  const handleSubmit = async (formData) => {
    const payload = {
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
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      pontoReferencia: formData.touristPoint || null,
      estadoHibernacao: formData.hibernationStatus || null,
      bpm: formData.bpm ? Number(formData.bpm) : null,
      quantidadeMutacoes: formData.mutations ? Number(formData.mutations) : null,
      nomeSuperPoder: formData.superpowerName || null,
      tipoSuperPoder: formData.superpowerType || null,
    };

    try {
      await apiClient.atualizarPato(payload);
      setSnack({ open: true, message: 'Pato atualizado com sucesso.', severity: 'success' });
      setTimeout(() => router.push('/ducks'), 600);
    } catch (err) {
      setSnack({ open: true, message: err.message || 'Falha ao atualizar.', severity: 'error' });
      throw err;
    }
  };

  if (!mounted || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0A1A1A' }}>
        <CircularProgress sx={{ color: '#00E0B7' }} />
      </Box>
    );
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
        onClose={() => setSnack(s => ({ ...s, open: false }))} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnack(s => ({ ...s, open: false }))} 
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