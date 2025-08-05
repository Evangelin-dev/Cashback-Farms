// import { Edit, HomeWork, Delete } from '@mui/icons-material';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Chip,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Modal,
//   Select,
//   Stack,
//   TextField,
//   Typography,
//   useTheme,
//   CircularProgress,
//   IconButton,
//   debounce
// } from '@mui/material';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { message } from 'antd';
// import apiClient from '@/src/utils/api/apiClient';

// import React, { useCallback, useEffect, useState } from 'react';


// interface IProject {
//   id: number;
//   project_name: string;
//   location: string;
//   google_map_link?: string;
//   description?: string;
//   plot_type: 'Residential' | 'Commercial' | 'Plot' | 'Villa' | 'Skyrise';
//   unit: 'sqft' | 'sqyd';
//   price: string;
//   project_layout?: string;
//   project_image?: string;
//   project_video?: string;
//   land_document?: string;
// }

// interface ISubplot {
//   id: number;
//   plot_number: string;
//   dimensions: string;
//   area: string;
//   total_price: string;
//   status: 'Available' | 'Sold' | 'On Hold';
//   facing: 'North' | 'South' | 'East' | 'West';
//   remarks: string;
//   project: number;
// }

// interface ProjectData {
//   projectName: string;
//   location: string;
//   googleMapLink: string;
//   projectType: 'Plot' | 'Villa' | 'Skyrise' | 'Residential' | 'Commercial';
//   price: number;
//   description: string;
//   unit: 'sqft' | 'sqyd';
// }

// interface PlotData {
//   id?: number;
//   plotNumber: string;
//   dimensions: string;
//   areaSqft: number;
//   sqftPrice: number;
//   totalPrice: number;
//   status: 'Available' | 'Sold' | 'On Hold';
//   facing: 'North' | 'South' | 'East' | 'West';
//   remarks: string;
// }

// const RealMySqft: React.FC = () => {
//   const theme = useTheme();

//   const [projectData, setProjectData] = useState<ProjectData>({
//     projectName: '', location: '', googleMapLink: '', projectType: 'Plot', price: 0, description: '', unit: 'sqft',
//   });
//   const [activeProject, setActiveProject] = useState<IProject | null>(null);
//   const [subplots, setSubplots] = useState<ISubplot[]>([]);
//   const [newPlot, setNewPlot] = useState<PlotData>({
//     id: undefined, plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '',
//   });

//   const [projectLayoutFile, setProjectLayoutFile] = useState<File | null>(null);
//   const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
//   const [projectVideoFile, setProjectVideoFile] = useState<File | null>(null);
//   const [landDocumentFile, setLandDocumentFile] = useState<File | null>(null);

//   const [projectCreated, setProjectCreated] = useState(false);

//   const [fetchedProjects, setFetchedProjects] = useState<IProject[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<IProject | null>(null);
//   const [editingProjectFiles, setEditingProjectFiles] = useState<Record<string, File | null>>({});

//   const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
//   const [isLocationLoading, setIsLocationLoading] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(true);

//   const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

//   const fetchLocationSuggestions = useCallback(
//     debounce(async (text: string) => {
//       if (!GEOAPIFY_API_KEY) { console.error("Geoapify API key is missing."); return; }
//       if (!text || text.length < 3) { setLocationSuggestions([]); return; }

//       setIsLocationLoading(true);
//       const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         setLocationSuggestions(data.features || []);
//       } catch (error) {
//         console.error("Error fetching Geoapify suggestions:", error);
//         setLocationSuggestions([]);
//       } finally {
//         setIsLocationLoading(false);
//       }
//     }, 400),
//     []
//   );


//   const fetchProjects = async () => {
//     setIsLoading(true);
//     try {
//       const response = await apiClient.get<{ data: IProject[] }>('/sqlft-projects/');
//       setFetchedProjects(Array.isArray(response.data) ? response.data.reverse() : []);
//     } catch (error) { message.error("Could not fetch projects."); }
//     finally { setIsLoading(false); }
//   };

//   const fetchSubplots = async (projectId: number) => {
//     try {
//       const response = await apiClient.get<{ data: ISubplot[] }>(`/subplots/by-project/${projectId}`);
//       const plotData = response.data || [];
//       setSubplots(Array.isArray(plotData) ? plotData : []);
//     } catch {
//       message.error("Could not fetch subplots.");
//       setSubplots([]);
//     }
//   };

//   useEffect(() => { fetchProjects(); }, []);

