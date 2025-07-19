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
  useTheme
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


import React, { useCallback, useRef, useState } from 'react';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const RealMySqft: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Geoapify location autocomplete state/hooks (must be inside component)
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Pagination state
  const [pageSize, setPageSize] = useState(5);

  const fetchLocationSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!GEOAPIFY_API_KEY) { console.error("Geoapify API key is missing."); return; }
      if (!text || text.length < 3) { setLocationSuggestions([]); return; }
      setIsLocationLoading(true);
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setLocationSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching Geoapify suggestions:", error);
        setLocationSuggestions([]);
      } finally {
        setIsLocationLoading(false);
      }
    }, 400),
    []
  );

  React.useEffect(() => {
    if (showSuggestions) {
      fetchLocationSuggestions(locationInput);
    }
  }, [locationInput, fetchLocationSuggestions, showSuggestions]);

  const handleLocationBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

// Extend ProjectData to include uploaded files for display in allProjects
interface ProjectData {
  projectName: string;
  location: string;
  projectType: 'Plot' | 'Villa' | 'Skyrise';
  sqftPrice: number;
  projectMap: File | null;
  description: string;
  amenities: string[];
  plotImageFile?: File | null;
  plotVideoFile?: File | null;
  layoutLandPdf?: File | null;
  landDocsPdf?: File | null;
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

// Column definitions for the DataGrid
const plotColumns: GridColDef[] = [
  { field: 'plotNumber', headerName: 'Plot Number', flex: 1, minWidth: 120 },
  { field: 'dimensions', headerName: 'Dimensions', flex: 1, minWidth: 120 },
  {
    field: 'areaSqft',
    headerName: 'Area (Sqft)',
    flex: 1,
    minWidth: 100,
    valueFormatter: (value: any) => `${value} sqft`
  },
  {
    field: 'sqftPrice',
    headerName: 'Price/Sqft',
    flex: 1,
    minWidth: 100,
    valueFormatter: (value: any) => `₹${value}`
  },
  {
    field: 'totalPrice',
    headerName: 'Total Price',
    flex: 1,
    minWidth: 120,
    valueFormatter: (value: any) => `₹${value}`
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    flex: 1, 
    minWidth: 100,
    renderCell: (params: any) => (
      <Chip 
        label={params.value}
        color={params.value === 'Available' ? 'success' : params.value === 'Sold' ? 'error' : 'warning'}
        size="small"
      />
    )
  },
  { field: 'facing', headerName: 'Facing', flex: 1, minWidth: 100 },
  { field: 'remarks', headerName: 'Remarks', flex: 1.5, minWidth: 150 }
];

const districts = ['District 1', 'District 2', 'District 3'];
const amenitiesList = ['Gated', 'Water Supply', 'Roads', 'Electricity', 'Park'];


  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    location: '',
    projectType: 'Plot',
    sqftPrice: 0,
    projectMap: null,
    description: '',
    amenities: [],
  });



  const [plotData, setPlotData] = useState<PlotData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plotImageInputRef = useRef<HTMLInputElement>(null);
  const plotVideoInputRef = useRef<HTMLInputElement>(null);
  const [plotImageFile, setPlotImageFile] = useState<File | null>(null);
  const [plotVideoFile, setPlotVideoFile] = useState<File | null>(null);
  const [projectMapFile, setProjectMapFile] = useState<File | null>(null);
  const [layoutLandPdf, setLayoutLandPdf] = useState<File | null>(null);
  const [landDocsPdf, setLandDocsPdf] = useState<File | null>(null);
  const layoutLandPdfInputRef = useRef<HTMLInputElement>(null);
  const landDocsPdfInputRef = useRef<HTMLInputElement>(null);

  const [projectCreated, setProjectCreated] = useState(false);
  const [savedPlots, setSavedPlots] = useState(false);

  // Store all completed projects and their plots
  const [allProjects, setAllProjects] = useState<
    { project: ProjectData; plots: PlotData[] }[]
  >([]);

  // Edit state
  const [editProject, setEditProject] = useState(false);
  const [editPlotIdx, setEditPlotIdx] = useState<number | null>(null);

  // Add unit selection state, default to 'Sqft'
  const [unit, setUnit] = useState<'Sqft' | 'Sqyd'>('Sqft');

  // Selected project for top card-table view
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(null);
  const [showSubplotsDropdown, setShowSubplotsDropdown] = useState(false);
  // Microplot form state
  const [showMicroplotForm, setShowMicroplotForm] = useState(false);
  const [microplot, setMicroplot] = useState({
    plotNumber: '',
    dimensions: '',
    areaSqft: 0,
    sqftPrice: 0,
    totalPrice: 0,
    status: 'Available',
    facing: 'North',
    remarks: '',
  });
  // Subplot dropdown selection
  const [selectedSubplotIdx, setSelectedSubplotIdx] = useState<number | null>(null);

  // Add state for Google Map link
  // Google Map link removed

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectCreated(true);
    console.log('Project submitted:', projectData);
  };

  // Edit project handler
  const handleEditProject = () => {
    setEditProject(true);
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
    setNewPlot({
      plotNumber: '',
      dimensions: '',
      areaSqft: 0,
      sqftPrice: 0,
      totalPrice: 0,
      status: 'Available',
      facing: 'North',
      remarks: '',
    });
  };

  // Update handleFileUpload to set projectMapFile
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectData({ ...projectData, projectMap: file });
      setProjectMapFile(file);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = projectData.amenities;
    if (current.includes(amenity)) {
      setProjectData({
        ...projectData,
        amenities: current.filter((a) => a !== amenity),
      });
    } else {
      setProjectData({
        ...projectData,
        amenities: [...current, amenity],
      });
    }
  };

  const handleDimensionsChange = (value: string) => {
    const dims = value.split('x');
    const area = dims.length === 2 ? Number(dims[0]) * Number(dims[1]) : 0;
    setNewPlot({
      ...newPlot,
      dimensions: value,
      areaSqft: area,
      totalPrice: area * newPlot.sqftPrice,
    });
  };

  const handleSqftPriceChange = (value: number) => {
    setNewPlot({
      ...newPlot,
      sqftPrice: value,
      totalPrice: newPlot.areaSqft * value,
    });
  };

  // Helper for plot area calculation
  const getArea = (dimensions: string) => {
    const dims = dimensions.split('x').map((d) => Number(d.trim()));
    return dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1]) ? dims[0] * dims[1] : 0;
  };

  // When "Add Project" is clicked, save the current project+plots and reset for new entry
  const handleAddProject = () => {
    setAllProjects([
      ...allProjects,
      {
        project: {
          ...projectData,
          projectMap: projectMapFile,
          plotImageFile,
          plotVideoFile,
          layoutLandPdf,
          landDocsPdf,
        },
        plots: plotData
      }
    ]);
    setProjectCreated(false);
    setSavedPlots(false);
    setProjectData({
      projectName: '',
      location: '',
      projectType: 'Plot',
      sqftPrice: 0,
      projectMap: null,
      description: '',
      amenities: [],
    });
    setPlotData([]);
    setNewPlot({
      plotNumber: '',
      dimensions: '',
      areaSqft: 0,
      sqftPrice: 0,
      totalPrice: 0,
      status: 'Available',
      facing: 'North',
      remarks: '',
    });
    setProjectMapFile(null);
    setPlotImageFile(null);
    setPlotVideoFile(null);
    setLayoutLandPdf(null);
    setLandDocsPdf(null);
  };

  // Add this function to handle plot editing
  const handleEditPlot = (idx: number) => {
    setEditPlotIdx(idx);
    setNewPlot(plotData[idx]);
    setSavedPlots(false);
  };

  // Add these state hooks if missing
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

  // Helper to get preview URL for a File object
  const getFileUrl = (file: File | null | undefined) =>
    file ? URL.createObjectURL(file) : undefined;

  return (
    <Box
      sx={{
        p: { xs: 1, md: 4 },
        bgcolor: 'linear-gradient(135deg, #f8faf7 60%, #e0f2f1 100%)',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#16a34a',
          fontWeight: 900,
          mb: 4,
          letterSpacing: 1,
          textShadow: '1px 2px 8px #d1fae5',
        }}
      >
       RealEstate - MySqft <span style={{ fontWeight: 400, fontSize: 18, color: '#166534' }}>Property Management</span>
      </Typography>

      {/* Show 'Create Project' button first, then show form after click */}
      {allProjects.length === 0 ? (
        !projectCreated ? (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              sx={{ bgcolor: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 18, px: 4, py: 2, borderRadius: 2, boxShadow: 2 }}
              onClick={() => setProjectCreated(true)}
            >
              Create Project
            </Button>
          </Box>
        ) : (
          <Box sx={{ mb: 4, bgcolor: '#f6fff8', borderRadius: 3, boxShadow: 2, p: 3, maxWidth: { xs: 600, md: 900 }, width: { xl: '100%', md: 900 }, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>Create Project</Typography>
            <form onSubmit={e => {
              e.preventDefault();
              setAllProjects([
                ...allProjects,
                {
                  project: { ...projectData },
                  plots: [],
                },
              ]);
              setProjectData({
                projectName: '',
                location: '',
                projectType: 'Plot',
                sqftPrice: 0,
                projectMap: null,
                description: '',
                amenities: [],
              });
              setProjectCreated(false);
            }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    required
                    value={projectData.projectName}
                    onChange={e => setProjectData({ ...projectData, projectName: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    required
                    value={projectData.location}
                    onChange={e => setProjectData({ ...projectData, location: e.target.value })}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Project Type</InputLabel>
                    <Select
                      label="Project Type"
                      value={projectData.projectType}
                      onChange={e => setProjectData({ ...projectData, projectType: e.target.value as any })}
                    >
                      <MenuItem value="Plot">Plot</MenuItem>
                      <MenuItem value="Villa">Villa</MenuItem>
                      <MenuItem value="Skyrise">Skyrise</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label={`Price per ${unit}`}
                    type="number"
                    value={projectData.sqftPrice}
                    onChange={e => setProjectData({ ...projectData, sqftPrice: Number(e.target.value) })}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      label="Unit"
                      value={unit}
                      onChange={e => setUnit(e.target.value as 'Sqft' | 'Sqyd')}
                    >
                      <MenuItem value="Sqft">Sqft</MenuItem>
                      <MenuItem value="Sqyd">Sqyd</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={projectData.description}
                    onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                  />
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Amenities</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {amenitiesList.map((a) => (
                        <Chip
                          key={a}
                          label={a}
                          color={projectData.amenities.includes(a) ? 'success' : 'default'}
                          onClick={() => handleAmenityToggle(a)}
                          sx={{ bgcolor: projectData.amenities.includes(a) ? '#16a34a' : undefined, color: projectData.amenities.includes(a) ? '#fff' : undefined, fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: '#16a34a', color: '#fff', fontWeight: 700, mt: 2 }}
                >
                  Create Project
                </Button>
              </Stack>
            </form>
          </Box>
        )
      ) : (
        <Box sx={{ mb: 4, bgcolor: '#f8fafc', borderRadius: 3, boxShadow: 2, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#166534' }}>Projects</Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: '#166534', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 1 }}
              onClick={() => setShowMicroplotForm(true)}
            >
              Add Microplot
            </Button>
          </Box>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ background: '#f1f5f9' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, color: '#334155', fontSize: 16 }}>PROJECT NAME</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, color: '#334155', fontSize: 16 }}># PLOTS</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, color: '#334155', fontSize: 16 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map((entry, idx) => (
                <React.Fragment key={idx}>
                  <tr style={{ background: selectedProjectIdx === idx ? '#e0f2f1' : '#fff', cursor: 'pointer', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#16a34a', mr: 2 }}>{entry.project.projectName[0]}</Avatar>
                      <span style={{ fontWeight: 600, fontSize: 17 }}>{entry.project.projectName}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px' }}>
                      <Chip label={entry.plots.length} sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 700, fontSize: 16 }} />
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px' }}>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 1 }}
                        onClick={() => setSelectedProjectIdx(selectedProjectIdx === idx ? null : idx)}
                      >
                        {selectedProjectIdx === idx ? 'Hide Details' : 'View Details'}
                      </Button>
                    </td>
                  </tr>
                  {/* Expandable details row */}
                  {selectedProjectIdx === idx && (
                    <tr>
                      <td colSpan={3} style={{ background: '#f8fafc', padding: 0 }}>
                        <Box sx={{ p: 2, borderRadius: 2, boxShadow: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>{entry.project.projectName} Details</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            <Box sx={{ minWidth: 220 }}>
                              <Typography><b>Location:</b> {entry.project.location}</Typography>
                              <Typography><b>Type:</b> {entry.project.projectType}</Typography>
                              <Typography><b>Price:</b> ₹{entry.project.sqftPrice}</Typography>
                              <Typography><b>Description:</b> {entry.project.description || <span style={{ color: '#aaa' }}>No description</span>}</Typography>
                              <Typography><b>Amenities:</b> {entry.project.amenities.length === 0 ? <span style={{ color: '#aaa' }}>None</span> : entry.project.amenities.join(', ')}</Typography>
                            </Box>
                            <Box sx={{ minWidth: 220 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Plots</Typography>
                              {entry.plots.length === 0 ? (
                                <Typography>No plots added.</Typography>
                              ) : (
                                <ul style={{ paddingLeft: 18 }}>
                                  {entry.plots.map((plot, pidx) => (
                                    <li key={pidx} style={{ marginBottom: 8 }}>
                                      <b>{plot.plotNumber}</b> - {plot.dimensions} ({plot.status})
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      {/* Microplot Form Modal/Section */}
      {showMicroplotForm && (
        <Box sx={{ mb: 4, p: 3, bgcolor: '#e0f7fa', borderRadius: 2, boxShadow: 2, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>Add Microplot</Typography>
          <form onSubmit={e => {
            e.preventDefault();
            // Add microplot to first project for demo (can be changed to selected project)
            if (allProjects.length > 0) {
              const updatedProjects = [...allProjects];
              updatedProjects[0].plots.push({
                ...microplot,
                status: microplot.status as 'Available' | 'Sold' | 'On Hold',
                facing: microplot.facing as 'North' | 'South' | 'East' | 'West',
              });
              setAllProjects(updatedProjects);
            }
            setMicroplot({
              plotNumber: '',
              dimensions: '',
              areaSqft: 0,
              sqftPrice: 0,
              totalPrice: 0,
              status: 'Available',
              facing: 'North',
              remarks: '',
            });
            setShowMicroplotForm(false);
          }}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                fullWidth
                label="Plot Number/Name"
                required
                value={microplot.plotNumber}
                onChange={e => setMicroplot({ ...microplot, plotNumber: e.target.value })}
              />
              <TextField
                fullWidth
                label="Dimensions (e.g., 30x40)"
                value={microplot.dimensions}
                onChange={e => {
                  const dims = e.target.value.split('x').map(d => Number(d.trim()));
                  const area = dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1]) ? dims[0] * dims[1] : 0;
                  setMicroplot({
                    ...microplot,
                    dimensions: e.target.value,
                    areaSqft: area,
                    totalPrice: area * (microplot.sqftPrice || (allProjects.length > 0 ? allProjects[0].project.sqftPrice : 0)),
                  });
                }}
              />
              <TextField
                fullWidth
                label={`Area in ${unit}`}
                value={microplot.areaSqft}
                onChange={e => setMicroplot({ ...microplot, areaSqft: Number(e.target.value) })}
              />
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={`${unit} Price`}
                value={microplot.sqftPrice || (allProjects.length > 0 ? allProjects[0].project.sqftPrice : '')}
                onChange={e => {
                  const sqftPrice = Number(e.target.value);
                  setMicroplot({
                    ...microplot,
                    sqftPrice,
                    totalPrice: microplot.areaSqft * sqftPrice,
                  });
                }}
                helperText="Override allowed"
              />
              <TextField
                fullWidth
                label="Total Price"
                value={microplot.totalPrice}
                onChange={e => setMicroplot({ ...microplot, totalPrice: Number(e.target.value) })}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={microplot.status}
                  onChange={e => setMicroplot({ ...microplot, status: e.target.value as any })}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Sold">Sold</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Facing</InputLabel>
                <Select
                  label="Facing"
                  value={microplot.facing}
                  onChange={e => setMicroplot({ ...microplot, facing: e.target.value as any })}
                >
                  <MenuItem value="North">North</MenuItem>
                  <MenuItem value="South">South</MenuItem>
                  <MenuItem value="East">East</MenuItem>
                  <MenuItem value="West">West</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              fullWidth
              label="Remarks"
              value={microplot.remarks}
              onChange={e => setMicroplot({ ...microplot, remarks: e.target.value })}
              sx={{ mt: 2 }}
            />
            <Box textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ bgcolor: '#fff', color: '#16a34a', borderColor: '#16a34a', '&:hover': { bgcolor: '#bbf7d0', borderColor: '#16a34a' }, fontWeight: 700, minWidth: 140 }}
                onClick={() => setShowMicroplotForm(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#166534' }, fontWeight: 700, minWidth: 140 }}
              >
                Add Microplot
              </Button>
            </Box>
          </form>
        </Box>
      )}

      <Box
        sx={{
          display: { xs: 'block', md: 'flex' },
          gap: 4,
          alignItems: 'flex-start',
        }}
      >
        {/* Left: All Project Details Cards (old and current) */}
        <Box sx={{ flex: 1, minWidth: 340, maxWidth: 440 }}>
          {/* Render all completed projects (list, click to select for top card-table) */}
          {allProjects.map((entry, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                mb: 4,
                bgcolor: selectedProjectIdx === idx ? '#bbf7d0' : '#fff',
                borderColor: '#16a34a',
                boxShadow: 4,
                borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 8, cursor: 'pointer' },
              }}
              onClick={() => setSelectedProjectIdx(idx)}
            >
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: '#16a34a', width: 48, height: 48 }}><HomeWork fontSize="large" /></Avatar>}
                title={
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {entry.project.projectName}
                  </Typography>
                }
                sx={{ bgcolor: '#16a34a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                action={
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    sx={{ color: '#000000' }}
                    disabled
                  >
                    Edit
                  </Button>
                }
              />
              <CardContent sx={{ background: '#f6fff8', borderRadius: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <LocationOn sx={{ mr: 1, color: '#16a34a' }} /> {entry.project.location}
                  </Typography>
                  <Typography variant="body2"><b>Type:</b> {entry.project.projectType}</Typography>
                  <Typography variant="body2">
                    <b>{unit} Price:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{entry.project.sqftPrice}</span>
                  </Typography>
                  <Typography variant="body2">
                    <b>Description:</b> {entry.project.description || <span style={{ color: '#aaa' }}>No description</span>}
                  </Typography>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><b>Amenities:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {entry.project.amenities.length === 0
                        ? <Typography variant="caption" color="text.secondary">None</Typography>
                        : entry.project.amenities.map((a) => (
                          <Chip key={a} label={a} size="small" sx={{ bgcolor: '#16a34a', color: '#fff', fontWeight: 600 }} />
                        ))}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {/* Current project details card (while entering plot details or after save plots) */}
          {projectCreated && (
            <Card
              variant="outlined"
              sx={{
                mb: 4,
                bgcolor: '#fff',
                borderColor: '#16a34a',
                boxShadow: 4,
                borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 8 },
              }}
            >
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: '#16a34a', width: 48, height: 48 }}><HomeWork fontSize="large" /></Avatar>}
                title={
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {projectData.projectName}
                  </Typography>
                }
                sx={{ bgcolor: '#16a34a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                action={
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    sx={{ color: '#166534' }}
                    onClick={handleEditProject}
                  >
                    Edit
                  </Button>
                }
              />
              <CardContent sx={{ background: '#f6fff8', borderRadius: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <LocationOn sx={{ mr: 1, color: '#16a34a' }} /> {projectData.location}
                  </Typography>
                 
                  <Typography variant="body2"><b>Type:</b> {projectData.projectType}</Typography>
                  <Typography variant="body2">
                    <b>{unit} Price:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{projectData.sqftPrice}</span>
                  </Typography>
                  <Typography variant="body2">
                    <b>Description:</b> {projectData.description || <span style={{ color: '#aaa' }}>No description</span>}
                  </Typography>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><b>Amenities:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {projectData.amenities.length === 0
                        ? <Typography variant="caption" color="text.secondary">None</Typography>
                        : projectData.amenities.map((a) => (
                          <Chip key={a} label={a} size="small" sx={{ bgcolor: '#16a34a', color: '#fff', fontWeight: 600 }} />
                        ))}
                    </Box>
                  </Box>
                  {/* Uploaded files display */}
                  {projectMapFile && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2"><b>Project Layout:</b> {projectMapFile.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={getFileUrl(projectMapFile)}
                          alt="Project Layout"
                          style={{ maxWidth: 220, maxHeight: 160, borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      </Box>
                    </Box>
                  )}
                  {plotImageFile && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2"><b>Project Image:</b> {plotImageFile.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={getFileUrl(plotImageFile)}
                          alt="Project"
                          style={{ maxWidth: 220, maxHeight: 160, borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      </Box>
                    </Box>
                  )}
                  {/* Show uploaded project video as original after create project */}
                  {plotVideoFile && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2"><b>Project Video:</b> {plotVideoFile.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <video
                          src={getFileUrl(plotVideoFile)}
                          controls
                          style={{ maxWidth: 220, maxHeight: 160, borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      </Box>
                    </Box>
                  )}
                  {layoutLandPdf && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <b>Layout and Land PDF:</b> {layoutLandPdf.name}
                    </Typography>
                  )}
                  {landDocsPdf && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <b>Land Documents PDF:</b> {landDocsPdf.name}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
         
        </Box>

        {/* Right: Plot/Unit Listing Module or Plot Details */}
        <Box sx={{ flex: 2, minWidth: 340 }}>
          {/* Render all completed plot details cards */}
          {allProjects.map((entry, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                mb: 4,
                bgcolor: '#fff',
                borderColor: '#16a34a',
                boxShadow: 4,
                borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 8 },
              }}
            >
              <CardHeader
                title={`Plot Details${entry.project.projectName ? `: ${entry.project.projectName}` : ''}`}
                sx={{ bgcolor: '#16a34a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent sx={{ background: '#f6fff8', borderRadius: 2 }}>
                {entry.plots.length === 0 ? (
                  <Typography>No plots added.</Typography>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{ height: 340, width: '100%' }}>
                      <DataGrid
                        rows={entry.plots.map((plot, idx) => ({ id: idx, ...plot }))}
                        columns={plotColumns}
                        pagination
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{ pagination: { paginationModel: { pageSize: pageSize } } }}
                        autoHeight
                        disableRowSelectionOnClick
                        sx={{
                          background: '#fff',
                          fontSize: 15,
                          borderRadius: 2,
                          '& .MuiDataGrid-columnHeaders': {
                            background: '#bbf7d0',
                            color: '#166534',
                            fontWeight: 700,
                          },
                          '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #eee',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
          {/* Current plot details card (while entering plot details or after save plots) */}
          {projectCreated && (
            <Card
              variant="outlined"
              sx={{
                mb: 4,
                bgcolor: '#fff',
                borderColor: '#16a34a',
                boxShadow: 4,
                borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 8 },
              }}
            >
              <CardHeader
                title="Plot Details"
                sx={{ bgcolor: '#16a34a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent sx={{ background: '#f6fff8', borderRadius: 2 }}>
                {plotData.length === 0 ? (
                  <Typography>No plots added.</Typography>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{ height: 340, width: '100%' }}>
                      <DataGrid
                        rows={plotData.map((plot, idx) => ({ id: idx, ...plot }))}
                        columns={plotColumns.concat([
                          {
                            field: 'edit',
                            headerName: 'Edit',
                            flex: 0.7,
                            minWidth: 90,
                            sortable: false,
                            renderCell: (params: any) => (
                              <Button
                                size="small"
                                startIcon={<Edit />}
                                sx={{ color: '#166534' }}
                                onClick={() => handleEditPlot(params.id)}
                              >
                                Edit
                              </Button>
                            ),
                          },
                        ])}
                        pagination
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{ pagination: { paginationModel: { pageSize: pageSize } } }}
                        autoHeight
                        disableRowSelectionOnClick
                        sx={{
                          background: '#fff',
                          fontSize: 15,
                          borderRadius: 2,
                          '& .MuiDataGrid-columnHeaders': {
                            background: '#bbf7d0',
                            color: '#166534',
                            fontWeight: 700,
                          },
                          '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #eee',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
          {/* Plot/Unit Listing Module (form) */}
          {projectCreated && !savedPlots && (
            <Card
              variant="outlined"
              sx={{
                mb: 4,
                bgcolor: '#f6fff8',
                borderColor: '#16a34a',
                boxShadow: 6,
                borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 12 },
              }}
            >
              <CardHeader
                title={editPlotIdx !== null ? `Edit Plot/Unit` : `Plot/Unit Listing Module`}
                sx={{ bgcolor: '#16a34a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent>
                <form onSubmit={handlePlotSubmit}>
                  <Stack spacing={2} direction="column">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Plot Number/Name"
                        required
                        value={newPlot.plotNumber}
                        onChange={(e) => setNewPlot({ ...newPlot, plotNumber: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Dimensions (e.g., 30x40)"
                        value={newPlot.dimensions}
                        onChange={(e) => {
                          const dims = e.target.value.split('x').map((d) => Number(d.trim()));
                          const area = dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1]) ? dims[0] * dims[1] : 0;
                          setNewPlot({
                            ...newPlot,
                            dimensions: e.target.value,
                            areaSqft: area,
                            totalPrice: area * (newPlot.sqftPrice || projectData.sqftPrice),
                          });
                        }}
                      />
                      <TextField
                        fullWidth
                        label={`Area in ${unit}`}
                        value={newPlot.areaSqft}
                        onChange={(e) =>
                          setNewPlot({
                            ...newPlot,
                            areaSqft: Number(e.target.value)
                          })
                        }
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label={`${unit} Price`}
                        value={newPlot.sqftPrice || projectData.sqftPrice}
                        onChange={(e) => {
                          const sqftPrice = Number(e.target.value);
                          setNewPlot({
                            ...newPlot,
                            sqftPrice,
                            totalPrice: newPlot.areaSqft * sqftPrice,
                          });
                        }}
                        helperText="Override allowed"
                      />
                      <TextField
                        fullWidth
                        label="Total Price"
                        value={newPlot.totalPrice}
                        onChange={(e) =>
                          setNewPlot({
                            ...newPlot,
                            totalPrice: Number(e.target.value)
                          })
                        }
                      />
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label="Status"
                          value={newPlot.status}
                          onChange={(e) => setNewPlot({ ...newPlot, status: e.target.value as any })}
                        >
                          <MenuItem value="Available">Available</MenuItem>
                          <MenuItem value="Sold">Sold</MenuItem>
                          <MenuItem value="On Hold">On Hold</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Facing</InputLabel>
                        <Select
                          label="Facing"
                          value={newPlot.facing}
                          onChange={(e) => setNewPlot({ ...newPlot, facing: e.target.value as any })}
                        >
                          <MenuItem value="North">North</MenuItem>
                          <MenuItem value="South">South</MenuItem>
                          <MenuItem value="East">East</MenuItem>
                          <MenuItem value="West">West</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <TextField
                      fullWidth
                      label="Remarks"
                      value={newPlot.remarks}
                      onChange={(e) => setNewPlot({ ...newPlot, remarks: e.target.value })}
                    />
                    <Box textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        sx={{
                          bgcolor: '#fff',
                          color: '#16a34a',
                          borderColor: '#16a34a',
                          '&:hover': { bgcolor: '#bbf7d0', borderColor: '#16a34a' },
                          fontWeight: 700,
                          minWidth: 140
                        }}
                        onClick={() => setSavedPlots(true)}
                        type="button"
                      >
                        Save Plots
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: '#16a34a',
                          '&:hover': { bgcolor: '#166534' },
                          fontWeight: 700,
                          minWidth: 140
                        }}
                      >
                        {editPlotIdx !== null ? "Update Plot/Unit" : "Add Plot/Unit"}
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          )}
          {/* Add Project Button after both cards */}
          {projectCreated && savedPlots && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#16a34a',
                  '&:hover': { bgcolor: '#166534' },
                  fontWeight: 700,
                  minWidth: 180,
                  fontSize: 18,
                  boxShadow: 3,
                  borderRadius: 2,
                  letterSpacing: 1,
                }}
                onClick={handleAddProject}
              >
                Add Project
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default RealMySqft;
