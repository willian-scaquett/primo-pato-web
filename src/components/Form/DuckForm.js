'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  FormLabel,
  Slider,
  MenuItem,
  Tooltip,
  CircularProgress
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const CustomAutocomplete = ({ value, disabled, onChange, options, label, placeholder, sx = {} }) => {
  const filter = createFilterOptions();
  return (
    <Autocomplete
      value={value || ''}
      disabled={disabled}
      sx={sx}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') onChange(newValue);
        else if (newValue && newValue.inputValue) onChange(newValue.inputValue);
        else onChange('');
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.includes(inputValue);
        if (inputValue !== '' && !isExisting) filtered.push({ inputValue, title: `Criar "${inputValue}"` });
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.inputValue || option.title}
      renderOption={(props, option) => <li {...props} key={typeof option === 'string' ? option : option.title}>{typeof option === 'string' ? option : option.title}</li>}
      freeSolo
      renderInput={(params) => <TextField {...params} fullWidth label={label} placeholder={placeholder} sx={{ mb: 2 }} />}
    />
  );
};

const REQUIRED_FIELDS = [
  'droneSerial',
  'droneModel',
  'droneMaker',
  'droneCountry',
  'duckHeight',
  'duckWeight',
  'locationCity',
  'locationState',
  'locationCountry',
  'latitude',
  'longitude',
  'precision',
  'hibernationStatus',
  'mutations',
  'touristPoint',
];