//   const handleUpdateProject = async () => {
//     if (!editingProject) return;
//     setIsSubmitting(true);
//     const formData = new FormData();
//     const initialProject = fetchedProjects.find(p => p.id === editingProject.id);

//     Object.entries(editingProject).forEach(([key, value]) => {
//       const initialValue = initialProject?.[key as keyof IProject];
//       if (key !== 'id' && String(value) !== String(initialValue)) {
//         formData.append(key, value as string);
//       }
//     });

//     Object.entries(editingProjectFiles).forEach(([key, file]) => {
//       if (file) formData.append(key, file);
//     });

//     if (Array.from(formData.keys()).length === 0) {
//       message.info("No changes were made.");
//       setEditModalOpen(false);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await apiClient.patch(`/sqlft-projects/${editingProject.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//       message.success("Project updated successfully.");
//       setEditModalOpen(false);
//       fetchProjects();
//     } catch (err: any) {
//       if (err.response?.data) {
//         const errorMsg = Object.values(err.response.data).flat().join(' ');
//         message.error(errorMsg || "Failed to update project.");
//       } else {
//         message.error("Failed to update project.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleProjectSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setFormErrors({});
//     const payload = new FormData();
//     payload.append('project_name', projectData.projectName);
//     payload.append('location', projectData.location);
//     payload.append('google_map_link', projectData.googleMapLink);
//     payload.append('plot_type', projectData.projectType);
//     payload.append('price', String(projectData.price));
//     payload.append('description', projectData.description);
//     payload.append('unit', projectData.unit);

//     if (projectLayoutFile) payload.append('project_layout', projectLayoutFile);
//     if (projectImageFile) payload.append('project_image', projectImageFile);
//     if (projectVideoFile) payload.append('project_video', projectVideoFile);
//     if (landDocumentFile) payload.append('land_document', landDocumentFile);

//     try {
//       const response = await apiClient.post<IProject>('/sqlft-projects/', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
//       setActiveProject(response);
//       setProjectCreated(true);
//       message.success("Project draft created. Now add its plots/units.");
//     } catch (error: any) {
//       if (error.response?.data) setFormErrors(error.response.data);
//       message.error("Please correct the form errors.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handlePlotSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!activeProject?.id) {
//       message.error("No active project selected. Cannot add plot.");
//       return;
//     }

//     const plotSubmissionMessage = message.loading(newPlot.id ? 'Updating plot...' : 'Adding plot...', 0);
//     const formData = new FormData();
//     formData.append('project', String(activeProject.id));
//     formData.append('plot_number', newPlot.plotNumber);
//     formData.append('dimensions', newPlot.dimensions);
//     formData.append('area', String(newPlot.areaSqft));
//     formData.append('total_price', String(newPlot.totalPrice));
//     formData.append('status', newPlot.status);
//     formData.append('facing', newPlot.facing);
//     formData.append('remarks', newPlot.remarks);

//     try {
//       if (newPlot.id) {
//         await apiClient.put(`/subplots/${newPlot.id}/`, formData);
//         message.success("Subplot updated successfully.");
//       } else {
//         await apiClient.post('/subplots/', formData);
//         message.success("Subplot added successfully.");
//       }
//       setNewPlot({ id: undefined, plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' });
//       fetchSubplots(activeProject.id);
//     } catch (err: any) {
//       console.error("Failed to save subplot:", err.response || err);
//       message.error(`Failed to save subplot.`);
//     } finally {
//       plotSubmissionMessage();
//     }
//   };

//   const handleEditPlot = (plot: ISubplot) => {
//     const area = Number(plot.area);
//     const totalPrice = Number(plot.total_price);
//     setNewPlot({
//       id: plot.id, plotNumber: plot.plot_number, dimensions: plot.dimensions,
//       areaSqft: area,
//       sqftPrice: area > 0 ? Math.round(totalPrice / area) : 0,
//       totalPrice: totalPrice,
//       status: plot.status, facing: plot.facing, remarks: plot.remarks
//     });
//   };

//   const handleDeletePlot = async (plotId: number) => {
//     if (window.confirm("Delete this subplot?")) {
//       try {
//         await apiClient.delete(`/subplots/${plotId}/`);
//         message.success("Subplot deleted.");
//         if (activeProject) fetchSubplots(activeProject.id);
//       } catch { message.error("Failed to delete subplot."); }
//     }
//   };

