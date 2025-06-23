import { Description, Edit, HomeWork, LocationOn, PhotoCamera, UploadFile, VideoLibrary } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';

// Extend ProjectData to include uploaded files for display in allProjects
interface ProjectData {
  projectName: string;
  location: string;
  district: string;
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

const districts = ['District 1', 'District 2', 'District 3'];
const amenitiesList = ['Gated', 'Water Supply', 'Roads', 'Electricity', 'Park'];

const RealMySqft: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    location: '',
    district: '',
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

  // Add state for Google Map link
  const [mapLink, setMapLink] = useState<string>('');

  // Add state to control showing the project creation form
  const [showProjectForm, setShowProjectForm] = useState(false);

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
      district: '',
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
        RealMySqft <span style={{ fontWeight: 400, fontSize: 18, color: '#166534' }}>Property Management</span>
      </Typography>
      <Box
        sx={{
          display: { xs: 'block', md: 'flex' },
          gap: 4,
          alignItems: 'flex-start',
        }}
      >
        {/* Left: All Project Details Cards (old and current) */}
        <Box sx={{ flex: 1, minWidth: 340, maxWidth: 440 }}>
          {/* Render all completed projects */}
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
                  <Typography variant="body2"><b>District:</b> {entry.project.district}</Typography>
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
                  {/* Uploaded files display */}
                  {entry.project.projectMap && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2"><b>Project Layout:</b> {entry.project.projectMap.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={getFileUrl(entry.project.projectMap)}
                          alt="Project Layout"
                          style={{ maxWidth: 220, maxHeight: 160, borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      </Box>
                    </Box>
                  )}
                  {entry.project.plotImageFile && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2"><b>Project Image:</b> {entry.project.plotImageFile.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={getFileUrl(entry.project.plotImageFile)}
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
                  {entry.project.layoutLandPdf && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <b>Layout and Land PDF:</b> {entry.project.layoutLandPdf.name}
                    </Typography>
                  )}
                  {entry.project.landDocsPdf && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <b>Land Documents PDF:</b> {entry.project.landDocsPdf.name}
                    </Typography>
                  )}
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
                  <Typography variant="body2"><b>District:</b> {projectData.district}</Typography>
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
          {/* Show "Create Project" button if not showing form and not editing */}
          {!showProjectForm && !projectCreated && !editProject && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
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
                onClick={() => setShowProjectForm(true)}
              >
                Create Project
              </Button>
            </Box>
          )}
          {/* Project creation form if not created or editing and showProjectForm is true */}
          {((!projectCreated || editProject) && showProjectForm) && (
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
                avatar={<Avatar sx={{ bgcolor: '#16a34a', width: 48, height: 48 }}><HomeWork fontSize="large" /></Avatar>}
                title="Project Creation Module"
                sx={{ bgcolor: '#16a34a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setProjectCreated(true);
                    setEditProject(false);
                    setShowProjectForm(false);
                  }}
                >
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      required
                      value={projectData.projectName}
                      onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                      InputProps={{
                        startAdornment: <HomeWork sx={{ color: '#16a34a', mr: 1 }} />,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      required
                      value={projectData.location}
                      onChange={(e) => setProjectData({ ...projectData, location: e.target.value })}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ color: '#16a34a', mr: 1 }} />,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Google Map Link"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      placeholder="Paste Google Maps share link here"
                    />
                    {mapLink && mapLink.includes('google.com/maps') && (
                      <Box sx={{ mt: 1, mb: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
                        <iframe
                          title="Google Map"
                          src={
                            mapLink.includes('/embed')
                              ? mapLink
                              : mapLink.replace('/maps/', '/maps/embed?pb=')
                          }
                          width="100%"
                          height="250"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </Box>
                    )}
                    <FormControl fullWidth>
                      <InputLabel>District</InputLabel>
                      <Select
                        label="District"
                        value={projectData.district}
                        onChange={(e) => setProjectData({ ...projectData, district: e.target.value })}
                      >
                        {districts.map((d) => (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Project Type</InputLabel>
                      <Select
                        label="Project Type"
                        value={projectData.projectType}
                        onChange={(e) =>
                          setProjectData({ ...projectData, projectType: e.target.value as any })
                        }
                      >
                        <MenuItem value="Plot">Plot</MenuItem>
                        <MenuItem value="Villa">Villa</MenuItem>
                        <MenuItem value="Skyrise">Skyrise</MenuItem>
                      </Select>
                    </FormControl>
                    <Stack direction="row" spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel>Unit</InputLabel>
                        <Select
                          label="Unit"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value as 'Sqft' | 'Sqyd')}
                        >
                          <MenuItem value="Sqft">Sqft</MenuItem>
                          <MenuItem value="Sqyd">Sqyd</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label={`${unit} Price`}
                        value={projectData.sqftPrice}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            sqftPrice: Number(e.target.value)
                          })
                        }
                        InputProps={{
                          sx: { color: '#16a34a', fontWeight: 600 },
                        }}
                      />
                    </Stack>
                    {/* Upload Project Map - Use same UI as Upload Plot Image */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: '#f0fdf4',
                        border: '2px dashed #16a34a',
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                        '&:hover': { borderColor: '#166534', bgcolor: '#bbf7d0' }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#16a34a',
                          width: 48,
                          height: 48,
                          boxShadow: 2,
                          mr: 2,
                        }}
                      >
                        <UploadFile fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#166534' }}>
                          {projectMapFile ? projectMapFile.name : 'Upload Project Layout'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#166534' }}>
                          {projectMapFile ? 'File selected' : 'JPG, PNG, PDF allowed'}
                        </Typography>
                      </Box>
                    </Box>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.png,.pdf"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    {/* Upload Plot Image */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: '#f0fdf4',
                        border: '2px dashed #16a34a',
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                        '&:hover': { borderColor: '#166534', bgcolor: '#bbf7d0' }
                      }}
                      onClick={() => plotImageInputRef.current?.click()}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#16a34a',
                          width: 48,
                          height: 48,
                          boxShadow: 2,
                          mr: 2,
                        }}
                      >
                        <PhotoCamera fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#166534' }}>
                          {plotImageFile ? plotImageFile.name : 'Upload Project Image'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#166534' }}>
                          {plotImageFile ? 'Image selected' : 'JPG, PNG, JPEG allowed'}
                        </Typography>
                      </Box>
                    </Box>
                    <input
                      ref={plotImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setPlotImageFile(file);
                      }}
                      style={{ display: 'none' }}
                    />
                    {/* Upload Plot Video */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: '#f0fdf4',
                        border: '2px dashed #16a34a',
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                        '&:hover': { borderColor: '#166534', bgcolor: '#bbf7d0' }
                      }}
                      onClick={() => plotVideoInputRef.current?.click()}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#16a34a',
                          width: 48,
                          height: 48,
                          boxShadow: 2,
                          mr: 2,
                        }}
                      >
                        <VideoLibrary fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#166534' }}>
                          {plotVideoFile ? plotVideoFile.name : 'Upload Project Video'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#166534' }}>
                          {plotVideoFile ? 'Video selected' : 'MP4, MOV, AVI allowed'}
                        </Typography>
                      </Box>
                    </Box>
                    <input
                      ref={plotVideoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setPlotVideoFile(file);
                      }}
                      style={{ display: 'none' }}
                    />
                    {/* Upload Layout and Land PDF */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: '#f0fdf4',
                        border: '2px dashed #16a34a',
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                        '&:hover': { borderColor: '#166534', bgcolor: '#bbf7d0' }
                      }}
                      onClick={() => layoutLandPdfInputRef.current?.click()}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#16a34a',
                          width: 48,
                          height: 48,
                          boxShadow: 2,
                          mr: 2,
                        }}
                      >
                        <UploadFile fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#166534' }}>
                          {layoutLandPdf ? layoutLandPdf.name : 'Upload Layout and Land PDF'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#166534' }}>
                          {layoutLandPdf ? 'PDF selected' : 'PDF allowed'}
                        </Typography>
                      </Box>
                    </Box>
                    <input
                      ref={layoutLandPdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setLayoutLandPdf(file);
                      }}
                      style={{ display: 'none' }}
                    />
                    {/* Upload Land Documents PDF */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: '#f0fdf4',
                        border: '2px dashed #16a34a',
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                        '&:hover': { borderColor: '#166534', bgcolor: '#bbf7d0' }
                      }}
                      onClick={() => landDocsPdfInputRef.current?.click()}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#16a34a',
                          width: 48,
                          height: 48,
                          boxShadow: 2,
                          mr: 2,
                        }}
                      >
                        <UploadFile fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#166534' }}>
                          {landDocsPdf ? landDocsPdf.name : 'Upload Land Documents PDF'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#166534' }}>
                          {landDocsPdf ? 'PDF selected' : 'PDF allowed'}
                        </Typography>
                      </Box>
                    </Box>
                    <input
                      ref={landDocsPdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setLandDocsPdf(file);
                      }}
                      style={{ display: 'none' }}
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      value={projectData.description}
                      onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      InputProps={{
                        startAdornment: <Description sx={{ color: '#16a34a', mr: 1 }} />,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Amenities
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {amenitiesList.map((a) => (
                          <Chip
                            key={a}
                            label={a}
                            color={projectData.amenities.includes(a) ? 'success' : 'default'}
                            onClick={() => handleAmenityToggle(a)}
                            sx={{
                              bgcolor: projectData.amenities.includes(a) ? '#16a34a' : undefined,
                              color: projectData.amenities.includes(a) ? '#fff' : undefined,
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <CardActions sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          bgcolor: '#16a34a',
                          '&:hover': { bgcolor: '#166534' },
                          fontWeight: 700,
                          letterSpacing: 1,
                          boxShadow: 2,
                        }}
                        fullWidth
                      >
                        Create Project
                      </Button>
                    </CardActions>
                  </Stack>
                </form>
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
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, background: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#bbf7d0', color: '#166534' }}>
                          <th>Plot #</th>
                          <th>Dimensions</th>
                          <th>Area ({unit})</th>
                          <th>{unit} Price</th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Facing</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.plots.map((plot, pidx) => (
                          <tr key={pidx} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{plot.plotNumber}</td>
                            <td>{plot.dimensions}</td>
                            <td>{plot.areaSqft}</td>
                            <td>{plot.sqftPrice || entry.project.sqftPrice}</td>
                            <td>{plot.totalPrice}</td>
                            <td>{plot.status}</td>
                            <td>{plot.facing}</td>
                            <td>{plot.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, background: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#bbf7d0', color: '#166534' }}>
                          <th>Plot #</th>
                          <th>Dimensions</th>
                          <th>Area ({unit})</th>
                          <th>{unit} Price</th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Facing</th>
                          <th>Remarks</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plotData.map((plot, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{plot.plotNumber}</td>
                            <td>{plot.dimensions}</td>
                            <td>{plot.areaSqft}</td>
                            <td>{plot.sqftPrice || projectData.sqftPrice}</td>
                            <td>{plot.totalPrice}</td>
                            <td>{plot.status}</td>
                            <td>{plot.facing}</td>
                            <td>{plot.remarks}</td>
                            <td>
                              <Button
                                size="small"
                                startIcon={<Edit />}
                                sx={{ color: '#166534' }}
                                onClick={() => handleEditPlot(idx)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
};

export default RealMySqft;