export default function DuckForm({ 
  initialData = null, 
  onSubmit, 
  submitButtonText = 'Salvar',
  title = 'Registro de Patos Primordiais',
  subtitle = 'Registre os dados coletados pelos drones sobre patos primordiais.',
  apiClient,
  SelectableMap
}) {
  const [duckWeightUnit, setDuckWeightUnit] = useState('g');
  const [duckHeightUnit, setDuckHeightUnit] = useState('cm');
  const [precisionUnit, setPrecisionUnit] = useState('m');
  const [loadingMap, setLoadingMap] = useState(false);

  const METRO_PARA_JARDA = 1.09361;

  const [formData, setFormData] = useState({
    droneSerial: '',
    droneModel: '',
    droneMaker: '',
    droneCountry: '',
    duckHeight: '',
    duckWeight: '',
    locationCity: '',
    locationState: '',
    locationCountry: '',
    latitude: '',
    longitude: '',
    precision: 0.04,
    hibernationStatus: 'DESPERTO',
    bpm: '',
    mutations: '',
    superpowerName: '',
    superpowerType: '',
    touristPoint: '',
  });

  const [countries, setCountries] = useState([]);
  const [hibernationStatuses, setHibernationStatuses] = useState([]);
  const [superpowerTypes, setSuperpowerTypes] = useState([]);
  const [superpowerNames, setSuperpowerNames] = useState([]);
  const [makers, setMakers] = useState([]);
  const [models, setModels] = useState([]);
  const [serials, setSerials] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [payloadComplete, setPayloadComplete] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        droneSerial: initialData.droneSerial || '',
        droneModel: initialData.droneModel || '',
        droneMaker: initialData.droneMaker || '',
        droneCountry: initialData.droneCountry || '',
        duckHeight: initialData.duckHeight || '',
        duckWeight: initialData.duckWeight || '',
        locationCity: initialData.locationCity || '',
        locationState: initialData.locationState || '',
        locationCountry: initialData.locationCountry || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        precision: initialData.precision || 0.04,
        hibernationStatus: initialData.hibernationStatus || 'DESPERTO',
        bpm: initialData.bpm || '',
        mutations: initialData.mutations || '',
        superpowerName: initialData.superpowerName || '',
        superpowerType: initialData.superpowerType || '',
        touristPoint: initialData.touristPoint || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.droneCountry === 'Estados Unidos da América') {
      setDuckWeightUnit('lb');
      setDuckHeightUnit('ft');
      setPrecisionUnit('yd');
    } else {
      setDuckWeightUnit('g');
      setDuckHeightUnit('cm');
      setPrecisionUnit('m');
    }
  }, [formData.droneCountry]);

  const getKeyByValue = (value, list) => {
    const item = list.find(obj => obj.value === value);
    return item ? item.key : -1;
  };

  const useCascadeLoad = (loadFn, dependency, setState, dependencyList, key) => {
    useEffect(() => {
      if (!apiClient) return;

      (async () => {
        try {
          const list = await loadFn(key ? key : getKeyByValue(dependency, dependencyList));
          setState(Array.isArray(list) ? list : []);
        } catch {
          setState([]);
        }
      })();
    }, [dependency, setState, dependencyList, key, loadFn ]);
  };

  useCascadeLoad(apiClient?.buscarFabricantes || (() => Promise.resolve([])), formData.droneCountry, setMakers, countries, null);
  useCascadeLoad(apiClient?.buscarModelos || (() => Promise.resolve([])), formData.droneMaker, setModels, makers, null);
  useCascadeLoad(apiClient?.buscarNumerosDeSerie || (() => Promise.resolve([])), formData.droneModel, setSerials, models, null);
  useCascadeLoad(apiClient?.buscaSuperPoderes || (() => Promise.resolve([])), formData.superpowerType, setSuperpowerNames, null, formData.superpowerType);

  useEffect(() => {
    if (!apiClient) return;

    (async () => {
      try {
        const paises = await apiClient.buscarPaises();
        setCountries(Array.isArray(paises) ? paises : []);
        const hiber = await apiClient.buscarEstadosHibernacao();
        setHibernationStatuses(Array.isArray(hiber) ? hiber : []);
        const tipos = await apiClient.buscarTiposSuperPoderes();
        setSuperpowerTypes(Array.isArray(tipos) ? tipos : []);
      } catch {
        setCountries([]);
        setHibernationStatuses([]);
        setSuperpowerTypes([]);
      }
    })();
  }, [apiClient]);

  const isPayloadComplete = useCallback(() => {
    const areRequiredFieldsFilled = REQUIRED_FIELDS.every(
      (key) => formData[key] !== null && formData[key] !== "" && formData[key] !== undefined
    );

    const isBpmFilled = !(formData.bpm !== null && formData.bpm !== "");
    const isSuperpowerFilled = !(
      formData.superpowerName !== null &&
      formData.superpowerName !== "" &&
      formData.superpowerType !== null &&
      formData.superpowerType !== ""
    );

    return (
      areRequiredFieldsFilled &&
      ((isBpmFilled && !isSuperpowerFilled) || (!isBpmFilled && isSuperpowerFilled))
    );
  }, [formData]);

  useEffect(() => {
    setPayloadComplete(isPayloadComplete());
  }, [isPayloadComplete]);

  const handleChange = (field) => (e) => onChange(field, e.target.value);
  const onChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !apiClient) return;
    setSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFloatChange = (field) => (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d,]/g, '');
    let parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + ',' + parts[1].substring(0, 2);
    }
    onChange(field, value);
  };

  const handleIntegerChange = (field) => (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, '');
    onChange(field, value);
  };

  const removeComma = (field) => (e) => {
    let value = e.target.value;
    if (value[value.length - 1] === ',') {
      onChange(field, value.slice(0, -1));
    }
  };

  const isHibernating = ['TRANSE', 'EM_TRANSE', 'HIBERNACAO_PROFUNDA'].includes(formData.hibernationStatus);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1, color: '#FFFFFF' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, color: '#B0B0B0' }}>
        {subtitle}
      </Typography>

      <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', position: 'relative' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 3, color: '#FFFFFF' }}>
              Informações do Drone
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3, margin: 0 }}>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="País do Drone"
                  placeholder="ex.: Brasil"
                  select
                  value={formData.droneCountry}
                  onChange={handleChange('droneCountry')}
                >
                  <MenuItem value="">Selecione o país do drone</MenuItem>
                  {countries.map((p) => (
                    <MenuItem key={p.key} value={p.value}>{p.value}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={4}>
                <CustomAutocomplete
                  value={formData.droneMaker}
                  disabled={!formData.droneCountry}
                  onChange={(val) => onChange('droneMaker', val)}
                  options={makers.map(m => m.value)}
                  label="Fabricante do Drone"
                  placeholder="ex.: PatoTech"
                />
              </Grid>
              <Grid size={4}>
                <CustomAutocomplete
                  value={formData.droneModel}
                  disabled={!formData.droneMaker}
                  onChange={(val) => onChange('droneModel', val)}
                  options={models.map(m => m.value)}
                  label="Modelo do Drone"
                  placeholder="ex.: Drone-001"
                />
              </Grid>
            </Grid>

            <CustomAutocomplete
              value={formData.droneSerial}
              disabled={!formData.droneModel}
              onChange={(val) => onChange('droneSerial', val)}
              options={serials.map(m => m.value)}
              label="Número de Série do Drone"
              placeholder="ex.: X-200"
              sx={{ marginBottom: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label={`Altura do Pato (${duckHeightUnit})`}
                  placeholder="ex.: 30,50"
                  
                  value={formData.duckHeight}
                  onChange={handleFloatChange('duckHeight')}
                  onBlur={removeComma('duckHeight')}
                  inputProps={{ inputMode: 'decimal', maxLength: 6 }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label={`Peso do Pato (${duckWeightUnit})`}
                  placeholder="ex.: 1200,50"
                  value={formData.duckWeight}
                  onChange={handleFloatChange('duckWeight')}
                  onBlur={removeComma('duckWeight')}
                  inputProps={{ inputMode: 'decimal', maxLength: 7  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>
                  Localização
                </Typography>
              </Grid>

              {SelectableMap && (
                <Grid size={12}>
                  <Box sx={{ position: "relative" }}>
                    {loadingMap && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(0,0,0,0.35)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 999,
                          borderRadius: 2,
                          top: -4,
                          left: -8,
                          right: -8,
                          bottom: -4,
                        }}
                      >
                        <CircularProgress sx={{ color: "#00E0B7" }} />
                      </Box>
                    )}

                    <Box>
                      <SelectableMap
                        onLoadingChange={setLoadingMap}
                        onLocationSelect={(loc) => {
                          setFormData((prev) => ({
                            ...prev,
                            locationCity: loc.city ?? prev.locationCity,
                            locationState: loc.state ?? prev.locationState,
                            locationCountry: loc.country ?? prev.locationCountry,
                            latitude: loc.latitude ?? prev.latitude,
                            longitude: loc.longitude ?? prev.longitude,
                            touristPoint: loc.touristPoint ?? prev.touristPoint,
                          }));
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                      <Typography sx={{ fontSize: 12, color: '#B0B0B0' }}>
                        Clique no mapa para preencher a localização automaticamente
                      </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={4}>
                        <TextField
                          disabled
                          fullWidth
                          label="Cidade"
                          placeholder="ex.: Marília"
                          value={formData.locationCity}
                          onChange={handleChange('locationCity')}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          disabled
                          fullWidth
                          label="Estado"
                          placeholder="ex.: São Paulo"
                          value={formData.locationState}
                          onChange={handleChange('locationState')}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          disabled
                          fullWidth
                          label="País"
                          placeholder="ex.: Brasil"
                          value={formData.locationCountry}
                          onChange={handleChange('locationCountry')}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          disabled
                          fullWidth
                          label="Latitude"
                          placeholder="ex.: -23.550520"
                          value={formData.latitude?.toString().replace(".", ",")}
                          onChange={() => { handleChange('latitude') }}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          disabled
                          fullWidth
                          label="Longitude"
                          placeholder="ex.: -46.633308"
                          value={formData.longitude?.toString().replace(".", ",")}
                          onChange={handleChange('longitude')}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          disabled
                          fullWidth
                          label="Ponto de Referência"
                          placeholder="ex.: Museu do Pato"
                          value={formData.touristPoint}
                          onChange={handleChange('touristPoint')}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              <Grid size={12} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: '100%', px: 2 }}>
                  <Typography
                    id="precision-slider-label"
                    gutterBottom
                    variant="h6"
                    sx={{ color: '#FFFFFF', fontSize: 15, mb: 0.5 }}
                  >
                    Precisão GPS do Drone 
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Slider
                      min={0.04}
                      max={30}
                      step={0.01}
                      value={
                        typeof formData.precision === 'number'
                          ? formData.precision
                          : parseInt(formData.precision) || 0.04
                      }
                      onChange={(_, newValue) => onChange('precision', newValue)}
                      aria-labelledby="precision-slider-label"
                      sx={{ color: "#00E0B7", mr: 2, flexGrow: 1, }}
                    />
                    <Typography sx={{ color: "#B0B0B0", fontWeight: "bold"}}>
                      {`${(precisionUnit === 'yd'
                            && (formData.precision * METRO_PARA_JARDA).toFixed(2)
                            || (formData.precision).toFixed(2)
                        ).padStart(5, "0")}${"\u00A0"}${precisionUnit}`.replace(".", ",")
                      }
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <FormLabel sx={{ color: '#FFFFFF', mb: 1, display: 'block' }}>
              </FormLabel>
              <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>
                  Estado de Hibernação
              </Typography>
              <RadioGroup
                row
                value={formData.hibernationStatus}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    hibernationStatus: value,
                    bpm: value === 'DESPERTO' ? '' : prev.bpm,
                    superpowerName: ['TRANSE', 'EM_TRANSE', 'HIBERNACAO_PROFUNDA'].includes(value) ? '' : prev.superpowerName,
                    superpowerType: ['TRANSE', 'EM_TRANSE', 'HIBERNACAO_PROFUNDA'].includes(value) ? '' : prev.superpowerType,
                  }));
                }}
              >
              { hibernationStatuses.map((h) => (
                <FormControlLabel
                key={h.key}  
                value={h.key}
                  control={<Radio sx={{ color: '#00E0B7' }} />}
                  label={h.value}
                  sx={{ color: '#FFFFFF' }}
                />
              ))}
              </RadioGroup>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={6}>
                {!isHibernating ? (
                  <Tooltip title="Não dá para medir a frequência cardíaca de patos despertos!">
                    <span>
                      <TextField
                        fullWidth
                        label="Frequência cardíaca (bpm)"
                        disabled
                        focused
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <TextField
                    fullWidth
                    label="Frequência cardíacos (bpm)"
                    placeholder="ex.: 120"
                    value={formData.bpm}
                    onChange={handleIntegerChange('bpm')}
                    inputProps={{ maxLength: 4 }}
                  />
                )}
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Número de Mutações"
                  placeholder="ex.: 3"
                  value={formData.mutations}
                  onChange={handleIntegerChange('mutations')}
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={6}>
                {isHibernating ? (
                  <Tooltip title="Não dá para descobrir super poderes de patos em transe ou hibernação profunda!">
                    <span>
                      <TextField
                        fullWidth
                        label="Tipo do Superpoder"
                        placeholder="ex.: Hidrojato"
                        disabled
                      >
                        <MenuItem value="">Selecione um tipo</MenuItem>
                      </TextField>
                    </span>
                  </Tooltip>
                ) : (
                  <TextField
                    fullWidth
                    select
                    label="Tipo do Superpoder"
                    value={formData.superpowerType}
                    onChange={handleChange('superpowerType')}
                  >
                    <MenuItem value="">Selecione um tipo para o super-poder</MenuItem>
                    { superpowerTypes.map((spt) => (<MenuItem key={spt.key} value={spt.key}>{spt.value}</MenuItem>)) }
                  </TextField>
                )}
              </Grid>
              <Grid size={6}>
                {isHibernating ? (
                  <Tooltip title="Não dá para descobrir super poderes de patos em transe ou hibernação profunda!">
                    <span>
                      <TextField
                        fullWidth
                        label="Nome do Superpoder"
                        disabled
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <CustomAutocomplete
                    value={formData.superpowerName}
                    disabled={!formData.superpowerType}
                    onChange={(val) => onChange('superpowerName', val)}
                    options={superpowerNames.map(m => m.value)}
                    label="Nome do Superpoder"
                    placeholder="ex.: Hidrojato"
                  />
                )}
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !payloadComplete}
              >
                {submitting ? 'Salvando...' : submitButtonText}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}