//   const handleFinalSubmit = () => {
//     message.success("Project workflow completed!");
//     setProjectCreated(false);
//     setActiveProject(null);
//     setSubplots([]);
//     setNewPlot({ id: undefined, plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' });
//     setProjectData({ projectName: '', location: '', googleMapLink: '', projectType: 'Plot', price: 0, description: '', unit: 'sqft' });
//     setProjectLayoutFile(null); setProjectImageFile(null); setProjectVideoFile(null); setLandDocumentFile(null);
//     fetchProjects();
//   };

//   const handleFormChange = (field: keyof ProjectData, value: any) => {
//     setProjectData(prev => ({ ...prev, [field]: value }));
//   };

//   const plotColumns: GridColDef[] = [
//     {
//       field: 'plot_number',
//       headerName: 'Plot Number',
//       flex: 1
//     },
//     {
//       field: 'dimensions',
//       headerName: 'Dimensions',
//       flex: 1
//     },
//     {
//       field: 'area',
//       headerName: `Area (${activeProject?.unit || ''})`,
//       flex: 1,
//       renderCell: (params) => {
//         const areaValue = Number(params.row.area);
//         return isNaN(areaValue) ? 'N/A' : areaValue.toFixed(2);
//       }
//     },
//     {
//       field: 'total_price',
//       headerName: 'Total Price',
//       flex: 1,
//       renderCell: (params) => {
//         const priceValue = Number(params.row.total_price);
//         return isNaN(priceValue) ? 'N/A' : `₹${priceValue.toLocaleString()}`;
//       }
//     },
//     {
//       field: 'status',
//       headerName: 'Status',
//       flex: 1,
//       renderCell: (params) => (<Chip label={params.value} color={params.value === 'Available' ? 'success' : params.value === 'Sold' ? 'error' : 'warning'} size="small" />)
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 1.5,
//       sortable: false,
//       renderCell: (params) => (
//         <Stack direction="row" spacing={0}>
//           <IconButton size="small" onClick={() => handleEditPlot(params.row)}><Edit fontSize="small" /></IconButton>
//           <IconButton size="small" color="error" onClick={() => handleDeletePlot(params.row.id)}><Delete fontSize="small" /></IconButton>
//         </Stack>
//       )
//     }
//   ];

//   const projectTableColumns: GridColDef[] = [
//     { field: 'project_image', headerName: 'Image', width: 100, renderCell: (params) => params.value ? <img src={params.value as string} alt="Project" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : "No Image" },
//     { field: 'project_name', headerName: 'Plot Title', flex: 1.5 },
//     { field: 'location', headerName: 'Location', flex: 2 },
//     { field: 'price', headerName: 'Price/sqft', flex: 1, renderCell: (params) => `₹${Number(params.row.price).toLocaleString('en-IN')}` },
//     { field: 'status', headerName: 'Status', flex: 1, renderCell: () => <Chip label="Verified" color="success" size="small" variant="outlined" /> },
//   ];

//   return (
//     <Box sx={{ p: { xs: 1, md: 4 } }}>
//       <Typography variant="h4" gutterBottom sx={{ color: '#16a34a', fontWeight: 900, mb: 4 }}>
//         RealEstate - MySqft Property Management
//       </Typography>

//       {!projectCreated ? (
//         <Box sx={{ mb: 4, bgcolor: '#f6fff8', borderRadius: 3, p: 3, maxWidth: 900, mx: 'auto' }}>
//           <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>Create Project</Typography>
//           <form onSubmit={handleProjectSubmit}>
//             <Stack spacing={2}>
//               <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
//                 <TextField fullWidth label="Project Name" required value={projectData.projectName} onChange={e => handleFormChange('projectName', e.target.value)} error={!!formErrors.project_name} helperText={formErrors.project_name?.[0]} />
//                 <Box sx={{ position: 'relative', width: '100%' }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}>
//                   <TextField
//                     fullWidth
//                     label="Location"
//                     required
//                     value={projectData.location}
//                     onChange={e => {
//                       handleFormChange('location', e.target.value);
//                       if (!showSuggestions) setShowSuggestions(true);
//                       fetchLocationSuggestions(e.target.value);
//                     }}
//                     autoComplete="off"
//                     error={!!formErrors.location}
//                     helperText={formErrors.location?.[0]}
//                   />
//                   {isLocationLoading && <CircularProgress size={20} sx={{ position: 'absolute', right: 12, top: 18 }} />}
//                   {showSuggestions && projectData.location.length >= 3 && locationSuggestions.length > 0 && (
//                     <ul className="suggestions-list">
//                       {locationSuggestions.map((suggestion, index) => (
//                         <li key={index} onMouseDown={() => {
//                           const selectedAddress = suggestion.properties.formatted;
//                           handleFormChange('location', selectedAddress);
//                           setShowSuggestions(false);
//                         }}>
//                           {suggestion.properties.formatted}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </Box>
//               </Stack>

