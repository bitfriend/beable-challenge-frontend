import React, { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { AppBar, Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar, Typography } from '@mui/material';
import { AccountBox, School } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import './App.css';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    width: `calc(100% - 150px)`,
    marginLeft: '150px',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 180px)`,
      marginLeft: '180px'
    },
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - 240px)`,
      marginLeft: '240px'
    },
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - 300px)`,
      marginLeft: '300px'
    },
    [theme.breakpoints.up('xl')]: {
      width: `calc(100% - 360px)`,
      marginLeft: '360px'
    }
  },
  drawer: {
    width: '150px',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: '180px'
    },
    [theme.breakpoints.up('md')]: {
      width: '240px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '300px'
    },
    [theme.breakpoints.up('xl')]: {
      width: '360px'
    }
  },
  drawerPaper: {
    backgroundColor: 'unset !important',
    borderRight: 'unset !important',
    width: '150px',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: '180px'
    },
    [theme.breakpoints.up('md')]: {
      width: '240px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '300px'
    },
    [theme.breakpoints.up('xl')]: {
      width: '360px'
    }
  },
  list: {
    height: '100%',
    borderRight: '1px solid rgba(0,0,0,0.12)'
  }
}));

interface Student {
  id: number;
  name: string;
  score: number;
}

function App() {
  const classes = useStyles();
  const [students, setStudents] = useState<Student[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleSelect = (index: number) => (ev: MouseEvent<HTMLDivElement>) => {
    setActiveIndex(index);
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (activeIndex >= 0 && activeIndex < students.length) {
      const score = parseInt(ev.target.value);
      const records = [...students];
      records[activeIndex].score = score;
      setStudents(records);
    }
  }

  useEffect(() => {
    fetch('http://localhost:5050/api/v1/grades').then(resp => {
      if (resp.ok) {
        return resp.json().then(json => {
          setStudents(json);
          if (json.length > 0) {
            handleSelect(0);
          }
        }).catch(e => {
          console.log(e);
        })
      } else {
        throw new Error(resp.statusText);
      }
    }).catch(e => {
      console.log(e);
    });
  }, [])

  const currentScore = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= students.length) {
      return '';
    }
    return students[activeIndex].score.toString();
  }, [students, activeIndex]);

  const averageScore = useMemo(() => {
    if (students.length === 0) {
      return '';
    }
    let sum = 0;
    for (let student of students) {
      sum += student.score;
    }
    return (sum / students.length).toString();
  }, [students]);

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" margin="auto">Test Scores of Students</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          classes={{
            root: classes.drawer,
            paper: classes.drawerPaper
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List className={classes.list}>
            {students.map((student: Student, index: number) => (
              <ListItemButton
                key={index}
                selected={activeIndex === index}
                onClick={handleSelect(index)}
              >
                <ListItemIcon>
                  <AccountBox />
                </ListItemIcon>
                <ListItemText primary={student.name} />
              </ListItemButton>
            ))}
            <Divider />
            <ListItem>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText primary="Average Score" secondary={averageScore} />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default'
          }}
          height="100vh"
          display="flex"
          flexDirection="column"
        >
          <Toolbar />
          <Box
            sx={{ p: 3 }}
            flexGrow={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              label="Score"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              variant="filled"
              value={currentScore}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
