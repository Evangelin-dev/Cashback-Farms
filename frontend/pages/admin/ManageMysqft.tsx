import { Edit, HomeWork, LocationOn } from '@mui/icons-material';
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
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { message } from 'antd';
import apiClient from '@/src/utils/api/apiClient'; // Ensure this path is correct

import React, { useCallback, useEffect, useRef, useState } from 'react';

// --- Interfaces for API Data ---
interface IProject {
  id: number;
  project_name: string;
  location: string;
  google_map_link?: string;
  description?: string;
  plot_type: 'Residential' | 'Commercial' | 'Plot' | 'Villa' | 'Skyrise';
  unit: 'sqft' | 'sqyd';
  price: number;
  // File URLs will be strings from the server
  project_layout?: string;
  project_image?: string;
  project_video?: string;
  land_document?: string;
}

interface ISubplot {
  id: number;
  plot_number: string;
  dimensions: string;
  area: number;
  total_price: number;
  status: 'Available' | 'Sold' | 'On Hold';
  facing: 'North' | 'South' | 'East' | 'West';
  remarks: string;
  project: number; // Foreign Key
}

// --- Interfaces for Local Form Data ---
interface ProjectData {
  projectName: string;
  location: string;
  googleMapLink: string; // Added for the form
  projectType: 'Plot' | 'Villa' | 'Skyrise' | 'Residential' | 'Commercial'; // Expanded types
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

const ManageMysqft: React.FC = () => {
  const theme = useTheme();
  
  // --- All original state is preserved for the form flow ---
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    location: '',
    googleMapLink: '',
    projectType: 'Plot',
    price: 0,
    description: '',
    amenities: [],
    unit: 'sqft',
  });
  const [plotData, setPlotData] = useState<PlotData[]>([]);
  const [newPlot, setNewPlot] = useState<PlotData>({
    plotNumber: '',
    dimensions: '',
    areaSqft: 0,
    sqftPrice: 0,
    totalPrice: 0,
    status: 'Available',
    facing: 'North',
    remarks: '',
  });

  const [projectLayoutFile, setProjectLayoutFile] = useState<File | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectVideoFile, setProjectVideoFile] = useState<File | null>(null);
  const [landDocumentFile, setLandDocumentFile] = useState<File | null>(null);
  
  const [projectCreated, setProjectCreated] = useState(false);
  const [savedPlots, setSavedPlots] = useState(false);
  const [editPlotIdx, setEditPlotIdx] = useState<number | null>(null);

  // --- NEW state for API data and loading ---
  const [fetchedProjects, setFetchedProjects] = useState<IProject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- API Functions ---
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{data: IProject[]}>('/sqlft-projects/');
      setFetchedProjects(response.data || []);
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
    const loadingMessage = message.loading('Submitting project...', 0);

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
      const projectResponse = await apiClient.post<IProject>('/sqlft-projects/', projectPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newProjectId = projectResponse.id;
      message.success('Project created successfully! Now submitting subplots...');

      const subplotPromises = plotData.map(plot => {
        const subplotPayload = {
          project: newProjectId,
          plot_number: plot.plotNumber,
          dimensions: plot.dimensions,
          area: plot.areaSqft,
          total_price: plot.totalPrice,
          status: plot.status,
          facing: plot.facing,
          remarks: plot.remarks,
        };
        return apiClient.post('/api/subplot-units/', subplotPayload);
      });

      await Promise.all(subplotPromises);
      message.success('All subplots submitted successfully!');
      
      setProjectCreated(false);
      setSavedPlots(false);
      setProjectData({ projectName: '', location: '', googleMapLink: '', projectType: 'Plot', price: 0, description: '', amenities: [], unit: 'sqft' });
      setPlotData([]);
      setNewPlot({ plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' });
      setProjectLayoutFile(null);
      setProjectImageFile(null);
      setProjectVideoFile(null);
      setLandDocumentFile(null);

      fetchProjects();

    } catch (error) {
      console.error("Submission failed:", error);
      message.error('An error occurred during submission. Please check the console.');
    } finally {
      setIsSubmitting(false);
      loadingMessage();
    }
  };

  // --- All original handlers are preserved ---
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectCreated(true);
  };

  const handleEditProject = () => {
    setProjectCreated(false);
    setSavedPlots(false);
  };

  const handlePlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPlotIdx !== null) {
      const updatedPlots = [...plotData];
      updatedPlots[editPlotIdx] = newPlot;
      setPlotData(updatedPlots);
      setEditPlotIdx(null);
    } else {
      setPlotData([...plotData, newPlot]);
    }
    setNewPlot({ plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' });
  };
  
  const handleAmenityToggle = (amenity: string) => {
    const current = projectData.amenities;
    setProjectData({ ...projectData, amenities: current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity] });
  };

  const handleEditPlot = (idx: number) => {
    setEditPlotIdx(idx);
    setNewPlot(plotData[idx]);
    setSavedPlots(false);
  };
  
  const getFileUrl = (file: File | null | undefined) => file ? URL.createObjectURL(file) : undefined;

  const plotColumns: GridColDef[] = [
    { field: 'plotNumber', headerName: 'Plot Number', flex: 1, minWidth: 120 },
    { field: 'dimensions', headerName: 'Dimensions', flex: 1, minWidth: 120 },
    { field: 'areaSqft', headerName: `Area (${projectData.unit})`, flex: 1, minWidth: 100 },
    { field: 'sqftPrice', headerName: `Price/${projectData.unit}`, flex: 1, minWidth: 100, valueFormatter: (value: any) => `₹${value}` },
    { field: 'totalPrice', headerName: 'Total Price', flex: 1, minWidth: 120, valueFormatter: (value: any) => `₹${value}` },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 100, renderCell: (params: any) => (<Chip label={params.value} color={params.value === 'Available' ? 'success' : params.value === 'Sold' ? 'error' : 'warning'} size="small"/>) },
    { field: 'facing', headerName: 'Facing', flex: 1, minWidth: 100 },
    { field: 'remarks', headerName: 'Remarks', flex: 1.5, minWidth: 150 }
  ];

  // --- NEW: Column definitions for the project table ---
  const projectTableColumns: GridColDef[] = [
    { 
      field: 'project_image', 
      headerName: 'Image', 
      width: 100,
      renderCell: (params) => params.value ? <img src={params.value} alt="Project" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}/> : "No Image"
    },
    { field: 'project_name', headerName: 'Plot Title', flex: 1.5 },
    { field: 'location', headerName: 'Location', flex: 2 },
    {
      field: 'price',
      headerName: 'Price/sqft',
      flex: 1,
      renderCell: (params) => `₹${params.row.price.toLocaleString('en-IN')}`
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: () => <Chip label="Verified" color="success" size="small" variant="outlined" />
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small">Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#16a34a', fontWeight: 900, mb: 4 }}>
       Admin - MySqft Property Management
      </Typography>

      {/* --- UNCHANGED FORM FLOW --- */}
      {!projectCreated ? (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button variant="contained" sx={{ bgcolor: '#16a34a', color: '#fff', fontSize: 18, px: 4, py: 2 }} onClick={() => setProjectCreated(true)}>
            Create Project
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 4, bgcolor: '#f6fff8', borderRadius: 3, p: 3, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>Create Project</Typography>
            <form onSubmit={handleProjectSubmit}>
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField fullWidth label="Project Name" required value={projectData.projectName} onChange={e => setProjectData({ ...projectData, projectName: e.target.value })}/>
                        <TextField fullWidth label="Location" required value={projectData.location} onChange={e => setProjectData({ ...projectData, location: e.target.value })}/>
                    </Stack>
                    <TextField fullWidth label="Google Map Link" value={projectData.googleMapLink} onChange={e => setProjectData({ ...projectData, googleMapLink: e.target.value })}/>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <FormControl fullWidth><InputLabel>Project Type</InputLabel><Select label="Project Type" value={projectData.projectType} onChange={e => setProjectData({ ...projectData, projectType: e.target.value as any })}><MenuItem value="Plot">Plot</MenuItem><MenuItem value="Villa">Villa</MenuItem><MenuItem value="Skyrise">Skyrise</MenuItem><MenuItem value="Residential">Residential</MenuItem><MenuItem value="Commercial">Commercial</MenuItem></Select></FormControl>
                        <TextField fullWidth label={`Price per ${projectData.unit}`} type="number" value={projectData.price} onChange={e => setProjectData({ ...projectData, price: Number(e.target.value) })}/>
                        <FormControl fullWidth><InputLabel>Unit</InputLabel><Select label="Unit" value={projectData.unit} onChange={e => setProjectData({ ...projectData, unit: e.target.value as any })}><MenuItem value="sqft">Sqft</MenuItem><MenuItem value="sqyd">Sqyd</MenuItem></Select></FormControl>
                    </Stack>
                    <TextField fullWidth label="Description" multiline rows={2} value={projectData.description} onChange={e => setProjectData({ ...projectData, description: e.target.value })}/>
                    <Box sx={{ width: '100%' }}><Typography variant="subtitle1" sx={{ mb: 1 }}>Amenities</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{amenitiesList.map((a) => (<Chip key={a} label={a} color={projectData.amenities.includes(a) ? 'success' : 'default'} onClick={() => handleAmenityToggle(a)}/>))}</Box></Box>
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
      )}

      {/* --- UNCHANGED PLOT ADDITION FLOW --- */}
       <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 4, alignItems: 'flex-start' }}>
        {projectCreated && (
          <>
            <Box sx={{ flex: 1, minWidth: 340, maxWidth: 440 }}>
              <Card variant="outlined" sx={{ mb: 4, borderColor: '#16a34a', boxShadow: 4, borderRadius: 3 }}>
                <CardHeader avatar={<Avatar sx={{ bgcolor: '#16a34a' }}><HomeWork /></Avatar>} title={<Typography variant="h6" sx={{ fontWeight: 700 }}>{projectData.projectName}</Typography>} sx={{ bgcolor: '#16a34a', color: '#fff' }} action={<Button size="small" startIcon={<Edit />} sx={{ color: '#fff' }} onClick={handleEditProject}>Edit</Button>}/>
                <CardContent sx={{ background: '#f6fff8' }}>
                  <Stack spacing={1.5}>
                    <Typography><b>Location:</b> {projectData.location}</Typography>
                    <Typography><b>Type:</b> {projectData.projectType}</Typography>
                    <Typography><b>Price:</b> ₹{projectData.price} / {projectData.unit}</Typography>
                    <Typography><b>Description:</b> {projectData.description || 'N/A'}</Typography>
                    {projectLayoutFile && <Typography variant="caption">Layout: {projectLayoutFile.name}</Typography>}
                    {projectImageFile && <Typography variant="caption">Image: {projectImageFile.name}</Typography>}
                    {projectVideoFile && <Typography variant="caption">Video: {projectVideoFile.name}</Typography>}
                    {landDocumentFile && <Typography variant="caption">Document: {landDocumentFile.name}</Typography>}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 2, minWidth: 340 }}>
              {plotData.length > 0 && (
                <Card variant="outlined" sx={{ mb: 4, borderColor: '#16a34a', boxShadow: 4 }}>
                  <CardHeader title="Plot Details" sx={{ bgcolor: '#16a34a', color: '#fff' }} />
                  <CardContent sx={{ background: '#f6fff8' }}><Box sx={{ height: 340, width: '100%' }}><DataGrid rows={plotData.map((p, i) => ({ id: i, ...p }))} columns={plotColumns.concat([{ field: 'edit', headerName: 'Edit', flex: 0.7, renderCell: (params) => <Button size="small" startIcon={<Edit />} onClick={() => handleEditPlot(params.id as number)}>Edit</Button> }])} /></Box></CardContent>
                </Card>
              )}
              {!savedPlots && (
                 <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f6fff8', borderColor: '#16a34a', boxShadow: 6 }}>
                  <CardHeader title={editPlotIdx !== null ? `Edit Plot/Unit` : `Plot/Unit Listing Module`} sx={{ bgcolor: '#16a34a', color: '#fff' }} />
                  <CardContent>
                    <form onSubmit={handlePlotSubmit}>
                      <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField fullWidth label="Plot Number" required value={newPlot.plotNumber} onChange={(e) => setNewPlot({ ...newPlot, plotNumber: e.target.value })}/>
                          <TextField fullWidth label="Dimensions" value={newPlot.dimensions} onChange={e => { const dims = e.target.value.split('x').map(d => Number(d.trim())); const area = dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1]) ? dims[0] * dims[1] : 0; setNewPlot({ ...newPlot, dimensions: e.target.value, areaSqft: area, totalPrice: area * (newPlot.sqftPrice || projectData.price) }); }}/>
                          <TextField fullWidth label={`Area (${projectData.unit})`} value={newPlot.areaSqft} onChange={e => setNewPlot({ ...newPlot, areaSqft: Number(e.target.value) })}/>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField fullWidth label={`Price/${projectData.unit}`} value={newPlot.sqftPrice || projectData.price} onChange={e => { const sqftPrice = Number(e.target.value); setNewPlot({ ...newPlot, sqftPrice, totalPrice: newPlot.areaSqft * sqftPrice }); }} helperText="Override allowed"/>
                          <TextField fullWidth label="Total Price" value={newPlot.totalPrice} onChange={e => setNewPlot({ ...newPlot, totalPrice: Number(e.target.value) })}/>
                          <FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={newPlot.status} onChange={e => setNewPlot({ ...newPlot, status: e.target.value as any })}><MenuItem value="Available">Available</MenuItem><MenuItem value="Sold">Sold</MenuItem><MenuItem value="On Hold">On Hold</MenuItem></Select></FormControl>
                          <FormControl fullWidth><InputLabel>Facing</InputLabel><Select label="Facing" value={newPlot.facing} onChange={e => setNewPlot({ ...newPlot, facing: e.target.value as any })}><MenuItem value="North">North</MenuItem><MenuItem value="South">South</MenuItem><MenuItem value="East">East</MenuItem><MenuItem value="West">West</MenuItem></Select></FormControl>
                        </Stack>
                        <TextField fullWidth label="Remarks" value={newPlot.remarks} onChange={e => setNewPlot({ ...newPlot, remarks: e.target.value })}/>
                        <Box textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                          <Button variant="outlined" sx={{ borderColor: '#16a34a', color: '#16a34a' }} onClick={() => setSavedPlots(true)}>Save All Plots</Button>
                          <Button type="submit" variant="contained" sx={{ bgcolor: '#16a34a' }}>{editPlotIdx !== null ? 'Update Plot' : 'Add Plot'}</Button>
                        </Box>
                      </Stack>
                    </form>
                  </CardContent>
                </Card>
              )}
              {savedPlots && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="contained" sx={{ bgcolor: '#16a34a', fontSize: 18, p: '10px 24px' }} onClick={handleAddProject} disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Final Project'}
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* --- MODIFIED SECTION: List of Existing Projects from API using a Table --- */}
      <Box mt={8}>
        <Typography variant="h5" gutterBottom sx={{ color: '#166534', fontWeight: 700 }}>
          Existing Projects
        </Typography>
        <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                    rows={fetchedProjects}
                    columns={projectTableColumns}
                    getRowId={(row) => row.id}
                    loading={isLoading}
                    autoHeight
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5,
                          },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    sx={{
                    background: '#fff',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f1f5f9',
                        fontWeight: 'bold',
                    },
                    }}
                />
            </Box>
        </Card>
      </Box>

    </Box>
  );
};

export default ManageMysqft;