//               <TextField fullWidth label="Google Map Link" value={projectData.googleMapLink} onChange={e => handleFormChange('googleMapLink', e.target.value)} error={!!formErrors.google_map_link} helperText={formErrors.google_map_link?.[0]} />
//               <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
//                 <FormControl fullWidth><InputLabel>Project Type</InputLabel><Select label="Project Type" value={projectData.projectType} onChange={e => handleFormChange('projectType', e.target.value)}><MenuItem value="Plot">Plot</MenuItem><MenuItem value="Villa">Villa</MenuItem><MenuItem value="Skyrise">Skyrise</MenuItem><MenuItem value="Residential">Residential</MenuItem><MenuItem value="Commercial">Commercial</MenuItem></Select></FormControl>
//                 <TextField fullWidth label={`Price per ${projectData.unit}`} type="number" value={projectData.price} onChange={e => handleFormChange('price', Number(e.target.value))} error={!!formErrors.price} helperText={formErrors.price?.[0]} />
//                 <FormControl fullWidth><InputLabel>Unit</InputLabel><Select label="Unit" value={projectData.unit} onChange={e => handleFormChange('unit', e.target.value)}><MenuItem value="sqft">Sqft</MenuItem><MenuItem value="sqyd">Sqyd</MenuItem></Select></FormControl>
//               </Stack>
//               <TextField fullWidth label="Description" multiline rows={2} value={projectData.description} onChange={e => handleFormChange('description', e.target.value)} error={!!formErrors.description} helperText={formErrors.description?.[0]} />
//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
//                 <Button component="label" variant='outlined'>Project Layout<input type="file" hidden onChange={(e) => setProjectLayoutFile(e.target.files?.[0] || null)} /></Button>
//                 <Button component="label" variant='outlined'>Project Image<input type="file" hidden onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)} /></Button>
//                 <Button component="label" variant='outlined'>Project Video<input type="file" hidden onChange={(e) => setProjectVideoFile(e.target.files?.[0] || null)} /></Button>
//                 <Button component="label" variant='outlined'>Land Document<input type="file" hidden onChange={(e) => setLandDocumentFile(e.target.files?.[0] || null)} /></Button>
//               </Stack>
//               <Button type="submit" variant="contained" sx={{ bgcolor: '#16a34a', mt: 2 }} disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create and Add Sub-Plots'}</Button>
//             </Stack>
//           </form>
//         </Box>
//       ) : (
//         <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 4, alignItems: 'flex-start' }}>
//           <Box sx={{ flex: 1, minWidth: 340, maxWidth: 440, position: 'sticky', top: '20px' }}>
//             <Card variant="outlined" sx={{ mb: 4, borderColor: '#16a34a', boxShadow: 4, borderRadius: 3 }}>
//               <CardHeader avatar={<Avatar sx={{ bgcolor: '#16a34a' }}><HomeWork /></Avatar>} title={<Typography variant="h6" sx={{ fontWeight: 700 }}>{activeProject?.project_name}</Typography>} sx={{ bgcolor: '#16a34a', color: '#fff' }} action={<Button size="small" startIcon={<Edit />} sx={{ color: '#fff' }} onClick={() => { setProjectCreated(false); setProjectData({ ...projectData, projectName: activeProject?.project_name ?? '', location: activeProject?.location ?? '' }); setActiveProject(null); setSubplots([]) }}>Edit</Button>} />
//               <CardContent sx={{ background: '#f6fff8' }}>
//                 <Stack spacing={1.5}>
//                   <Typography><b>Location:</b> {activeProject?.location}</Typography><Typography><b>Type:</b> {activeProject?.plot_type}</Typography>
//                   <Typography><b>Price:</b> ₹{Number(activeProject?.price).toLocaleString()} / {activeProject?.unit}</Typography>
//                   <Typography><b>Description:</b> {activeProject?.description || 'N/A'}</Typography>
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Box>
//           <Box sx={{ flex: 2, minWidth: 340 }}>
//             {subplots.length > 0 && (
//               <Card variant="outlined" sx={{ mb: 4, borderColor: '#16a34a', boxShadow: 4 }}>
//                 <CardHeader title="Plot Details" sx={{ bgcolor: '#16a34a', color: '#fff' }} />
//                 <CardContent sx={{ background: '#f6fff8' }}><Box sx={{ height: 'auto', width: '100%' }}><DataGrid rows={subplots} columns={plotColumns} getRowId={row => row.id} autoHeight hideFooter /></Box></CardContent>
//               </Card>
//             )}
//             <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f6fff8', borderColor: '#16a34a', boxShadow: 6 }}>
//               <CardHeader title={newPlot.id ? `Edit Plot/Unit #${newPlot.plotNumber}` : `Add New Plot/Unit`} sx={{ bgcolor: '#16a34a', color: '#fff' }} />
//               <CardContent>
//                 <form onSubmit={handlePlotSubmit}>
//                   <Stack spacing={2}>
//                     <TextField fullWidth label="Plot Number" required value={newPlot.plotNumber} onChange={(e) => setNewPlot({ ...newPlot, plotNumber: e.target.value })} />
//                     <TextField fullWidth label="Dimensions (e.g., 30x40)" value={newPlot.dimensions} onChange={e => { const dims = e.target.value.split('x').map(d => Number(d.trim())); const area = dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1]) ? dims[0] * dims[1] : 0; setNewPlot({ ...newPlot, dimensions: e.target.value, areaSqft: area, totalPrice: area * (newPlot.sqftPrice || Number(activeProject?.price) || 0) }); }} />
//                     <TextField fullWidth type="number" label={`Area (${activeProject?.unit})`} value={newPlot.areaSqft} onChange={e => setNewPlot({ ...newPlot, areaSqft: Number(e.target.value), totalPrice: Number(e.target.value) * (newPlot.sqftPrice || Number(activeProject?.price) || 0) })} />
//                     <TextField fullWidth type="number" label={`Price/${activeProject?.unit}`} value={newPlot.sqftPrice || Number(activeProject?.price) || ''} onChange={e => { const sqftPrice = Number(e.target.value); setNewPlot({ ...newPlot, sqftPrice, totalPrice: newPlot.areaSqft * sqftPrice }); }} helperText="Defaults to project price, can be overridden." />
//                     <TextField fullWidth type="number" label="Total Price" value={newPlot.totalPrice} onChange={e => setNewPlot({ ...newPlot, totalPrice: Number(e.target.value) })} />
//                     <FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={newPlot.status} onChange={e => setNewPlot({ ...newPlot, status: e.target.value as any })}><MenuItem value="Available">Available</MenuItem><MenuItem value="Sold">Sold</MenuItem><MenuItem value="On Hold">On Hold</MenuItem></Select></FormControl>
//                     <FormControl fullWidth><InputLabel>Facing</InputLabel><Select label="Facing" value={newPlot.facing} onChange={e => setNewPlot({ ...newPlot, facing: e.target.value as any })}><MenuItem value="North">North</MenuItem><MenuItem value="South">South</MenuItem><MenuItem value="East">East</MenuItem><MenuItem value="West">West</MenuItem></Select></FormControl>
//                     <TextField fullWidth label="Remarks" value={newPlot.remarks} onChange={e => setNewPlot({ ...newPlot, remarks: e.target.value })} />
//                     <Box textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//                       {newPlot.id && <Button variant="outlined" onClick={() => setNewPlot({ id: undefined, plotNumber: '', dimensions: '', areaSqft: 0, sqftPrice: 0, totalPrice: 0, status: 'Available', facing: 'North', remarks: '' })}>Cancel Edit</Button>}
//                       <Button type="submit" variant="contained" sx={{ bgcolor: '#16a34a' }}>{newPlot.id ? 'Update Plot' : 'Add Plot'}</Button>
//                     </Box>
//                   </Stack>
//                 </form>
//               </CardContent>
//             </Card>
//             <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" sx={{ bgcolor: '#16a34a', fontSize: 18, p: '10px 24px' }} onClick={handleFinalSubmit}>Finish & Save Project</Button></Box>
//           </Box>
//         </Box>
//       )}

