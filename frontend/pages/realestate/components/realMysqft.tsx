import { HomeWork, LocationOn } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { message } from 'antd';
import apiClient from '@/src/utils/api/apiClient';

import React, { useState, useEffect } from 'react';

interface IProject {
  id: number;
  project_name: string;
  location: string;
  google_map_link?: string;
  description?: string;
  plot_type: 'Residential' | 'Commercial' | 'Plot' | 'Villa' | 'Skyrise';
  unit: 'sqft' | 'sqyd';
  price: number;
  project_image?: string;
}

interface ProjectData {
  projectName: string;
  location: string;
  googleMapLink: string;
  projectType: 'Plot' | 'Villa' | 'Skyrise' | 'Residential' | 'Commercial';
  price: number;
  description: string;
  amenities: string[];
  unit: 'sqft' | 'sqyd';
}

interface PlotData {
  plotNumber: string;
  dimensions: string;
  areaSqft: number;
  sqftPrice: number;
  totalPrice: number;
  status: 'Available' | 'Sold' | 'On Hold';
  facing: 'North' | 'South' | 'East' | 'West';
  remarks: string;
}

const amenitiesList = ['Gated', 'Water Supply', 'Roads', 'Electricity', 'Park'];

const RealMySqft: React.FC = () => {
  const theme = useTheme();
  
 
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '', location: '', googleMapLink: '', projectType: 'Plot', price: 0, description: '', amenities: [], unit: 'sqft',
  });
  const [plotData, setPlotData] = useState<PlotData[]>([]);
  const [newPlot, setNewPlot] = useState<PlotData>({
    plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '',
  });

  const [projectLayoutFile, setProjectLayoutFile] = useState<File | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectVideoFile, setProjectVideoFile] = useState<File | null>(null);
  const [landDocumentFile, setLandDocumentFile] = useState<File | null>(null);
  
  const [projectCreated, setProjectCreated] = useState(false);
  const [savedPlots, setSavedPlots] = useState(false);
  
 
  const [fetchedProjects, setFetchedProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

 
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<IProject[]>('/sqlft-projects/');
      setFetchedProjects(Array.isArray(response.data) ? response.data.reverse() : []);
    } catch (error) {
      message.error("Could not fetch existing projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

 
  const handleAddProject = async () => {
    setIsSubmitting(true);
    const loadingMessage = message.loading('Submitting project and plots...', 0);

   
    const projectPayload = new FormData();
    projectPayload.append('project_name', projectData.projectName);
    projectPayload.append('location', projectData.location);
    projectPayload.append('google_map_link', projectData.googleMapLink);
    projectPayload.append('description', projectData.description);
    projectPayload.append('plot_type', projectData.projectType);
    projectPayload.append('unit', projectData.unit);
    projectPayload.append('price', String(projectData.price));

    if (projectLayoutFile) projectPayload.append('project_layout', projectLayoutFile);
    if (projectImageFile) projectPayload.append('project_image', projectImageFile);
    if (projectVideoFile) projectPayload.append('project_video', projectVideoFile);
    if (landDocumentFile) projectPayload.append('land_document', landDocumentFile);

    try {
      const projectResponse = await apiClient.post<IProject>('/sqlft-projects/', projectPayload, { headers: { 'Content-Type': 'multipart/form-data' } });
      const newProjectId = projectResponse.data.id;
      if (!newProjectId) throw new Error("Project creation failed to return an ID.");
      
      message.success('Project saved! Now saving sub-plots...');

     
      const subplotPromises = plotData.map(plot => {
        const subplotPayload = new FormData();
        subplotPayload.append('project', String(newProjectId));
        subplotPayload.append('plot_number', plot.plotNumber);
        subplotPayload.append('dimensions', plot.dimensions);
        subplotPayload.append('area', String(plot.areaSqft));
        subplotPayload.append('total_price', String(plot.totalPrice));
        subplotPayload.append('status', plot.status);
        subplotPayload.append('facing', plot.facing);
        subplotPayload.append('remarks', plot.remarks);
        return apiClient.post('/sub-plots/', subplotPayload, { headers: { 'Content-Type': 'multipart/form-data' } });
      });

      await Promise.all(subplotPromises);
      message.success('All sub-plots saved successfully!');
      
     
      setProjectCreated(false);
      setSavedPlots(false);
      setProjectData({ projectName: '', location: '', googleMapLink: '', projectType: 'Plot', price: 0, description: '', amenities: [], unit: 'sqft' });
      setPlotData([]);
      setNewPlot({ plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' });
      setProjectLayoutFile(null); setProjectImageFile(null); setProjectVideoFile(null); setLandDocumentFile(null);
      
      fetchProjects();

    } catch (error: any) {
      if (error.response?.data) setFormErrors(error.response.data);
      message.error('An error occurred during final submission.');
    } finally {
      setIsSubmitting(false);
      loadingMessage();
    }
  };
  
 
  const handleProjectSubmit = (e: React.FormEvent) => { e.preventDefault(); setProjectCreated(true); };
  
  const handlePlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlotData([...plotData, newPlot]);
    setNewPlot({ plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' });
  };
  
  const handleFormChange = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      const newErrors = { ...formErrors };
      delete newErrors[field as keyof typeof formErrors];
      setFormErrors(newErrors);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = projectData.amenities;
    setProjectData({ ...projectData, amenities: current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity] });
  };

  const plotColumns: GridColDef[] = [
    { field: 'plotNumber', headerName: 'Plot Number', flex: 1 },
    { field: 'dimensions', headerName: 'Dimensions', flex: 1 },
    { field: 'areaSqft', headerName: `Area (${projectData.unit})`, flex: 1 },
    { field: 'totalPrice', headerName: 'Total Price', flex: 1, valueFormatter: ({ value }) => `₹${Number(value).toLocaleString()}` },
    { field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => (<Chip label={params.value} color={params.value === 'Available' ? 'success' : params.value === 'Sold' ? 'error' : 'warning'} size="small"/>) },
  ];
  
  const projectTableColumns: GridColDef[] = [
    { field: 'project_image', headerName: 'Image', width: 100, renderCell: (params) => params.value ? <img src={params.value as string} alt="Project" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}/> : "No Image" },
    { field: 'project_name', headerName: 'Plot Title', flex: 1.5 },
    { field: 'location', headerName: 'Location', flex: 2 },
    { field: 'price', headerName: 'Price/sqft', flex: 1, renderCell: (params) => `₹${params.row.price.toLocaleString('en-IN')}` },
    { field: 'status', headerName: 'Status', flex: 1, renderCell: () => <Chip label="Verified" color="success" size="small" variant="outlined" /> },
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#16a34a', fontWeight: 900, mb: 4 }}>
       RealEstate - MySqft Property Management
      </Typography>

      {!projectCreated ? (
        <Box sx={{ mb: 4, bgcolor: '#f6fff8', borderRadius: 3, p: 3, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>Create Project</Typography>
            <form onSubmit={handleProjectSubmit}>
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField fullWidth label="Project Name" required value={projectData.projectName} onChange={e => handleFormChange('projectName', e.target.value)} error={!!formErrors.project_name} helperText={formErrors.project_name?.[0]}/>
                        <TextField fullWidth label="Location" required value={projectData.location} onChange={e => handleFormChange('location', e.target.value)} error={!!formErrors.location} helperText={formErrors.location?.[0]}/>
                    </Stack>
                    <TextField fullWidth label="Google Map Link" value={projectData.googleMapLink} onChange={e => handleFormChange('googleMapLink', e.target.value)} error={!!formErrors.google_map_link} helperText={formErrors.google_map_link?.[0]}/>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <FormControl fullWidth><InputLabel>Project Type</InputLabel><Select label="Project Type" value={projectData.projectType} onChange={e => handleFormChange('projectType', e.target.value)}><MenuItem value="Plot">Plot</MenuItem><MenuItem value="Villa">Villa</MenuItem><MenuItem value="Skyrise">Skyrise</MenuItem><MenuItem value="Residential">Residential</MenuItem><MenuItem value="Commercial">Commercial</MenuItem></Select></FormControl>
                        <TextField fullWidth label={`Price per ${projectData.unit}`} type="number" value={projectData.price} onChange={e => handleFormChange('price', Number(e.target.value))} error={!!formErrors.price} helperText={formErrors.price?.[0]}/>
                        <FormControl fullWidth><InputLabel>Unit</InputLabel><Select label="Unit" value={projectData.unit} onChange={e => handleFormChange('unit', e.target.value)}><MenuItem value="sqft">Sqft</MenuItem><MenuItem value="sqyd">Sqyd</MenuItem></Select></FormControl>
                    </Stack>
                    <TextField fullWidth label="Description" multiline rows={2} value={projectData.description} onChange={e => handleFormChange('description', e.target.value)} error={!!formErrors.description} helperText={formErrors.description?.[0]}/>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button component="label" variant='outlined'>Project Layout<input type="file" hidden onChange={(e) => setProjectLayoutFile(e.target.files?.[0] || null)} /></Button>
                        <Button component="label" variant='outlined'>Project Image<input type="file" hidden onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)} /></Button>
                        <Button component="label" variant='outlined'>Project Video<input type="file" hidden onChange={(e) => setProjectVideoFile(e.target.files?.[0] || null)} /></Button>
                        <Button component="label" variant='outlined'>Land Document<input type="file" hidden onChange={(e) => setLandDocumentFile(e.target.files?.[0] || null)} /></Button>
                    </Stack>
                    <Button type="submit" variant="contained" sx={{ bgcolor: '#16a34a', mt: 2 }}>Create Project & Add Plots</Button>
                </Stack>
            </form>
        </Box>
      ) : (
        <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 4, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, minWidth: 340, maxWidth: 440 }}>
              <Card variant="outlined" sx={{ mb: 4, borderColor: '#16a34a', boxShadow: 4, borderRadius: 3 }}>
                <CardHeader avatar={<Avatar sx={{ bgcolor: '#16a34a' }}><HomeWork /></Avatar>} title={<Typography variant="h6" sx={{ fontWeight: 700 }}>{projectData.projectName}</Typography>} sx={{ bgcolor: '#16a34a', color: '#fff' }}/>
                <CardContent sx={{ background: '#f6fff8' }}>
                  <Stack spacing={1.5}>
                    <Typography><b>Location:</b> {projectData.location}</Typography><Typography><b>Type:</b> {projectData.projectType}</Typography>
                    <Typography><b>Price:</b> ₹{projectData.price} / {projectData.unit}</Typography>
                    <Typography><b>Description:</b> {projectData.description || 'N/A'}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 2, minWidth: 340 }}>
              {plotData.length > 0 && (
                <Card variant="outlined" sx={{ mb: 4, borderColor: '#16a34a', boxShadow: 4 }}>
                  <CardHeader title="Plot Details" sx={{ bgcolor: '#16a34a', color: '#fff' }} />
                  <CardContent sx={{ background: '#f6fff8' }}><Box sx={{ height: 'auto', width: '100%' }}><DataGrid rows={plotData.map((p, i) => ({ id: i, ...p }))} columns={plotColumns} autoHeight/></Box></CardContent>
                </Card>
              )}
              <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f6fff8', borderColor: '#16a34a', boxShadow: 6 }}>
                <CardHeader title={`Plot/Unit Listing Module`} sx={{ bgcolor: '#16a34a', color: '#fff' }} />
                <CardContent>
                  <form onSubmit={handlePlotSubmit}>
                    <Stack spacing={2}>
                      <TextField fullWidth label="Plot Number" required value={newPlot.plotNumber} onChange={(e) => setNewPlot({ ...newPlot, plotNumber: e.target.value })}/>
                      <TextField fullWidth label="Dimensions" value={newPlot.dimensions} onChange={e => { const dims = e.target.value.split('x').map(d => Number(d.trim())); const area = dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1]) ? dims[0] * dims[1] : 0; setNewPlot({ ...newPlot, dimensions: e.target.value, areaSqft: area, totalPrice: area * (newPlot.sqftPrice || projectData.price) }); }}/>
                      <TextField fullWidth label={`Area (${projectData.unit})`} value={newPlot.areaSqft} onChange={e => setNewPlot({ ...newPlot, areaSqft: Number(e.target.value) })}/>
                      <TextField fullWidth label={`Price/${projectData.unit}`} value={newPlot.sqftPrice || projectData.price} onChange={e => { const sqftPrice = Number(e.target.value); setNewPlot({ ...newPlot, sqftPrice, totalPrice: newPlot.areaSqft * sqftPrice }); }} helperText="Override allowed"/>
                      <TextField fullWidth label="Total Price" value={newPlot.totalPrice} onChange={e => setNewPlot({ ...newPlot, totalPrice: Number(e.target.value) })}/>
                      <FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={newPlot.status} onChange={e => setNewPlot({ ...newPlot, status: e.target.value as any })}><MenuItem value="Available">Available</MenuItem><MenuItem value="Sold">Sold</MenuItem><MenuItem value="On Hold">On Hold</MenuItem></Select></FormControl>
                      <FormControl fullWidth><InputLabel>Facing</InputLabel><Select label="Facing" value={newPlot.facing} onChange={e => setNewPlot({ ...newPlot, facing: e.target.value as any })}><MenuItem value="North">North</MenuItem><MenuItem value="South">South</MenuItem><MenuItem value="East">East</MenuItem><MenuItem value="West">West</MenuItem></Select></FormControl>
                      <TextField fullWidth label="Remarks" value={newPlot.remarks} onChange={e => setNewPlot({ ...newPlot, remarks: e.target.value })}/>
                      <Box textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" sx={{ borderColor: '#16a34a', color: '#16a34a' }} onClick={() => setSavedPlots(true)}>Save All Plots</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: '#16a34a' }}>Add Plot</Button>
                      </Box>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
              {savedPlots && <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" sx={{ bgcolor: '#16a34a', fontSize: 18, p: '10px 24px' }} onClick={handleAddProject} disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Final Project'}</Button></Box>}
            </Box>
        </Box>
      )}

      <Box mt={8}>
        <Typography variant="h5" gutterBottom sx={{ color: '#166534', fontWeight: 700 }}>Existing Projects</Typography>
        <Card><Box sx={{ height: 'auto', width: '100%' }}><DataGrid rows={fetchedProjects} columns={projectTableColumns} getRowId={(row) => row.id} loading={isLoading} autoHeight initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[5, 10, 20]} sx={{ background: '#fff', '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f1f5f9', fontWeight: 'bold' } }}/></Box></Card>
      </Box>
    </Box>
  );
};

export default RealMySqft;