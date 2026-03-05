import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Snackbar,
  Box,
  LinearProgress,
  Card,
  CardContent,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School,
  Save,
  Delete,
  Edit,
  Add,
  Brightness4,
  Brightness7,
  Add as AddIcon,
} from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import Sidebar from "../navigation pane/Sidebar";
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../../api/plans";

const lightColors = {
  primary: "#4361ee",
  secondary: "#3f37c9",
  success: "#4cc9f0",
  warning: "#f8961e",
  error: "#f72585",
  info: "#4895ef",
  dark: "#3a0ca3",
  light: "#f8f9fa",
};

const darkColors = {
  primary: "#4895ef",
  secondary: "#4361ee",
  success: "#4cc9f0",
  warning: "#f8961e",
  error: "#f72585",
  info: "#3f37c9",
  dark: "#3a0ca3",
  light: "#121212",
};

/**
 * LearningPlanApp – a professional‑looking MUI + Tailwind CSS UI that lets users
 * build, share, and update structured learning plans.
 *
 * Tailwind is used for overall layout, spacing, gradients, shadows, and rounded corners,
 * while MUI provides accessible form inputs and data‑display components.
 */
// ---------- helpers ---------------------------------------------------------
const useLocalStorage = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  const setValue = (value) => {
    const next = value instanceof Function ? value(state) : value;
    setState(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [state, setValue];
};

const navItems = [
  { id: "plan", label: "Plan", icon: <SchoolIcon /> },
  { id: "stats", label: "Stats", icon: <BarChartIcon /> },
];

export function SideNav({ currentView, setView, width = 220 }) {
  return (
    <Box
      sx={{
        width,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: `${width}px`,
        bgcolor: "background.paper",
        color: "text.primary",
        borderRight: 1,
        borderColor: "divider",
        pt: 8,
      }}
    >
      <List disablePadding>
        {navItems.map(({ id, label, icon }) => (
          <ListItemButton
            key={id}
            selected={currentView === id}
            onClick={() => setView(id)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ color: "inherit" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default function LearningPlanApp() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  const [view, setView] = useState("plan");
  const BUCKET_COLOURS = ["#ef4444", "#f97316", "#eab308", "#10b981"];

  const [snack, setSnack] = useState({ open: false, msg: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    resource: "",
    deadline: "",
    progress: 0,
  });

  useEffect(() => {
    setLoading(true);
    getTopics()
      .then((data) => setTopics(data))
      .catch(() => setSnack({ open: true, msg: "Failed to load plans" }))
      .finally(() => setLoading(false));
  }, []);

  const overall = useMemo(() => {
    if (!topics.length) return 0;
    return (
      topics.reduce((sum, t) => sum + Number(t.progress || 0), 0) /
      topics.length
    );
  }, [topics]);

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const { name, value, topicNames } = payload[0].payload;

    return (
      <Paper sx={{ p: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {value} topic{value !== 1 ? "s" : ""} in this range
        </Typography>

        {topicNames.map((t) => (
          <Typography key={t} variant="caption" display="block">
            • {t}
          </Typography>
        ))}
      </Paper>
    );
  };

  const bucketData = useMemo(() => {
    const buckets = [
      { label: "0-25 %", topics: [] },
      { label: "26-50 %", topics: [] },
      { label: "51-75 %", topics: [] },
      { label: "76-100 %", topics: [] },
    ];

    topics.forEach((t) => {
      const p = Number(t.progress || 0);
      const i = p < 25 ? 0 : p < 50 ? 1 : p < 75 ? 2 : 3;
      buckets[i].topics.push(t.title);
    });

    return buckets.map((b, i) => ({
      name: b.label,
      value: b.topics.length,
      fill: BUCKET_COLOURS[i],
      topicNames: b.topics,
    }));
  }, [topics]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? darkColors.primary : lightColors.primary },
      secondary: {
        main: darkMode ? darkColors.secondary : lightColors.secondary,
      },
      background: {
        default: darkMode ? darkColors.light : lightColors.light,
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      success: { main: darkMode ? darkColors.success : lightColors.success },
      warning: { main: darkMode ? darkColors.warning : lightColors.warning },
      error: { main: darkMode ? darkColors.error : lightColors.error },
      info: { main: darkMode ? darkColors.info : lightColors.info },
    },
    typography: { fontFamily: '"Roboto","Helvetica","Arial",sans-serif' },
  });

  const openAdd = () => {
    setForm({ title: "", resource: "", deadline: "", progress: 0 });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setDialogOpen(true);
  };

  const handleDialogSave = () => {
    if (!form.title.trim()) return;

    if (editingId) {
      updateTopic(editingId, form)
        .then((updated) => {
          setTopics((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
          setSnack({ open: true, msg: "Topic updated" });
        })
        .catch(() => setSnack({ open: true, msg: "Update failed" }));
    } else {
      createTopic(form)
        .then((created) => {
          setTopics((prev) => [...prev, created]);
          setSnack({ open: true, msg: "Topic added" });
        })
        .catch(() => setSnack({ open: true, msg: "Create failed" }));
    }

    setDialogOpen(false);
  };

  const deleteRow = (id) => {
    deleteTopic(id)
      .then(() => {
        setTopics((prev) => prev.filter((t) => t.id !== id));
        setSnack({ open: true, msg: "Topic deleted" });
      })
      .catch(() => setSnack({ open: true, msg: "Delete failed" }));
  };

  const columns = [
    { field: "title", headerName: "Topic", flex: 1, editable: true },
    {
      field: "resource",
      headerName: "Resource",
      flex: 1.2,
      renderCell: ({ value }) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-indigo-500 hover:text-indigo-700"
          >
            Link
          </a>
        ) : (
          "—"
        ),
      editable: true,
    },
    {
      field: "deadline",
      headerName: "Deadline",
      width: 130,
      type: "date",
      valueGetter: ({ value }) => (value ? new Date(value) : null),
      valueFormatter: ({ value }) =>
        value
          ? value.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : "—",
      editable: true,
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 160,
      type: "number",
      editable: true,
      renderCell: ({ value = 0 }) => (
        <Box
          sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}
        >
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{ flexGrow: 1, height: 6, borderRadius: 5 }}
          />
          <Typography variant="caption" sx={{ width: 28, textAlign: "right" }}>
            {value}%
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: ({ id, row }) => (
        <>
          <IconButton size="small" onClick={() => openEdit(row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => deleteRow(id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.default",
          ml: { sm: "240px" },
        }}
      >
        <SideNav width={240} currentView={view} setView={setView} />

        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            width: { sm: "calc(100% - 240px)" },
            ml: { sm: "240px" },
            zIndex: (t) => t.zIndex.drawer + 1,
            bgcolor: theme.palette.primary.dark,
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Learning Plan Builder
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setDarkMode((m) => !m)}
              title="Toggle light/dark"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            ml: { sm: "240px" },
            p: 3,
            flexGrow: 1,
            maxWidth: 1200,
            mx: "auto",
            minHeight: "100vh",
          }}
          className="space-y-8"
        >
          <Toolbar />

          {view === "plan" && (
            <Card elevation={3}>
              <CardContent sx={{ height: 540 }}>
                <DataGrid
                  rows={topics}
                  columns={columns}
                  getRowId={(r) => r.id}
                  disableRowSelectionOnClick
                  loading={loading}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      csvOptions: {
                        fileName: "learning-plan",
                        utf8WithBom: true,
                      },
                      printOptions: { disableToolbarButton: true },
                      showQuickFilter: true,
                    },
                  }}
                  processRowUpdate={(newRow) => {
                    // inline edit → call API
                    updateTopic(newRow.id, newRow)
                      .then((updated) => {
                        setTopics((prev) =>
                          prev.map((r) => (r.id === updated.id ? updated : r))
                        );
                        setSnack({ open: true, msg: "Row updated" });
                      })
                      .catch(() =>
                        setSnack({ open: true, msg: "Update failed" })
                      );
                    return newRow;
                  }}
                  onRowEditStop={() =>
                    setSnack({ open: true, msg: "Row saved" })
                  }
                />
              </CardContent>
            </Card>
          )}

          {view === "stats" && topics.length > 0 && (
            <Card
              elevation={2}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6"
            >
              {/* Gauge ----------------------------------------------------------- */}
              <Box className="col-span-1 lg:col-span-2">
                <Typography variant="subtitle1" gutterBottom>
                  Overall Progress
                </Typography>

                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={bucketData}
                      dataKey="value"
                      outerRadius="100%"
                      innerRadius="80%"
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={1}
                      strokeOpacity={0}
                    >
                      {bucketData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Bucket pie ------------------------------------------------------ */}
              <Box className="flex flex-col justify-center items-center">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overall.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  average completion
                </Typography>

                <Legend
                  payload={bucketData.map((d) => ({
                    id: d.name,
                    type: "square",
                    value: `${d.name} (${d.value})`,
                    color: d.fill,
                  }))}
                  wrapperStyle={{ fontSize: 12, marginLeft: 500 }}
                />

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={openAdd}
                >
                  Add Topic
                </Button>
              </Box>
            </Card>
          )}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingId ? "Edit Topic" : "Add New Topic"}
          </DialogTitle>
          <DialogContent dividers className="grid gap-4 pt-4">
            <TextField
              required
              label="Topic Title"
              value={form.title}
              autoFocus
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <TextField
              label="Resource / Link"
              value={form.resource}
              onChange={(e) =>
                setForm((f) => ({ ...f, resource: e.target.value }))
              }
            />
            <TextField
              label="Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.deadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, deadline: e.target.value }))
              }
            />
            <TextField
              label="Progress %"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              value={form.progress}
              onChange={(e) =>
                setForm((f) => ({ ...f, progress: Number(e.target.value) }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDialogSave}
              variant="contained"
              startIcon={<Save />}
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snack.open}
          autoHideDuration={2000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          message={snack.msg}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />

        {view === "plan" && (
          <Tooltip title="Add new plan" arrow>
            <Fab
              color="primary"
              aria-label="add"
              onClick={openAdd}
              sx={{
                position: "fixed",
                bottom: 32,
                right: 32,
                zIndex: (theme) => theme.zIndex.drawer + 2, // sits above drawer & grid
                boxShadow: 6,
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>
    </ThemeProvider>
  );
}