//       <Box mt={8}>
//         <Typography variant="h5" gutterBottom sx={{ color: '#166534', fontWeight: 700 }}>Existing Projects</Typography>
//         <Card><Box sx={{ height: 'auto', width: '100%' }}><DataGrid rows={fetchedProjects} columns={projectTableColumns} getRowId={(row) => row.id} loading={isLoading} autoHeight initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[5, 10, 20]} sx={{ background: '#fff', '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f1f5f9', fontWeight: 'bold' } }} /></Box></Card>
//       </Box>

//       <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
//         <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', md: 700 }, bgcolor: 'background.paper', p: 4, borderRadius: 2, maxHeight: '90vh', overflowY: 'auto' }}>
//           <Typography variant="h6" component="h2" mb={3}>Edit Project</Typography>
//           {editingProject && (
//             <Stack spacing={2}>
//               <TextField label="Project Name" defaultValue={editingProject.project_name} onChange={e => setEditingProject({ ...editingProject, project_name: e.target.value })} />

//               <Box sx={{ position: 'relative' }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}>
//                 <TextField
//                   fullWidth
//                   label="Location"
//                   value={editingProject.location}
//                   onChange={e => {
//                     setEditingProject({ ...editingProject, location: e.target.value });
//                     if (!showSuggestions) setShowSuggestions(true);
//                     fetchLocationSuggestions(e.target.value);
//                   }}
//                   autoComplete="off"
//                 />
//                 {isLocationLoading && <CircularProgress size={20} sx={{ position: 'absolute', right: 12, top: 18 }} />}
//                 {showSuggestions && editingProject.location.length >= 3 && locationSuggestions.length > 0 && (
//                   <ul className="suggestions-list">
//                     {locationSuggestions.map((suggestion, index) => (
//                       <li key={index} onMouseDown={() => {
//                         const selectedAddress = suggestion.properties.formatted;
//                         setEditingProject({ ...editingProject, location: selectedAddress });
//                         setShowSuggestions(false);
//                       }}>
//                         {suggestion.properties.formatted}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </Box>

