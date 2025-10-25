import { useState, useEffect } from 'react';
import { Project } from './types';
import PlotSetup from './components/PlotSetup';
import Canvas from './components/Canvas';

function App() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('homeLayoutProject');
    if (saved) {
      try {
        setProject(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load project', e);
      }
    }
  }, []);

  const handleStartProject = (plotWidth: number, plotHeight: number, unit: 'feet' | 'meters') => {
    const newProject: Project = {
      plotWidth,
      plotHeight,
      unit,
      rooms: [],
      elements: [],
      hasBorder: true,
      borderThickness: 10
    };
    setProject(newProject);
    localStorage.setItem('homeLayoutProject', JSON.stringify(newProject));
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProject(updatedProject);
    localStorage.setItem('homeLayoutProject', JSON.stringify(updatedProject));
  };

  const handleReset = () => {
    setProject(null);
    localStorage.removeItem('homeLayoutProject');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!project ? (
        <PlotSetup onStart={handleStartProject} />
      ) : (
        <Canvas 
          project={project} 
          onUpdate={handleUpdateProject}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
