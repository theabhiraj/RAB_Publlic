import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Home, Download, Plus, X } from 'lucide-react';
import { Project, Room, Element } from '../types';
import RoomPalette from './RoomPalette';
import ElementPalette from './ElementPalette';
import Toolbar, { Tool } from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import StairsElement from './StairsElement';
import DoorElement from './DoorElement';
import WindowElement from './WindowElement';
import Toast, { ToastType } from './Toast';
import MobileTutorial from './MobileTutorial';
import { exportCanvasAsImage, exportCanvasAsJPG } from '../utils/exportImage';

interface CanvasProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onReset: () => void;
}

const GRID_SIZE = 20;
const ROOM_TYPES = [
  { type: 'Bedroom', color: '#93c5fd', icon: '🛏️' },
  { type: 'Kitchen', color: '#fca5a5', icon: '🍳' },
  { type: 'Bathroom', color: '#a5f3fc', icon: '🚿' },
  { type: 'Living Room', color: '#d9f99d', icon: '🛋️' },
  { type: 'Dining Room', color: '#fde68a', icon: '🍽️' },
  { type: 'Garden', color: '#86efac', icon: '🌳' },
  { type: 'Garage', color: '#d4d4d8', icon: '🚗' },
  { type: 'Office', color: '#c4b5fd', icon: '💼' },
  { type: 'Balcony', color: '#bfdbfe', icon: '🪴' },
  { type: 'Laundry', color: '#e9d5ff', icon: '🧺' },
];