//               <TextField label="Google Map Link" defaultValue={editingProject.google_map_link || ''} onChange={e => setEditingProject({ ...editingProject, google_map_link: e.target.value })} />
//               <TextField label="Description" multiline rows={3} defaultValue={editingProject.description || ''} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} />
//               <Stack direction="row" spacing={2}>
//                 <FormControl fullWidth><InputLabel>Project Type</InputLabel><Select label="Project Type" value={editingProject.plot_type} onChange={e => setEditingProject({ ...editingProject, plot_type: e.target.value as IProject['plot_type'] })}><MenuItem value="Plot">Plot</MenuItem><MenuItem value="Villa">Villa</MenuItem><MenuItem value="Skyrise">Skyrise</MenuItem><MenuItem value="Residential">Residential</MenuItem><MenuItem value="Commercial">Commercial</MenuItem></Select></FormControl>
//                 <TextField fullWidth label="Price" type="number" defaultValue={Number(editingProject.price)} onChange={e => setEditingProject({ ...editingProject, price: e.target.value })} />
//                 <FormControl fullWidth><InputLabel>Unit</InputLabel><Select label="Unit" value={editingProject.unit} onChange={e => setEditingProject({ ...editingProject, unit: e.target.value as IProject['unit'] })}><MenuItem value="sqft">Sqft</MenuItem><MenuItem value="sqyd">Sqyd</MenuItem></Select></FormControl>
//               </Stack>
//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
//                 <Button component="label" variant='outlined'>Update Layout<input type="file" hidden onChange={(e) => setEditingProjectFiles(f => ({ ...f, project_layout: e.target.files?.[0] || null }))} /></Button>
//                 <Button component="label" variant='outlined'>Update Image<input type="file" hidden onChange={(e) => setEditingProjectFiles(f => ({ ...f, project_image: e.target.files?.[0] || null }))} /></Button>
//                 <Button component="label" variant='outlined'>Update Video<input type="file" hidden onChange={(e) => setEditingProjectFiles(f => ({ ...f, project_video: e.target.files?.[0] || null }))} /></Button>
//                 <Button component="label" variant='outlined'>Update Document<input type="file" hidden onChange={(e) => setEditingProjectFiles(f => ({ ...f, land_document: e.target.files?.[0] || null }))} /></Button>
//               </Stack>
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
//                 <Button variant="outlined" onClick={() => setEditModalOpen(false)}>Cancel</Button>
//                 <Button variant="contained" onClick={handleUpdateProject} disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}</Button>
//               </Box>
//             </Stack>
//           )}
//         </Box>
//       </Modal>

//       <style>{`.suggestions-list { position: absolute; background: white; border: 1px solid #d9d9d9; border-radius: 6px; list-style: none; margin: 0; padding: 4px; z-index: 1301; width: 100%; max-height: 200px; overflow-y: auto; box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08); } .suggestions-list li { padding: 8px 12px; cursor: pointer; } .suggestions-list li:hover { background-color: #f5f5f5; }`}</style>
//     </Box>
//   );
// };

// export default RealMySqft;