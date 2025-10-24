'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import DuckForm from '../../components/Form/DuckForm';

const Layout = dynamic(() => import('../../components/Layout/Layout').then(mod => ({ default: mod.Layout })), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress sx={{ color: '#00E0B7' }} />
    </Box>
  )
});

const SelectableMap = dynamic(() => import('../../components/Map/SelectableMap').then(mod => ({ default: mod.SelectableMap })), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1F1F', borderRadius: 2 }}>
      <CircularProgress sx={{ color: '#00E0B7' }} />
    </Box>
  )
});

export default function CreateDuckPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [apiClient, setApiClient] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setMounted(true);
    import('../../lib/apiClient').then((module) => setApiClient(module));
  }, []);

  const handleSubmit = async (formData) => {
    const payload = {
      numeroSerieDrone: formData.droneSerial || null,
      modeloDrone: formData.droneModel || null,
      fabricanteDrone: formData.droneMaker || null,
      paisDrone: formData.droneCountry || null,
      altura: formData.duckHeight ? Number(formData.duckHeight.replace(",", ".")) : null,
      peso: formData.duckWeight ? Number(formData.duckWeight.replace(",", ".")) : null,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      precisao: formData.precision || 0.04,
      estadoHibernacao: formData.hibernationStatus || null,
      bpm: formData.bpm ? Number(formData.bpm) : null,
      quantidadeMutacoes: formData.mutations ? Number(formData.mutations) : null,
      nomeSuperPoder: formData.superpowerName || null,
      tipoSuperPoder: formData.superpowerType || null,
      pais: formData.locationCountry || null,
      estado: formData.locationState || null,
      cidade: formData.locationCity || null,
      pontoReferencia: formData.touristPoint || null,
    };

    try {
      await apiClient.cadastrarPato(payload);
      setSnack({ open: true, message: 'Pato salvo com sucesso.', severity: 'success' });
      setTimeout(() => router.push('/ducks'), 600);
    } catch (err) {
      setSnack({ open: true, message: err.message || 'Falha ao cadastrar.', severity: 'error' });
      throw err;
    }
  };

  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0A1A1A' }}>
        <CircularProgress sx={{ color: '#00E0B7' }} />
      </Box>
    );
  }

  return (
    <Layout>
      <DuckForm
        onSubmit={handleSubmit}
        apiClient={apiClient}
        SelectableMap={SelectableMap}
        title="Registro de Dados"
        subtitle="Registre os dados coletados pelos drones sobre patos primordiais."
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