export default function Canvas({ project, onUpdate, onReset }: CanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; type: 'room' | 'element'; offsetX: number; offsetY: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; type: 'room' | 'element'; corner: string } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [activeTab, setActiveTab] = useState<'rooms' | 'elements'>('rooms');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  // Detect mobile device and show tutorial for first-time users
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Show tutorial only on mobile for first-time users
      if (mobile && !localStorage.getItem('tutorialCompleted')) {
        setShowTutorial(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialCompleted', 'true');
  };

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showExportMenu && !target.closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Ctrl+D or Cmd+D to duplicate
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        if (selectedRoom) {
          duplicateRoom(selectedRoom);
        } else if (selectedElement) {
          duplicateElement(selectedElement);
        }
      }
      // Delete key to delete selected item
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedRoom) {
          deleteRoom(selectedRoom);
        } else if (selectedElement) {
          deleteElement(selectedElement);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoom, selectedElement]);

  const getPlotBounds = () => {
    return {
      maxX: project.plotWidth * GRID_SIZE,
      maxY: project.plotHeight * GRID_SIZE
    };
  };

  const constrainToBounds = (x: number, y: number, width: number, height: number, rotation: number = 0) => {
    const bounds = getPlotBounds();
    
    // Calculate the bounding box after rotation from top-left origin
    let minX = x;
    let minY = y;
    let maxX = x;
    let maxY = y;
    
    // Calculate the four corners after rotation
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    // Four corners of the rectangle before rotation (relative to top-left)
    const corners = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: 0, y: height },
      { x: width, y: height }
    ];
    
    // Rotate each corner and find the bounding box
    corners.forEach(corner => {
      const rotatedX = corner.x * cos - corner.y * sin;
      const rotatedY = corner.x * sin + corner.y * cos;
      minX = Math.min(minX, x + rotatedX);
      minY = Math.min(minY, y + rotatedY);
      maxX = Math.max(maxX, x + rotatedX);
      maxY = Math.max(maxY, y + rotatedY);
    });
    
    // Calculate how much we need to adjust to keep within bounds
    let adjustX = 0;
    let adjustY = 0;
    
    if (minX < 0) adjustX = -minX;
    if (minY < 0) adjustY = -minY;
    if (maxX > bounds.maxX) adjustX = bounds.maxX - maxX;
    if (maxY > bounds.maxY) adjustY = bounds.maxY - maxY;
    
    return {
      x: x + adjustX,
      y: y + adjustY
    };
  };

  const addRoom = (type: string, color: string, icon: string) => {
    const width = GRID_SIZE * 5;
    const height = GRID_SIZE * 4;
    const constrained = constrainToBounds(100, 100, width, height);
    
    const newRoom: Room = {
      id: Date.now().toString(),
      type,
      x: constrained.x,
      y: constrained.y,
      width,
      height,
      color,
      icon,
      opacity: 0.85,
    };
    onUpdate({ ...project, rooms: [...project.rooms, newRoom] });
    if (isMobile) showToast(`${icon} ${type} added!`, 'success');
  };

  const addElement = (elementType: any) => {
    const width = elementType.defaultWidth;
    const height = elementType.defaultHeight;
    const constrained = constrainToBounds(150, 150, width, height);
    
    const newElement: Element = {
      id: Date.now().toString(),
      type: elementType.type,
      subType: elementType.subType,
      x: constrained.x,
      y: constrained.y,
      width,
      height,
      rotation: 0,
      icon: elementType.icon,
      opacity: 1,
    };
    onUpdate({ ...project, elements: [...project.elements, newElement] });
    if (isMobile) showToast(`${elementType.icon} ${elementType.label} added!`, 'success');
  };

  const deleteRoom = (id: string) => {
    const room = project.rooms.find(r => r.id === id);
    onUpdate({ ...project, rooms: project.rooms.filter(r => r.id !== id) });
    setSelectedRoom(null);
    if (isMobile && room) showToast(`${room.icon} ${room.type} deleted`, 'info');
  };

  const deleteElement = (id: string) => {
    const element = project.elements.find(e => e.id === id);
    onUpdate({ ...project, elements: project.elements.filter(e => e.id !== id) });
    setSelectedElement(null);
    if (isMobile && element) showToast(`${element.icon} Element deleted`, 'info');
  };

  const rotateElement = (id: string) => {
    onUpdate({
      ...project,
      elements: project.elements.map(e =>
        e.id === id ? { ...e, rotation: (e.rotation + 90) % 360 } : e
      ),
    });
  };

  const updateRoom = (updatedRoom: Room) => {
    const constrained = constrainToBounds(updatedRoom.x, updatedRoom.y, updatedRoom.width, updatedRoom.height);
    onUpdate({
      ...project,
      rooms: project.rooms.map(r => 
        r.id === updatedRoom.id 
          ? { ...updatedRoom, x: constrained.x, y: constrained.y } 
          : r
      ),
    });
  };

  const updateElement = (updatedElement: Element) => {
    const constrained = constrainToBounds(
      updatedElement.x, 
      updatedElement.y, 
      updatedElement.width, 
      updatedElement.height,
      updatedElement.rotation
    );
    onUpdate({
      ...project,
      elements: project.elements.map(e => 
        e.id === updatedElement.id 
          ? { ...updatedElement, x: constrained.x, y: constrained.y } 
          : e
      ),
    });
  };



  const duplicateRoom = (roomId: string) => {
    const room = project.rooms.find(r => r.id === roomId);
    if (!room) return;

    // Create duplicate with offset position
    const offset = GRID_SIZE * 2; // 2 grid units offset
    const newX = room.x + offset;
    const newY = room.y + offset;
    const constrained = constrainToBounds(newX, newY, room.width, room.height);

    const duplicatedRoom: Room = {
      ...room,
      id: Date.now().toString(),
      x: constrained.x,
      y: constrained.y,
    };

    onUpdate({ ...project, rooms: [...project.rooms, duplicatedRoom] });
    setSelectedRoom(duplicatedRoom.id);
    if (isMobile) showToast(`${room.icon} ${room.type} duplicated!`, 'success');
  };

  const duplicateElement = (elementId: string) => {
    const element = project.elements.find(e => e.id === elementId);
    if (!element) return;

    // Create duplicate with offset position
    const offset = GRID_SIZE * 2; // 2 grid units offset
    const newX = element.x + offset;
    const newY = element.y + offset;
    const constrained = constrainToBounds(newX, newY, element.width, element.height, element.rotation);

    const duplicatedElement: Element = {
      ...element,
      id: Date.now().toString(),
      x: constrained.x,
      y: constrained.y,
    };

    onUpdate({ ...project, elements: [...project.elements, duplicatedElement] });
    setSelectedElement(duplicatedElement.id);
    if (isMobile) showToast(`${element.icon} Element duplicated!`, 'success');
  };

  const handleExportPNG = async () => {
    if (!plotRef.current) return;
    setIsExporting(true);
    setShowExportMenu(false);
    if (isMobile) showToast('Preparing export...', 'info');
    try {
      // Create a wrapper with border and title
      const wrapper = document.createElement('div');
      wrapper.style.padding = '40px';
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.style.fontFamily = 'Arial, sans-serif';
      
      // Add title
      const title = document.createElement('div');
      title.style.marginBottom = '20px';
      title.style.textAlign = 'center';
      title.innerHTML = `
        <div style="margin-bottom: 10px;">
          <!--
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          -->
          <h2 style="margin: 0; font-size: 28px; color: #1f2937; font-weight: 700;">RAB's 🏠</h2>
        </div>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          Plot Size: ${project.plotWidth} × ${project.plotHeight} ${project.unit} | 
          Total Area: ${totalArea.toFixed(1)} sq ft | 
          ${project.rooms.length} Rooms
        </p>
      `;
      wrapper.appendChild(title);
      
      // Create a container for centering the plot
      const plotContainer = document.createElement('div');
      plotContainer.style.display = 'flex';
      plotContainer.style.justifyContent = 'center';
      plotContainer.style.alignItems = 'center';
      
      // Clone the plot
      const plotClone = plotRef.current.cloneNode(true) as HTMLElement;
      plotClone.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      plotClone.style.border = '2px solid #e5e7eb';
      plotContainer.appendChild(plotClone);
      wrapper.appendChild(plotContainer);
      
      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.style.color = '#9ca3af';
      footer.textContent = `Created with RAB's 🏠 | ${new Date().toLocaleDateString()}`;
      wrapper.appendChild(footer);
      
      // Temporarily add to document
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      document.body.appendChild(wrapper);
      
      await exportCanvasAsImage(wrapper, `rabs-home-${Date.now()}.png`);
      
      // Clean up
      document.body.removeChild(wrapper);
      if (isMobile) showToast('✅ PNG exported successfully!', 'success');
    } catch (error) {
      if (isMobile) {
        showToast('❌ Export failed. Please try again.', 'error');
      } else {
        alert('Failed to export image. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPG = async () => {
    if (!plotRef.current) return;
    setIsExporting(true);
    setShowExportMenu(false);
    if (isMobile) showToast('Preparing export...', 'info');
    try {
      // Create a wrapper with border and title
      const wrapper = document.createElement('div');
      wrapper.style.padding = '40px';
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.style.fontFamily = 'Arial, sans-serif';
      
      // Add title
      const title = document.createElement('div');
      title.style.marginBottom = '20px';
      title.style.textAlign = 'center';
      title.innerHTML = `
        <div style="margin-bottom: 10px;">
          <!--
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          -->
          <h2 style="margin: 0; font-size: 28px; color: #1f2937; font-weight: 700;">RAB's 🏠</h2>
        </div>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          Plot Size: ${project.plotWidth} × ${project.plotHeight} ${project.unit} | 
          Total Area: ${totalArea.toFixed(1)} sq ft | 
          ${project.rooms.length} Rooms
        </p>
      `;
      wrapper.appendChild(title);
      
      // Create a container for centering the plot
      const plotContainer = document.createElement('div');
      plotContainer.style.display = 'flex';
      plotContainer.style.justifyContent = 'center';
      plotContainer.style.alignItems = 'center';
      
      // Clone the plot
      const plotClone = plotRef.current.cloneNode(true) as HTMLElement;
      plotClone.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      plotClone.style.border = '2px solid #e5e7eb';
      plotContainer.appendChild(plotClone);
      wrapper.appendChild(plotContainer);
      
      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.style.color = '#9ca3af';
      footer.textContent = `Created with RAB's 🏠 | ${new Date().toLocaleDateString()}`;
      wrapper.appendChild(footer);
      
      // Temporarily add to document
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      document.body.appendChild(wrapper);
      
      await exportCanvasAsJPG(wrapper, `rabs-home-${Date.now()}.jpg`);
      
      // Clean up
      document.body.removeChild(wrapper);
      if (isMobile) showToast('✅ JPG exported successfully!', 'success');
    } catch (error) {
      if (isMobile) {
        showToast('❌ Export failed. Please try again.', 'error');
      } else {
        alert('Failed to export image. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleRoomMouseDown = (e: React.MouseEvent, roomId: string, action: 'drag' | 'resize', corner?: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (activeTool === 'erase') {
      deleteRoom(roomId);
      return;
    }
    
    if (activeTool !== 'select') {
      return;
    }

    const room = project.rooms.find(r => r.id === roomId);
    if (!room) return;

    if (action === 'drag') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragging({
        id: roomId,
        type: 'room',
        offsetX: (e.clientX - rect.left) / zoom - pan.x - room.x,
        offsetY: (e.clientY - rect.top) / zoom - pan.y - room.y,
      });
      setSelectedRoom(roomId);
      setSelectedElement(null);
    } else if (action === 'resize' && corner) {
      setResizing({ id: roomId, type: 'room', corner });
      setSelectedRoom(roomId);
      setSelectedElement(null);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string, action: 'drag' | 'resize', corner?: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (activeTool === 'erase') {
      deleteElement(elementId);
      return;
    }
    
    if (activeTool === 'rotate') {
      rotateElement(elementId);
      return;
    }
    
    if (activeTool !== 'select') {
      return;
    }

    const element = project.elements.find(el => el.id === elementId);
    if (!element) return;

    if (action === 'drag') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragging({
        id: elementId,
        type: 'element',
        offsetX: (e.clientX - rect.left) / zoom - pan.x - element.x,
        offsetY: (e.clientY - rect.top) / zoom - pan.y - element.y,
      });
      setSelectedElement(elementId);
      setSelectedRoom(null);
    } else if (action === 'resize' && corner) {
      setResizing({ id: elementId, type: 'element', corner });
      setSelectedElement(elementId);
      setSelectedRoom(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = (e.clientX - rect.left) / zoom - pan.x;
    const mouseY = (e.clientY - rect.top) / zoom - pan.y;

    if (dragging) {
      if (dragging.type === 'room') {
        const room = project.rooms.find(r => r.id === dragging.id);
        if (!room) return;

        const newX = snapToGrid(mouseX - dragging.offsetX);
        const newY = snapToGrid(mouseY - dragging.offsetY);
        const constrained = constrainToBounds(newX, newY, room.width, room.height);

        onUpdate({
          ...project,
          rooms: project.rooms.map(r =>
            r.id === dragging.id ? { ...r, x: constrained.x, y: constrained.y } : r
          ),
        });
      } else if (dragging.type === 'element') {
        const element = project.elements.find(el => el.id === dragging.id);
        if (!element) return;

        let newX = mouseX - dragging.offsetX;
        let newY = mouseY - dragging.offsetY;
        
        // Snap to grid
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);
        
        // Apply boundary constraints with rotation
        const constrained = constrainToBounds(newX, newY, element.width, element.height, element.rotation);

        onUpdate({
          ...project,
          elements: project.elements.map(el =>
            el.id === dragging.id ? { ...el, x: constrained.x, y: constrained.y } : el
          ),
        });
      }
    } else if (resizing) {
      if (resizing.type === 'room') {
        const room = project.rooms.find(r => r.id === resizing.id);
        if (!room) return;

        const bounds = getPlotBounds();
        let newWidth = room.width;
        let newHeight = room.height;
        let newX = room.x;
        let newY = room.y;

        if (resizing.corner.includes('e')) {
          newWidth = snapToGrid(Math.max(GRID_SIZE * 2, Math.min(mouseX - room.x, bounds.maxX - room.x)));
        }
        if (resizing.corner.includes('s')) {
          newHeight = snapToGrid(Math.max(GRID_SIZE * 2, Math.min(mouseY - room.y, bounds.maxY - room.y)));
        }
        if (resizing.corner.includes('w')) {
          const newRight = room.x + room.width;
          newX = snapToGrid(Math.max(0, Math.min(mouseX, newRight - GRID_SIZE * 2)));
          newWidth = newRight - newX;
        }
        if (resizing.corner.includes('n')) {
          const newBottom = room.y + room.height;
          newY = snapToGrid(Math.max(0, Math.min(mouseY, newBottom - GRID_SIZE * 2)));
          newHeight = newBottom - newY;
        }

        onUpdate({
          ...project,
          rooms: project.rooms.map(r =>
            r.id === resizing.id
              ? { ...r, x: newX, y: newY, width: newWidth, height: newHeight }
              : r
          ),
        });
      } else if (resizing.type === 'element') {
        const element = project.elements.find(el => el.id === resizing.id);
        if (!element) return;

        const bounds = getPlotBounds();
        let newWidth = element.width;
        let newHeight = element.height;

        // Account for rotation when calculating max bounds
        const isRotated90or270 = element.rotation === 90 || element.rotation === 270;
        
        if (resizing.corner.includes('e')) {
          const maxWidth = isRotated90or270 ? bounds.maxY - element.y : bounds.maxX - element.x;
          newWidth = snapToGrid(Math.max(GRID_SIZE, Math.min(mouseX - element.x, maxWidth)));
        }
        if (resizing.corner.includes('s')) {
          const maxHeight = isRotated90or270 ? bounds.maxX - element.x : bounds.maxY - element.y;
          newHeight = snapToGrid(Math.max(GRID_SIZE, Math.min(mouseY - element.y, maxHeight)));
        }

        onUpdate({
          ...project,
          elements: project.elements.map(el =>
            el.id === resizing.id ? { ...el, width: newWidth, height: newHeight } : el
          ),
        });
      }
    } else if (isPanning) {
      setPan({
        x: pan.x + (e.clientX - panStart.x) / zoom,
        y: pan.y + (e.clientY - panStart.y) / zoom,
      });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
    setIsPanning(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !dragging && !resizing && activeTool === 'select') {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedRoom(null);
      setSelectedElement(null);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.25, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const calculateDimensions = (room: Room) => {
    const pixelsPerUnit = GRID_SIZE;
    const widthInUnits = room.width / pixelsPerUnit;
    const heightInUnits = room.height / pixelsPerUnit;
    
    // Convert to feet if unit is meters
    if (project.unit === 'meters') {
      const widthInFeet = widthInUnits * 3.281; // 1 meter = 3.281 feet
      const heightInFeet = heightInUnits * 3.281;
      return {
        width: widthInFeet.toFixed(1),
        height: heightInFeet.toFixed(1),
        area: (widthInFeet * heightInFeet).toFixed(1)
      };
    }
    
    return {
      width: widthInUnits.toFixed(1),
      height: heightInUnits.toFixed(1),
      area: (widthInUnits * heightInUnits).toFixed(1)
    };
  };

  const calculateArea = (room: Room) => {
    return calculateDimensions(room).area;
  };

  const totalArea = project.rooms.reduce((sum, room) => {
    return sum + parseFloat(calculateArea(room));
  }, 0);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">RAB's 🏠</h1>
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            <span className="hidden sm:inline">Plot: {project.plotWidth} × {project.plotHeight} {project.unit} | </span>
            <span className="sm:hidden">{project.plotWidth}×{project.plotHeight} {project.unit} | </span>
            Area: {totalArea.toFixed(1)} sq ft
          </p>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Add Items Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors shadow-md"
              title="Add Items"
            >
              <Plus className="w-6 h-6" />
            </button>
          
          {showPalette && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b z-10">
                <div className="flex items-center justify-between p-3">
                  <h3 className="font-bold text-sm">Add Items</h3>
                  <button onClick={() => setShowPalette(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      activeTab === 'rooms' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Rooms
                  </button>
                  <button
                    onClick={() => setActiveTab('elements')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      activeTab === 'elements' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Elements
                  </button>
                </div>
              </div>
              
              <div className="p-2">
                {activeTab === 'rooms' ? (
                  <RoomPalette roomTypes={ROOM_TYPES} onAddRoom={(type, color, icon) => {
                    addRoom(type, color, icon);
                    setShowPalette(false);
                  }} />
                ) : (
                  <ElementPalette onAddElement={(element) => {
                    addElement(element);
                    setShowPalette(false);
                  }} />
                )}
              </div>
            </div>
          )}
          </div>

          {/* Export Button */}
          <div className="relative export-menu-container">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center disabled:opacity-50 transition-colors shadow-md"
              title="Export"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <button
                  onClick={handleExportPNG}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-t-lg flex items-center gap-2 border-b border-gray-100"
                >
                  <Download className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">PNG</div>
                    <div className="text-xs text-gray-500">High quality</div>
                  </div>
                </button>
                <button
                  onClick={handleExportJPG}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">JPG</div>
                    <div className="text-xs text-gray-500">Smaller size</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* New Project Button */}
          <button
            onClick={onReset}
            className="w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center font-bold text-lg transition-colors shadow-md"
            title="New Project"
          >
            N
          </button>
        </div>
        
        <div className="hidden lg:flex gap-1 sm:gap-2 items-center">
          
          <button
            onClick={() => handleZoom(-0.25)}
            className="p-2 hover:bg-gray-100 rounded hidden sm:block"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleZoom(0.25)}
            className="p-2 hover:bg-gray-100 rounded hidden sm:block"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={resetView}
            className="p-2 hover:bg-gray-100 rounded hidden sm:block"
            title="Reset View"
          >
            <Home className="w-5 h-5" />
          </button>
          <div className="relative export-menu-container">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="px-2 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-sm"
              title="Export as Image"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <button
                  onClick={handleExportPNG}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-t-lg flex items-center gap-2 border-b border-gray-100"
                >
                  <Download className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Export as PNG</div>
                    <div className="text-xs text-gray-500">High quality, larger file</div>
                  </div>
                </button>
                <button
                  onClick={handleExportJPG}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Export as JPG</div>
                    <div className="text-xs text-gray-500">Smaller file size</div>
                  </div>
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={onReset}
            className="px-2 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm hidden sm:block"
          >
            New Project
          </button>
        </div>
      </div>

      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:flex w-72 bg-white border-r flex-col overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 px-4 py-3 font-medium ${
                activeTab === 'rooms' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`flex-1 px-4 py-3 font-medium ${
                activeTab === 'elements' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              Elements
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'rooms' ? (
              <>
                <h2 className="font-bold mb-3">Add Rooms</h2>
                <RoomPalette roomTypes={ROOM_TYPES} onAddRoom={addRoom} />
              </>
            ) : (
              <>
                <h2 className="font-bold mb-3">Add Elements</h2>
                <ElementPalette onAddElement={addElement} />
              </>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden relative bg-gray-100"
          style={{ cursor: activeTool === 'erase' ? 'pointer' : 'move' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: touch.clientX,
              clientY: touch.clientY,
              bubbles: true
            });
            e.currentTarget.dispatchEvent(mouseEvent);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: touch.clientX,
              clientY: touch.clientY,
              bubbles: true
            });
            e.currentTarget.dispatchEvent(mouseEvent);
          }}
          onTouchEnd={(e) => {
            const mouseEvent = new MouseEvent('mouseup', {
              bubbles: true
            });
            e.currentTarget.dispatchEvent(mouseEvent);
          }}
        >
          {/* Mobile Quick Actions - Compact FAB */}
          <div className="lg:hidden fixed bottom-[calc(30%+1rem)] left-4 flex gap-2 z-30">
            <button
              onClick={() => handleZoom(0.25)}
              className="fab-button p-3 bg-white rounded-full hover:bg-blue-50 active:bg-blue-100 transition-all shadow-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => handleZoom(-0.25)}
              className="fab-button p-3 bg-white rounded-full hover:bg-blue-50 active:bg-blue-100 transition-all shadow-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={resetView}
              className="fab-button p-3 bg-white rounded-full hover:bg-green-50 active:bg-green-100 transition-all shadow-lg"
              title="Reset View"
            >
              <Home className="w-5 h-5 text-green-600" />
            </button>
          </div>
          <div
            ref={plotRef}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: '0 0',
              width: project.plotWidth * GRID_SIZE,
              height: project.plotHeight * GRID_SIZE,
              position: 'relative',
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              backgroundColor: 'white',
              margin: window.innerWidth < 640 ? '20px' : '50px',
              border: project.hasBorder ? `${project.borderThickness}px solid #1f2937` : 'none',
              touchAction: 'none',
            }}
          >
            {/* Rooms */}
            {project.rooms.map(room => (
              <div
                key={room.id}
                style={{
                  position: 'absolute',
                  left: room.x,
                  top: room.y,
                  width: room.width,
                  height: room.height,
                  backgroundColor: room.color,
                  border: selectedRoom === room.id ? '3px solid #2563eb' : '2px solid #374151',
                  cursor: activeTool === 'select' ? 'move' : activeTool === 'erase' ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  userSelect: 'none',
                  opacity: room.opacity ?? 0.85,
                  touchAction: 'none',
                }}
                onMouseDown={(e) => handleRoomMouseDown(e, room.id, 'drag')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const touch = e.touches[0];
                  handleRoomMouseDown({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    stopPropagation: () => {},
                    preventDefault: () => {},
                  } as any, room.id, 'drag');
                }}
              >
                <div className="text-3xl mb-1">{room.icon}</div>
                <div className="text-center">
                  <div>{room.type}</div>
                  <div className="text-xs">
                    {calculateDimensions(room).width} × {calculateDimensions(room).height} ft
                  </div>
                  <div className="text-xs opacity-75">
                    {calculateDimensions(room).area} sq ft
                  </div>
                </div>

                {/* Resize handles */}
                {selectedRoom === room.id && activeTool === 'select' && (
                  <>
                    {['nw', 'ne', 'sw', 'se'].map(corner => (
                      <div
                        key={corner}
                        style={{
                          position: 'absolute',
                          width: window.innerWidth < 1024 ? '32px' : '12px',
                          height: window.innerWidth < 1024 ? '32px' : '12px',
                          backgroundColor: '#2563eb',
                          border: '3px solid white',
                          borderRadius: '50%',
                          cursor: `${corner}-resize`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          ...(corner.includes('n') ? { top: window.innerWidth < 1024 ? '-16px' : '-6px' } : { bottom: window.innerWidth < 1024 ? '-16px' : '-6px' }),
                          ...(corner.includes('w') ? { left: window.innerWidth < 1024 ? '-16px' : '-6px' } : { right: window.innerWidth < 1024 ? '-16px' : '-6px' }),
                          touchAction: 'none',
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => handleRoomMouseDown(e, room.id, 'resize', corner)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const touch = e.touches[0];
                          handleRoomMouseDown({
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            stopPropagation: () => {},
                            preventDefault: () => {},
                          } as any, room.id, 'resize', corner);
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            ))}

            {/* Elements */}
            {project.elements.map(element => (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  border: selectedElement === element.id ? '2px solid #2563eb' : '2px solid #9ca3af',
                  cursor: activeTool === 'select' ? 'move' : activeTool === 'erase' ? 'pointer' : activeTool === 'rotate' ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: element.width > 40 ? '32px' : '24px',
                  userSelect: 'none',
                  backgroundColor: element.type === 'door' ? 'transparent' : element.type === 'window' ? 'transparent' : element.type === 'stairs' ? 'transparent' : 'transparent',
                  transform: `rotate(${element.rotation}deg)`,
                  transformOrigin: 'top left',
                  opacity: element.opacity ?? 1,
                  touchAction: 'none',
                }}
                onMouseDown={(e) => handleElementMouseDown(e, element.id, 'drag')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const touch = e.touches[0];
                  handleElementMouseDown({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    stopPropagation: () => {},
                    preventDefault: () => {},
                  } as any, element.id, 'drag');
                }}
              >
                {element.type === 'stairs' ? (
                  <StairsElement 
                    width={element.width} 
                    height={element.height} 
                    subType={element.subType}
                  />
                ) : element.type === 'door' ? (
                  <DoorElement 
                    width={element.width} 
                    height={element.height} 
                    subType={element.subType}
                  />
                ) : element.type === 'window' ? (
                  <WindowElement 
                    width={element.width} 
                    height={element.height} 
                    subType={element.subType}
                  />
                ) : (
                  element.icon
                )}

                {/* Resize handles */}
                {selectedElement === element.id && activeTool === 'select' && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        width: window.innerWidth < 1024 ? '32px' : '10px',
                        height: window.innerWidth < 1024 ? '32px' : '10px',
                        backgroundColor: '#2563eb',
                        border: '3px solid white',
                        borderRadius: '50%',
                        cursor: 'se-resize',
                        bottom: window.innerWidth < 1024 ? '-16px' : '-5px',
                        right: window.innerWidth < 1024 ? '-16px' : '-5px',
                        touchAction: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleElementMouseDown(e, element.id, 'resize', 'se')}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const touch = e.touches[0];
                        handleElementMouseDown({
                          clientX: touch.clientX,
                          clientY: touch.clientY,
                          stopPropagation: () => {},
                          preventDefault: () => {},
                        } as any, element.id, 'resize', 'se');
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Panel - Bottom on mobile (30%), Right on desktop */}
        <div className="h-[30%] lg:h-auto lg:w-80 bg-white border-t lg:border-t-0 lg:border-l overflow-y-auto">
          <PropertiesPanel
            selectedRoom={selectedRoom ? project.rooms.find(r => r.id === selectedRoom) || null : null}
            selectedElement={selectedElement ? project.elements.find(e => e.id === selectedElement) || null : null}
            onUpdateRoom={updateRoom}
            onUpdateElement={updateElement}
            onDeleteRoom={() => selectedRoom && deleteRoom(selectedRoom)}
            onDeleteElement={() => selectedElement && deleteElement(selectedElement)}
            onRotateElement={() => selectedElement && rotateElement(selectedElement)}
            onDuplicateRoom={() => selectedRoom && duplicateRoom(selectedRoom)}
            onDuplicateElement={() => selectedElement && duplicateElement(selectedElement)}
            calculateArea={calculateArea}
          />
        </div>

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Mobile Tutorial */}
        {showTutorial && <MobileTutorial onClose={handleTutorialClose} />}
      </div>
    </div>
  );
}

